import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import css from 'rollup-plugin-import-css';
import { TEMPLATE } from './dist/template.js';

export default [
  {
    input: './src/template.ts',
    output: {
      dir: 'dist',
      name: 'template.js',
      format: 'es',
    },
    plugins: [typescript()],
  },
  {
    input: './src/script.ts',
    output: {
      dir: 'dist',
      name: 'script.js',
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      typescript(),
      commonjs(),
      html({
        template: () => TEMPLATE,
      }),
      css(),
    ],
  },
];
