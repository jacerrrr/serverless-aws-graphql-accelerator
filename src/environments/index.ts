import { Environment, GQLEnvironment, GQLPlaygroundEnvironment } from './definition';

export const environment: Environment = {
  application: process.env.APPLICATION as string,
  environment: process.env.ENVIRONMENT as string,
  logLevel: process.env.LOG_LEVEL as string,
  origin: process.env.CORS_ORIGIN as string,
  region: process.env.AWS_REGION as string,
};

export const gqlEnvironment: GQLEnvironment = {
  ...environment,
};

export const gqlPlaygroundEnvironment: GQLPlaygroundEnvironment = {
  ...environment,
  httpUrl: process.env.HTTP_URL as string,
  wsUrl: process.env.WS_URL as string,
};

export { Environment, GQLEnvironment, GQLPlaygroundEnvironment };
