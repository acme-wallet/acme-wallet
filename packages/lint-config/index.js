// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from './prettier.config.js';

/**
 * Regras compartilhadas entre todos os projetos
 */
const sharedRules = {
  'prettier/prettier': ['error', prettierConfig],
};

/**
 * Configurações base compartilhadas
 */
const baseConfigs = [
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
];

/**
 * Configuração para aplicações NestJS/Node
 * @param {string} tsconfigRootDir - O diretório raiz do tsconfig
 */
export const nestjs = (tsconfigRootDir) => [
  {
    ignores: ['eslint.config.mjs', 'dist'],
  },
  ...baseConfigs,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
    },
  },
  {
    rules: {
      ...sharedRules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
];

/**
 * Configuração para aplicações React/Vite
 */
export const react = [
  {
    ignores: ['dist'],
  },
  ...baseConfigs,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...sharedRules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];

export default {
  nestjs,
  react,
};

export { default as prettierConfig } from './prettier.config.js';
