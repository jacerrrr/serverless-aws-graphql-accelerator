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
* [Visual Studio Code](https://code.visualstudio.com/) - The preferred lightweight TypeScript/JavaScript IDE.
* [Webpack](https://webpack.js.org/) - The best JavaScript bundler.

## Project Structure

```
├── .layer                                                                                          # Stores local AWS layer.
├── .serverless                                                                                     # Stores local AWS Serverless build.
├── .vscode                                                                                         # Holds VSCode configurations.
    ├── [launch.json](https://code.visualstudio.com/docs/editor/debugging)                          # Launch configurations for debugging. app and tests locally
    └── [settings.json](https://code.visualstudio.com/docs/getstarted/settings)                     # Project-based VSCode setting overrides.
├── dist                                                                                            # Transpiled TypeScript output.
├── node_modules                                                                                    # Project local NPM dependencies.
├── spec                                                                                            # Jasmine testing configuration.
    ├── helpers
        └── reporter.js                                                                             # Configures console reporter for Jasmine tests for testing visibility.
    ├── support
        └── [jasmine.json](https://jasmine.github.io/2.1/node.html)                                 # Configures the Jasmine test runner.
├── e2e
    ├── src                                                                                         # Contains E2E TypeScript source code.
    └── [tsconfig.e2e.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)        # TypeScript config for e2e tests.
├── src                                                                                             # Contains APP TypeScript source code.
    ├── core                                                                                        # Contains TS code core across the app.
    ├── database                                                                                    # Contains database code (i.e. schemas, connection singletons, etc.).
    ├── environments                                                                                # Environment configuration referenced from TypeScript files.
    ├── graphql                                                                                     # Contains GraphQL specific code.
        ├── errors                                                                                  # GraphQL TypeScript errors.
        ├── pagination                                                                              # GraphQL pagination models and functions.
        ├── pubsub                                                                                  # GraphQL publish/subscribe models & functions.
        ├── resources                                                                               # GraphQL resources (models, resolvers, services, etc).
            ├── hello                                                                               # Example hello resource (includes models, services, mappers, and resolvers). All new resources should be nested in a folder like this.
            ├── resource.mapper.ts                                                                  # Resource mapper interface to be. implemented by all resource mappers.
            ├── resource.service.ts                                                                 # Resource service abstractions to be. used by all resource services.
        ├── context.ts                                                                              # GraphQL context object available to. all resolvers (should contain things like user attributes, roles, etc.).
        ├── graphql.object.ts                                                                       # Base object inherited by most GraphQL. models
        ├── middlewares.ts                                                                          # Defined middleware for the graphql. server.
        ├── resolvers.ts                                                                            # Barrel export of all GraphQL resolvers.
        ├── schema.ts                                                                               # Function for generating the GraphQL. schema for this project.
        ├── subscribe.ts                                                                            # Custom GraphQL subscribe function for serverless websocket handler.
    ├── handlers                                                                                    # Project lambda handlers.
    ├── helpers                                                                                     # Project helper classes.
    ├── ioc                                                                                         # Dependency Injection (IOC) configuration and constants.
    ├── models                                                                                      # Domain models
    ├── repositories                                                                                # Data repositories (DynamoDb ops, SQL ops, etc.)
    ├── services                                                                                    # Contains application services. (external apis, etc.)
    ├── testing                                                                                     # Unit testing utilities.
        ├── fakes                                                                                   # Unit testing fakes
    ├── utils                                                                                       # Project utilities
    ├── [tsconfig.app.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)        # The extended TypeScript build. configuration the app/api code.
    └── [tsconfig.spec.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)       # The extended TypeScript build. configuration for the unit test code.
├── [.editorconfig](https://editorconfig.org/)
├── [.eslintignore](https://eslint.org/docs/user-guide/configuring)
├── [.eslintrc.js](https://eslint.org/docs/user-guide/configuring)
├── [.gitignore](https://git-scm.com/docs/gitignore)
├── [.huskyrc](https://github.com/typicode/husky/blob/master/README.md)
├── [.nycrc](https://istanbul.js.org/)
├── [.prettierignore](https://prettier.io/docs/en/ignore.html)
├── [.prettierrc](https://prettier.io/docs/en/configuration.html)
├── [docker-compose.yml](https://docs.docker.com/compose/)                                          # Docker compose to launch local DynamoDB.
├── [package.json](https://docs.npmjs.com/creating-a-package-json-file)                             # NPM packages and commands used for this project.
├── README.md                                                                                       # Contains project documentation.
├── [serverless.yml](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/)     # Serverless Frameworks main configuration file.
├── serverless.env.yml                                                                              # Environment configuration to include in the serverless.yml file.
├── serverless.cors.yml                                                                             # CORS environment configuration to include in the serverless.yml file.
├── serverless.vpc.yml                                                                              # AWS VPC environment configuration to include in the serverless.yml file.
├── serverless.custom.yml                                                                           # Custom environment-based variables to include in the serverless.yml file.
├── [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)                # The base TypeScript configuration for TypeScript src and transpilation.
├── [typings.d.ts](https://webpack.js.org/configuration/)                                           # Allows TypeScript to import JSON files as modules
├── [webpack.config.js](https://webpack.js.org/configuration/)                                      # Webpack configuration for creating JavaScript bundles from the TypeScript source.
```

### Getting Started

### Run Locally

#### API

#### Unit Tests

### Debug Locally

#### API

#### Unit Tests
