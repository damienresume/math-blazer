/**
 * Configuration for Vitest, the test runner that `wp-scripts test-unit-js` starts.
 *
 * Run the tests with `npm test`.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test files sit next to the code they test and end in `.test.ts`.
    include: ['src/**/*.test.ts'],

    // The tested code is plain TypeScript logic, such as duration formatting and keyboard
    // movement. It does not need a browser, so the faster Node environment is enough.
    environment: 'node',

    // Do not add `describe`, `it` and `expect` as global names. Each test file imports
    // them from 'vitest', so the type check and the editor know where they come from.
    globals: false,
  },
});
