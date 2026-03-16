import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

import globals from 'globals';

export default defineConfig([
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
            ecmaVersion: 2017,
            sourceType: 'commonjs',
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true,
                },
            },
        },
        rules: {
            'semi': 1,
            'semi-style': 2,
            'semi-spacing': 1,
            'camelcase': 2,

            'quotes': ['warn', 'single', {
                avoidEscape: true,
                allowTemplateLiterals: false,
            }],

            'brace-style': 2,
            'indent': ['error', 2],
            'no-eval': 2,
            'no-implied-eval': 2,
            'prefer-const': 2,
            'no-var': 1,
            'prefer-arrow-callback': 1,
            'prefer-rest-params': 2,
            'prefer-spread': 2,
            'prefer-template': 1,
            'template-curly-spacing': 1,
            'symbol-description': 2,
            'object-shorthand': 1,
            'prefer-promise-reject-errors': 2,
            'prefer-destructuring': 1,
            'no-new-object': 2,
            'eqeqeq': ['error', 'smart'],
            'curly': ['error', 'all'],
            'dot-notation': 2,
            'no-array-constructor': 2,
            'no-throw-literal': 2,
            'no-self-compare': 2,
            'no-useless-call': 1,
            'consistent-return': 2,
            'spaced-comment': 1,
            'no-multi-spaces': 1,
            'no-new-wrappers': 2,
            'no-script-url': 2,
            'no-void': 1,
            'vars-on-top': 1,
            'yoda': ['error', 'never'],
            'require-await': 1,
            'wrap-iife': ['error', 'inside'],
            'no-loop-func': 2,
            'linebreak-style': 1,
        },
    },
]);
