module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2016,
        "sourceType": "script"
    },
    "rules": {
      "no-console": ["error", {
        "allow": ["warn", "error", "info"]
      }]
    }
};
