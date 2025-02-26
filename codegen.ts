import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.GQL_HOST || 'https://modaprimeusa.com/graphql',
  documents: ['./woonuxt_base/app/queries/**/*.gql'],
  generates: {
    './types/graphql.ts': {
      plugins: ['typescript', 'typescript-operations']
    }
  }
};

export default config; 
