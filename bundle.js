import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

await build({
  entryPoints: ['./src/server/**/*.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outdir: 'dist/server',
  format: 'esm',
  sourcemap: false,
  plugins: [nodeExternalsPlugin()],
  external: ['express'],
});

console.log('✅ Server bundle created');
