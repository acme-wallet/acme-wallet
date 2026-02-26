import { nestjs } from '@acme/lint-config';

export default [
  ...nestjs(import.meta.dirname),
  {
    // Rules for .use-case.ts files.
    files: ['**/*.use-case.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        // 1. Exported classes must have the "UseCase" suffix in their name.
        {
          selector:
            ':matches(ExportDefaultDeclaration, ExportNamedDeclaration) > ClassDeclaration:not([id.name=/UseCase$/])',
          message:
            'Exported classes in a .use-case.ts file must have the UseCase suffix.',
        },
        // 2. Exported classes must implement the IUseCase interface.
        {
          selector:
            ':matches(ExportDefaultDeclaration, ExportNamedDeclaration) > ClassDeclaration:not(:has(TSClassImplements > Identifier[name="IUseCase"]))',
          message:
            'Exported classes in a .use-case.ts file must implement the IUseCase interface.',
        },
      ],
    },
  },
];
