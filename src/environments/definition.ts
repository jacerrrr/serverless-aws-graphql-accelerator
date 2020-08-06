export interface Environment {
  env: string;
  logLevel: string;
  origin: string;
  region: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GQLEnvironment extends Environment {}

export interface GQLPlaygroundEnvironment extends Environment {
  httpUrl: string;
  wsUrl: string;
}
