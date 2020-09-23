import {
  DocumentClient,
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
  PutItemInputAttributeMap,
  WriteRequests,
} from 'aws-sdk/clients/dynamodb';

import { LambdaLogger } from '@core';
import { PageSchema } from '@db';

export abstract class DynamoDBRepository {
  static TransactWriteMaxBatch = 10;
  constructor(
    protected readonly logger: LambdaLogger,
    private readonly client: DocumentClient,
    private readonly table: string,
  ) {}

  /**
   * Wraps AWS SDK DocumentClient.get
   * @param key The DynamoDb record key
   */
  protected async get<T>(key: DocumentClient.Key): Promise<T | null> {
    const schema = await new Promise((resolve, reject) =>
      this.client.get(
        {
          TableName: this.table,
          Key: key,
        },
        (error, data) => {
          if (error !== null) {
            this.logger.error(`Failed to get data from DynamoDB: ${error.message}`, error, this.constructor.name);
            reject(error);
            return;
          }
          resolve(data.Item);
        },
      ),
    );

    if (schema === undefined) {
      this.logger.warn('Could not find record for key:', key, this.constructor.name);
      return null;
    }
    return schema as T;
  }

  /**
   * Wraps the basic AWS SDK DocumentClient.query
   * @param keyConditionExpression The dynamoDb KeyConditionExpression
   * @param expressionAttrNames The dynamoDb ExpressionAttributeNameMap
   * @param expressionAttrValues The dynamoDb ExpressionAttributeValueMap
   * @param startKey Where we should start our query (if any) for pagination
   * @param indexName The index we should query (if any)
   * @param filterExpression The expresssion in which to filter query results by (if any)
   */
  protected async query<T, K>(
    keyConditionExpression: string,
    expressionAttrNames: DocumentClient.ExpressionAttributeNameMap,
    expressionAttrValues: DocumentClient.ExpressionAttributeValueMap,
    startKey?: DocumentClient.Key,
    indexName?: string,
    filterExpression?: string,
  ): Promise<PageSchema<T, K>> {
    return new Promise((resolve, reject) =>
      this.client
        .query({
          TableName: this.table,
          KeyConditionExpression: keyConditionExpression,
          ExpressionAttributeNames: expressionAttrNames,
          ExpressionAttributeValues: expressionAttrValues,
          FilterExpression: filterExpression,
          IndexName: indexName,
          ExclusiveStartKey: startKey,
        })
        .promise()
        .then(data =>
          resolve({
            items: data.Items as Array<T>,
            next: data.LastEvaluatedKey as K,
          }),
        )
        .catch(error => {
          this.logger.error(`Failed to query data from DynamoDB: ${error.message}`, error, this.constructor.name);
          return reject(error);
        }),
    );
  }

  /**
   * Updates an item given its properties and key.
   * Performs a DynamoDb SET Update Expression for properties to update and a
   * DynamoDb REMOVE Update Expression for properties to remove.
   * Results are returned as a single promise.
   * @param key The key of th item to update
   * @param item The item values to update
   */
  protected async update<T>(key: DocumentClient.Key, item: T): Promise<void> {
    this.logger.trace('update() called', { item }, this.constructor.name);
    const setAttrValues = this.buildSetExpressionAttributeValues(item);
    const setAttrNames = Object.keys(setAttrValues).reduce((obj, key) => {
      obj[`#${key.substring(1)}`] = key.substring(1);
      return obj;
    }, {});
    const setUpdateExp = Object.keys(setAttrNames).reduce((exp, key, idx, arr) => {
      let keyStr = `${key} = :${key.substring(1)}`;
      if (idx !== arr.length - 1) {
        keyStr = `${keyStr}, `;
      }
      return `${exp}${keyStr}`;
    }, 'SET ');
    const setUpdate$ = new Promise<void>((resolve, reject) =>
      this.client
        .update({
          TableName: this.table,
          Key: key,
          UpdateExpression: setUpdateExp,
          ExpressionAttributeNames: setAttrNames,
          ExpressionAttributeValues: setAttrValues,
        })
        .promise()
        .then(() => resolve())
        .catch(error => {
          this.logger.error(
            `Failed to execute SET update expression in DynamoDB: ${error.message}`,
            error,
            this.constructor.name,
          );
          return reject(error);
        }),
    );

    const removeKeys = Object.keys(item).filter(key => !item[key]); // Keys to remove have undefined values
    if (removeKeys.length > 0) {
      // There are item properties to remove
      const removeAttrNames = removeKeys.reduce((obj, key) => {
        obj[`#${key}`] = key;
        return obj;
      }, {});
      const removeUpdateExp = Object.keys(removeAttrNames).reduce((exp, key, idx, arr) => {
        let keyStr = key;
        if (idx !== arr.length - 1) {
          keyStr = `${keyStr}, `;
        }
        return `${exp}${keyStr}`;
      }, 'REMOVE ');
      const removeUpdate$ = new Promise<void>((resolve, reject) =>
        this.client
          .update({
            TableName: this.table,
            Key: key,
            UpdateExpression: removeUpdateExp,
            ExpressionAttributeNames: removeAttrNames,
          })
          .promise()
          .then(() => resolve())
          .catch(error => {
            this.logger.error(
              `Failed to execute REMOVE update expression in DynamoDB: ${error.message}`,
              error,
              this.constructor.name,
            );
            return reject(error);
          }),
      );

      // Return update and remove promise as a single void promise
      return new Promise<void>((resolve, reject) =>
        Promise.all([setUpdate$, removeUpdate$])
          .then(() => resolve())
          .catch(error => reject(error)),
      );
    }

    return setUpdate$;
  }

