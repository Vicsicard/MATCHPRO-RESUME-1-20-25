import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    '@supabase/supabase-js',
    'openai',
    'openai/resources/chat/completions'
  ],
});