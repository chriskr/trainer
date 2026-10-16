import { readdirSync, readFileSync } from 'node:fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-import-css';
import { template } from './templ/template.js';

const isProduction = process.env.NODE_ENV === 'production';

// Copies everything in public/ (web app manifest, icons) next to index.html.
const copyPublic = () => ({
  name: 'copy-public',
  generateBundle() {
    for (const fileName of readdirSync('public')) {
      this.emitFile({
        type: 'asset',
        fileName,
        source: readFileSync(`public/${fileName}`),
      });
    }
  },
});

export default [
  {
    input: './src/script.ts',
    output: {
      dir: 'build',
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      typescript(),
      commonjs(),
      css({ output: 'bundle.css', minify: isProduction }),
      copyPublic(),
      isProduction && terser(),
      // Last, so the CSS and minified JS exist when the template hashes them.
      html({
        template,
      }),
    ],
  },
];
