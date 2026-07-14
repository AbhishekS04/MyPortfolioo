import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Next.js build output
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Generated PWA service-worker artifacts — do not lint compiled bundles
    'public/sw.js',
    'public/swe-worker-*.js',
    'public/workbox-*.js',
    // CJS utility scripts (use require())
    'scripts/**',
    // Bundle-analyzer config (uses require())
    'next.config.bundle-analyze.js',
    // Misc tool/agent dirs (still present)
    '.agent/**',
    '.claude/**',
  ]),
]);

export default eslintConfig;
