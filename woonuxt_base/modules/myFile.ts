import { createResolver, defineNuxtModule, addServerHandler } from '@nuxt/kit';
import { copyFileSync, existsSync, writeFileSync } from 'fs';

// Module options TypeScript inteface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: { name: 'myFiles', configKey: 'myFiles' },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const { resolve } = resolver;

    const dateTime = new Date().toISOString();
    const testFile = 'test.txt';
    const testContent = 'Hello World: ' + dateTime;
    const publicDir = resolve('../../output/public');

    nuxt.hook('build:before', async () => {
      console.log('Copying test file to public directory');
      //   writeFileSync(resolve(`${publicDir}/${testFile}`), testContent);
      writeFileSync(resolve(`./${testFile}`), testContent);
    });
  },
});
