// @ts-check
import { nestjs } from '@acme/lint-config';

export default [
  ...nestjs(import.meta.dirname),
  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'ClassDeclaration[id.name=/UseCase$/]:not(:has(TSClassImplements > Identifier[name="IUseCase"]))',
          message:
            'Classes with the sufix name UseCase must implement the IUseCase interface.',
        },
      ],
    },
  },
  {
    files: ['**/*.use-case.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'ClassDeclaration:not(:has(TSClassImplements > Identifier[name="IUseCase"]))',
          message:
            'Classes within a .use-case.ts file must implement the IUseCase interface.',
        },
      ],
    },
  },
];