  /**
   * Wraps the basic AWS SDK DocumentClient.put
   * @param item The item to create
   */
  protected async put<T>(item: T): Promise<T> {
    this.logger.trace('put() called', { item }, this.constructor.name);

    const putItem = {
      TableName: this.table,
      Item: {
        ...item,
      },
    };
    this.logger.trace('putItem', { putItem }, this.constructor.name);

    return new Promise((resolve, reject) =>
      this.client
        .put(putItem)
        .promise()
        .then(() => resolve(item))
        .catch(error => {
          this.logger.error(`Failed to put data into DynamoDB: ${error.message}`, error, this.constructor.name);
          return reject(error);
        }),
    );
  }

  /**
   * Wraps the basic AWS SDK DocumentClient.delete
   * @param key
   */
  protected async delete(key: DocumentClient.Key): Promise<void> {
    this.logger.trace('delete() called', { key }, this.constructor.name);
    return new Promise((resolve, reject) =>
      this.client
        .delete({
          TableName: this.table,
          Key: key,
        })
        .promise()
        .then(() => resolve())
        .catch(error => {
          this.logger.error(`Failed to delete record from DynamoDB: ${error.message}`, error, this.constructor.name);
          return reject(error);
        }),
    );
  }

  /**
   * Wraps the basic AWS SDK DocumentClient.batchWrite
   * @param items The items to write
   */
  protected async batchWrite<T>(items: Array<T>): Promise<Array<T>> {
    const writeRequests: WriteRequests = items.map(i => ({
      PutRequest: { Item: (i as unknown) as PutItemInputAttributeMap },
    }));
    const params: DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [this.table]: writeRequests,
      },
    };
    return new Promise((resolve, reject) =>
      this.client
        .batchWrite(params)
        .promise()
        .then(() => resolve(items))
        .catch(error => {
          this.logger.error(`Failed to batchWrite data into DynamoDB: ${error.message}`, error, this.constructor.name);
          return reject(error);
        }),
    );
  }

  /**
   * Simulates a batch update via DocumentClient.transactWrite.
   * Automatically handles scenarios of transactWrites that are greater than
   * the AWS allowed value. TransactWrites are batched as multiple promises, yielding
   * a single promise result.
   * @param keys The keys of the items to write
   * @param items The items to write
   */
  protected async transactWrite<T>(keys: Array<DocumentClient.Key>, items: Array<Partial<T>>): Promise<void> {
    /**
     * DynamoDb transactWrite only accepts max transactions of 10
     * We need to batch up the batches to account for transactions larger than 10
     * The below logic creates batches for all transactWrite parameters
     */
    const batchSetKeys: Array<Array<DocumentClient.Key>> = [];
    keys.forEach((key, idx) => {
      if (idx % DynamoDBRepository.TransactWriteMaxBatch === 0) {
        batchSetKeys.push([]);
      }
      batchSetKeys[batchSetKeys.length - 1].push(key);
    });
    const setAttrValues = items.map(item => this.buildSetExpressionAttributeValues(item));
    const setBatchAttrValues: Array<Array<ExpressionAttributeValueMap>> = [];
    setAttrValues.forEach((attrValue, idx) => {
      if (idx % DynamoDBRepository.TransactWriteMaxBatch === 0) {
        setBatchAttrValues.push([]);
      }
      setBatchAttrValues[setBatchAttrValues.length - 1].push(attrValue);
    });
    const setBatchAttrNames: Array<Array<ExpressionAttributeNameMap>> = [];
    setBatchAttrValues.forEach(batch => {
      const attrNames = batch.map(valsObj =>
        Object.keys(valsObj).reduce((obj, key) => {
          obj[`#${key.substring(1)}`] = key.substring(1);
          return obj;
        }, {} as ExpressionAttributeNameMap),
      );
      setBatchAttrNames.push(attrNames);
    });
    const setBatchUpdateExpressions: Array<Array<string>> = [];
    setBatchAttrNames.forEach(batch => {
      const attrExpressions = batch.map(namesObj =>
        Object.keys(namesObj).reduce((exp, key, idx, arr) => {
          let keyStr = `${key} = :${key.substring(1)}`;
          if (idx !== arr.length - 1) {
            keyStr = `${keyStr}, `;
          }
          return `${exp}${keyStr}`;
        }, 'SET '),
      );
      setBatchUpdateExpressions.push(attrExpressions);
    });

    // Wraps multi-promise transactWrite into a single void promise
    return new Promise<void>((resolve, reject) =>
      Promise.all(
        batchSetKeys.map(
          (keys, batchIdx) =>
            new Promise((resolve, reject) =>
              this.client
                .transactWrite({
                  TransactItems: keys.map((key, keyIdx) => ({
                    Update: {
                      TableName: this.table,
                      Key: key,
                      ExpressionAttributeValues: setBatchAttrValues[batchIdx][keyIdx],
                      ExpressionAttributeNames: setBatchAttrNames[batchIdx][keyIdx],
                      UpdateExpression: setBatchUpdateExpressions[batchIdx][keyIdx],
                    },
                  })),
                })
                .promise()
                .then(() => resolve())
                .catch(error => {
                  this.logger.error(
                    `Failed to batchWrite pricing into DynamoDB: ${error.message}`,
                    error,
                    this.constructor.name,
                  );
                  return reject(error);
                }),
            ),
        ),
      )
        .then(() => resolve())
        .catch(error => reject(error)),
    );
  }

  private buildSetExpressionAttributeValues<T>(
    obj: T,
    identifier = ':',
    prefix = '',
  ): DocumentClient.ExpressionAttributeValueMap {
    return Object.keys(obj).reduce((map, key) => {
      if (obj[key]) {
        map[`${identifier}${prefix}${key}`] = obj[key];
      }
      return map;
    }, {});
  }
}
