const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const reactNative = require("eslint-plugin-react-native");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react,
      "react-native": reactNative
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    }
  }
];
