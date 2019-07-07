module.exports = {
    extends: [
        'standard',
        'plugin:node/recommended',
        'plugin:import/warnings',
        'plugin:promise/recommended',
    ],
    plugins: ['standard', 'import', 'promise', 'node'],
    globals: {
        rrequire: false,
        ServiceError: false,
        __: false,
        NUCLEUS_CONFIG: false,
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'max-len': [
            'error',
            110,
            {
                ignoreStrings: true,
                ignoreComments: true,
            },
        ],
        'space-before-function-paren': 0,
        'no-unused-vars': [
            'warn',
            {
                varsIgnorePattern: 'React',
            },
        ],
        'node/no-unsupported-features/es-syntax': 0,
        'object-curly-spacing': ['error', 'always'],
        'no-console': 'warn',
        'no-tabs': 0,
        'comma-dangle': ['error', 'always-multiline'],
        'object-property-newline': 2,
        'object-curly-newline': [
            'error',
            {
                multiline: true,
            },
        ],
        'arrow-parens': ['error', 'as-needed'],
        'no-new': 0,
        'import/no-unresolved': 0,
        'node/no-unsupported-features': 0,
        'prefer-template': 2,
    },
}
