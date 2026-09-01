import type { CodegenConfig } from '@graphql-codegen/cli';

const endpoint = process.env.GQL_HOST || 'https://secure.woonuxt.com/graphql';
const origin = process.env.APP_HOST || new URL(endpoint).origin;

const schemaLoaderOptions: Record<string, unknown> = {
  headers: {
    Origin: origin,
  },
  assumeValid: true,
};

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [endpoint]: schemaLoaderOptions,
    },
  ],
  documents: ['woonuxt_base/app/queries/**/*.gql'],
  generates: {
    'woonuxt_base/app/gql/schema.ts': {
      plugins: [
        {
          add: {
            content:
              '/* eslint-disable */\n// @ts-nocheck\n// This file is auto-generated. Do not edit manually — run `npm run graphql:codegen` to regenerate.\n',
          },
        },
        'typescript',
      ],
      config: {
        useTypeImports: true,
      },
    },
    'woonuxt_base/app/gql/default.ts': {
      plugins: [
        {
          add: {
            content:
              "/* eslint-disable */\n// @ts-nocheck\n// This file is auto-generated. Do not edit manually — run `npm run graphql:codegen` to regenerate.\nexport * from './schema';\n",
          },
        },
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        rawRequest: false,
        useTypeImports: true,
        importSchemaTypesFrom: 'woonuxt_base/app/gql/schema',
      },
    },
  },
};

export default config;
