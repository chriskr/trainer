import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import css from 'rollup-plugin-import-css';
import { template } from './templ/template.js';
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: './src/script.ts',
    output: {
      dir: 'build',
      name: 'script.js',
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      typescript(),
      commonjs(),
      html({
        template,
      }),
      css({ minify: process.env.NODE_ENV === 'production' }),
      process.env.NODE_ENV === 'production' && uglify(),
    ],
  },
];
