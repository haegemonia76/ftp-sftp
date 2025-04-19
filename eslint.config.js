import { defineConfig } from '@eslint/config'

export default defineConfig({
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 11
    },
    "rules": {
        "indent": ["error", 4],
        "no-param-reassign": "off",
        "consistent-return": "off"
    }
})