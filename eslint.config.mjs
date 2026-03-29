import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**'
        ]
    },
    {
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
                ...globals.jest,
                global: true
            }
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'no-unused-vars': 'off'
        }
    }
];