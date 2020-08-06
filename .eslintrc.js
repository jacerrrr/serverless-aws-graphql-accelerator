module.exports = {
  env: {
    es2017: true,
    jasmine: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      env: {
        es2017: true,
        jasmine: true,
        node: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier',
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
      ],
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser', // Specifies the ESLint parser,
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier'],
      rules: {
        'prettier/prettier': 2,
        quotes: [
          'error',
          'single',
          {
            avoidEscape: true,
          },
        ],
        semi: ['error', 'always'],
        'simple-import-sort/sort': [
          'error',
          {
            groups: [
              ['reflect-metadata'], // when reflect metadata is imported it should go first
              [
                '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
              ], // internal nodejs
              ['^([a-z]).*'], // packages
              ['@ioc', '^@.*'], // project tsconfig paths
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // parent imports
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // other relative imports
            ],
          },
        ],
      },
    },
  ],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
  },
};
