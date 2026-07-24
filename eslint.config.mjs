import customerConfig from './apps/services/customer/eslint.config.mjs';
import validationConfig from './packages/validation/eslint.config.mjs';

const customerFiles = ['apps/services/customer/**/*.ts'];
const validationFiles = ['packages/validation/**/*.ts'];

export default [
  { ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'] },
  ...customerConfig
    .filter((c) => c && typeof c === 'object' && !('ignores' in c))
    .map((c) => ({ ...c, files: ['apps/services/customer/**/*.ts'] })),
  ...validationConfig
    .filter((c) => c && typeof c === 'object' && !('ignores' in c))
    .map((c) => ({ ...c, files: ['packages/validation/**/*.ts'] })),
];
