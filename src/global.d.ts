/**
 * Global type declarations for the whole project.
 *
 * This file contains no imports or exports, so TypeScript treats every declaration
 * in it as global.
 */

/**
 * SCSS files.
 *
 * Block files import their styles for the side effect only, for example
 * `import './style.scss'`. The build tool compiles the SCSS and writes a CSS file,
 * so the code never reads a value from the import. TypeScript still needs to know
 * that the module name is valid, because the `noUncheckedSideEffectImports` option is on.
 */
declare module '*.scss';
