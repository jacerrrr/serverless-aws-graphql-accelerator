# Serverless Framework AWS GraphQL Accelerator

Welcome to the a TypeScript accelerator project for the Serverless Framework on AWS. This project was created to give you a starting point on developing Serverless Apis in the AWS cloud with Lambda, API Gateway, DynamoDB, and much more!

## Why We Need This

Creating new projects from scratch is always difficult, especially in JavaScript. With the advancement of JavaScript tools and frameworks, it becomes very cumberson to configure projects appropriately so you can get started doing the most important thing - writing code. This accelerator will give you everything needed to start TypeScript development immediately. This includes:

- Webpack configuration
- Local DynamoDB configuration
- Debugging configuration (VsCode and package.json)
- Unit testing
- Build, Run, and Watch configurations

## Prerequisites

The Serverless Framework is capable of packaging and deploying infrastructure and code, which requires setting up proper IAM. However, we will not be deploying anything via developer machines. CI/CD pipelines should be set up to deploy the infrastructure and code.

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- [nodejs](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- S3 bucket for Serverless deployment artifacts (must be created before deployments)
- IAM configuration

## Notable Dependencies

This project uses a number of tools to ensure code quality, consistentcy, and performance. The most notable are listed below:

- [ESLint](https://eslint.org/) - A powerful JavaScript/TypeScript linter
- [Prettier](https://prettier.io/) - An opinionated code formatter
- [EditorConfig](https://editorconfig.org/) - Cross-IDE configuration for code formatting
- [Serverless Framework](https://serverless.com/) - A framework enabling easy deployment of Serverless API code to multiple clouds
- [Webpack](https://webpack.js.org/) - The best JavaScript bundler
- [NPM](https://www.npmjs.com/) - JavaScript package manager with a number of development configuration helpers
- [Jasmine](https://jasmine.github.io/) - Behaivor-driven JavaScript testing framework

## Project Structure

```
├── .vscode                                                                                         # Holds VSCode configurations
    ├── [launch.json](https://code.visualstudio.com/docs/editor/debugging)                          # Launch configurations for debugging app and tests locally
    └── [settings.json](https://code.visualstudio.com/docs/getstarted/settings)                     # Project-based VSCode setting overrides
├── dist                                                                                            # Transpiled TypeScript output
├── node_modules                                                                                    # Project NPM dependencies
├── spec                                                                                            # Jasmine testing configuration
    ├── helpers
        └── reporter.js                                                                             # Configures console reporter for Jasmine tests for testing visibility
    ├── support
        └── [jasmine.json](https://jasmine.github.io/2.1/node.html)                                 # Configures the Jasmine test runner
├── src                                                                                             # Contains ALL TypeScript source code
    ├── api                                                                                         # Contains all API specific code (i.e. handlers, errors, middlewares, IOC containers, etc.)
        ├── resources                                                                               # Contains all API resource code (i.e. endpoint handlers, dedicated services, etc.)
            └── hello-world                                                                         # Example containing specific code for the /hello-world endpoint
    ├── dal                                                                                         # Contains all data access files/services
    ├── database                                                                                    # Contains database code (i.e. schemas, connection singletons, etc.)
    ├── environments                                                                                # Environment configuration referenced from TypeScript files
    ├── services                                                                                    # Contains common services used accross resources
    ├── [tsconfig.app.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)        # The extended TypeScript build configuration the app/api code
    └── [tsconfig.spec.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)       # The extended TypeScript build configuration for the unit test code
├── README.md                                                                                       # Contains project documentation
├── [package.json](https://docs.npmjs.com/creating-a-package-json-file)                             # NPM packages and commands used for this project.
├── [serverless.yml](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/)     # Serverless Frameworks main configuration file.
├── serverless.env.yml                                                                              # Environment configuration to include in the serverless.yml file
├── serverless.cors.yml                                                                             # CORS environment configuration to include in the serverless.yml file
├── serverless.vpc.yml                                                                              # AWS VPC environment configuration to include in the serverless.yml file
├── serverless.custom.yml                                                                           # Custom environment-based variables to include in the serverless.yml file
├── [webpack.config.js](https://webpack.js.org/configuration/)                                      # Webpack configuration for creating JavaScript bundles from the TypeScript source
├── [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)                # The base TypeScript configuration for TypeScript src and transpilation
├── [.prettierrc.js](https://prettier.io/docs/en/configuration.html)                                # Configures [Prettier](https://prettier.io/) standards
├── [.eslintrc.js](https://eslint.org/docs/user-guide/configuring)                                  # Configures JS and TS linter rules
├── [.gitignore](https://git-scm.com/docs/gitignore)                                                # Lists files and folders that should not be commited to source
├── [.editorconfig](https://editorconfig.org/#overview)                                             # Cross-IDE configuration for consistent coding styles
├── [docker-compose.yml](https://docs.docker.com/compose/)                                          # Configures local dependencies (i.e. dynamodb)
```

### Getting Started

### Run Locally

#### API

#### Unit Tests

### Debug Locally

#### API

#### Unit Tests
