import { defineConfig } from '@farmfe/core';

export default defineConfig({
  compilation: {
    script: {
      plugins: [],
      target: 'es2022',
      decorators: {
        legacyDecorator: true,
        decoratorMetadata: false,
        decoratorVersion: '2021-12',
        includes: ["src/broken.ts"],
        excludes: ['node_modules/'],
      }
    },
    mode: 'development',
    presetEnv: false,
    minify: false,
    persistentCache: false,
    input: {
      main: 'src/broken.ts',
    },
    output: {
      targetEnv: 'library-node',
      entryFilename: '[entryName].mjs',
      filename: '[name].[hash].mjs',
    },
    treeShaking: false,
  },
});
