// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export default {
  input: 'index.js',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'gitInfo',
    compact: true,
  },
  plugins: [
    json(),
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
};
