# Serverless Framework AWS GraphQL Accelerator

This is a GraphQL TypeScript accelerator project leveraging the [Serverless Framework](https://www.serverless.com/) on AWS. This project was created to give you a starting point on developing a robust Serverless GraphQL API in the AWS cloud with Lambda, API Gateway, DynamoDB, and much more!

## Why We Need This

Creating new projects from scratch is always difficult, especially in JavaScript. We often times find ourselves reinventing the wheel a bit on each project, especially within a complex enterprise environment. With the advancement of JavaScript tools and frameworks, it can become very cumbersome to configure projects appropriately so you can get started doing the most important thing - writing code!. This accelerator will give you everything needed to start TypeScript development immediately. This includes:

* Webpack configuration
* Local DynamoDB configuration
* Debugging configuration (VsCode and package.json)
* Unit testing
* Build, Run, and Watch configurations
* Deployment & Packaging

## Prerequisites

The Serverless Framework is capable of packaging and deploying infrastructure and code, which requires setting up proper AWS IAM. However, it's worth noting that we should eventually get to a place where we are not deploying anything via developer machines. CI/CD pipelines should be set up to deploy the infrastructure and code.

* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
* [nodejs](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)
* S3 bucket for Serverless deployment artifacts (must be created before deployments)
* IAM configuration (AWS Access Keys. To deploy locally, give your user an access key with AWS admin privileges)

## Notable Dependencies

This project uses a number of tools to ensure code quality, consistency, and performance. The most notable are listed below:

* [EditorConfig](https://editorconfig.org/) - Cross-IDE configuration for code formatting.
* [ESLint](https://eslint.org/) - A powerful JavaScript/TypeScript linter.
* [Husky](https://github.com/typicode/husky#readme) - Git hooks made easy.
* [Jasmine](https://jasmine.github.io/) - Behavior-driven JavaScript testing framework.
* [Moment.js](https://momentjs.com/) - Easy(ier) JavaScript Date manipulation.
* [NPM](https://www.npmjs.com/) - JavaScript package manager with a number of development configuration helpers.
* [Prettier](https://prettier.io/) - An opinionated code formatter.
* [Serverless Framework](https://serverless.com/) - A framework enabling easy local development and deployment of Serverless API code to multiple clouds.
* [TypeGraphQL](https://typegraphql.com/) - A modern framework for implementing GraphQL in TypeScript
* [Visual Studio Code](https://code.visualstudio.com/) - The preferred lightweight TypeScript/JavaScript IDE.
* [Webpack](https://webpack.js.org/) - The best JavaScript bundler.

## Project Structure

```
├── .layer                            # Stores local AWS layer.
├── .serverless                       # Stores local AWS Serverless build.
├── .vscode                           # Holds VSCode configurations.
    ├── launch.json                   # Launch configurations for debugging. app and tests locally
    └── settings.json                 # Project-based VSCode setting overrides.
├── dist                              # Transpiled TypeScript output.
├── node_modules                      # Project local NPM dependencies.
├── spec                              # Jasmine testing configuration.
    ├── helpers
        └── reporter.js               # Configures console reporter for Jasmine tests for testing visibility.
    ├── support
        └── jasmine.json              # Configures the Jasmine test runner.
├── e2e
    ├── src                           # Contains E2E TypeScript source code.
    └── tsconfig.e2e.json             # TypeScript config for e2e tests.
├── src                               # Contains APP TypeScript source code.
    ├── core                          # Contains TS code core across the app.
    ├── database                      # Contains database code (i.e. schemas, connection singletons, etc.).
    ├── environments                  # Environment configuration referenced from TypeScript files.
    ├── graphql                       # Contains GraphQL specific code.
        ├── errors                    # GraphQL TypeScript errors.
        ├── pagination                # GraphQL pagination models and functions.
        ├── pubsub                    # GraphQL publish/subscribe models & functions.
        ├── resources                 # GraphQL resources (models, resolvers, services, etc).
            ├── hello                 # Example hello resource (includes models, services, mappers, and resolvers).
            ├── resource.mapper.ts    # Resource mapper interface to be. implemented by all resource mappers.
            ├── resource.service.ts   # Resource service abstractions to be. used by all resource services.
        ├── context.ts                # GraphQL context object available to. all resolvers (should contain things like user attributes, roles, etc.).
        ├── graphql.object.ts         # Base object inherited by most GraphQL. models
        ├── middlewares.ts            # Defined middleware for the graphql. server.
        ├── resolvers.ts              # Barrel export of all GraphQL resolvers.
        ├── schema.ts                 # Function for generating the GraphQL. schema for this project.
        ├── subscribe.ts              # Custom GraphQL subscribe function for serverless websocket handler.
    ├── handlers                      # Project lambda handlers.
    ├── helpers                       # Project helper classes.
    ├── ioc                           # Dependency Injection (IOC) configuration and constants.
    ├── models                        # Domain models
    ├── repositories                  # Data repositories (DynamoDb ops, SQL ops, etc.)
    ├── services                      # Contains application services. (external apis, etc.)
    ├── testing                       # Unit testing utilities.
        ├── fakes                     # Unit testing fakes
    ├── utils                         # Project utilities
    ├── tsconfig.app.json             # The extended TypeScript build. configuration the app/api code.
    └── tsconfig.spec.json            # The extended TypeScript build. configuration for the unit test code.
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .huskyrc
├── .nycrc
├── .prettierignore
├── .prettierrc
├── docker-compose.yml                # Docker compose to launch local DynamoDB.
├── package.json                      # NPM packages and commands used for this project.
├── README.md                         # Contains project documentation.
├── serverless.yml                    # Serverless Frameworks main configuration file.
├── serverless.env.yml                # Environment configuration to include in the serverless.yml file.
├── serverless.cors.yml               # CORS environment configuration to include in the serverless.yml file.
├── serverless.vpc.yml                # AWS VPC environment configuration to include in the serverless.yml file.
├── serverless.custom.yml             # Custom environment-based variables to include in the serverless.yml file.
├── tsconfig.json                     # The base TypeScript configuration for TypeScript src and transpilation.
├── typings.d.ts                      # Allows TypeScript to import JSON files as modules
├── webpack.config.js                 # Webpack configuration for creating JavaScript bundles from the TypeScript source.
```

## Getting Started

This section contains everything you need to start development, testing, and deployment.

### NPM Scripts

NPM scripts (defined in the `package.json`) allow your to build, test and run your application. Scripts are defined below and you can run them via `npm run <script>`:

* `build`: Concurrently runs `build:layer` and `build:app`.
* `build:app`: Runs `clean` and then transpiles all non-spec TypeScript files in the `src` folder into the `dist` folder.
* `build:layer`: Builds the AWS local Lambda Layer by installing node_modules in the `.layer/nodejs` folder.
* `clean`: Removes the `dist` folder.
* `debug`: Concurrently runs `start` and `test:watch` in order to provide dynamic unit test execution while developing (TDD).
* `lint`: Executes eslint with the `--fix` flag to run the eslint configuration and automatically fix any issues.
* `start:app`: Runs `serverless-offline` in debug mode (port 5858). This will launch graphql locally and allow you to attach the vscode debugger.
* `start:dynamodb`: Runs the `docker-compose.yml` in order to start dynamodb locally at port 7222 (visit localhost:7222/shell).
* `start`: Concurrently runs `start:app` and `start:dynamodb`.
* `test`: Runs all unit tests with Jasmine and reports to the console.
* `test:watch`: Runs all unit tests every time a TypeScript file is changed.
* `test:coverage`: Generates test coverage reports for unit tests.
* `start`: Concurrently runs `start:` and `start:dynamodb`.

### Debugging Locally with VsCode

VsCode debug configuration is included in the project with three different configurations: These configurations will allow you to set breakpoints throughout the codebase so you can step through your code within the VSCode IDE.

* Attach - Attaches VSCode debugger to existing process. After running `npm start` to start serverless, click on the Attach run execution and make calls to api to step through your code.
* Debug - Runs `npm start` and attaches the debugger at the same time. Start debugging GraphQL in one fell swoop!
* Debug Unit Tests - Executes unit tests with attached debugger. Set breakpoints in your unit tests to step through your test code!

### Experimenting with GraphQL via the GraphQL Playground

After starting GraphQL via `npm start`, navigate to [localhost:3000](http://localhost:3000). You can see your latest GraphQL schema, along with documentation on various operations. You can execute queries, mutations, and subscriptions within the playground. Please note, subscriptions will not work locally and cannot be verified without deployment.

#### GraphQL Subscriptions

GraphQL Subscriptions are powered by WebSockets. Serverless WebSocket functionality is partially enabled by DynamoDB storage of WebSocket connections. However, DynamoDB streams are not supported locally, therefore subscriptions message will not be sent to other connected clients on your local machine. Subscriptions can only be fully tested once deployed.

## Deployment

To deploy to AWS, you only need to run `npx serverless deploy --stage dev` (you can use any stage, but dev is most appropriate in this case) from the project root. Make sure the AWS CLI is setup to use credentials that have Admin Access so you can deploy the resources defined in this application.
