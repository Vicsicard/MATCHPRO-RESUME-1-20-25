import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  external: [
    '@supabase/supabase-js',
    'openai',
    'openai/resources/chat/completions'
  ],
});
