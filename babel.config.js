module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin",
      [
        "module:react-native-dotenv",
        {
          envName: 'APP_ENV', // Optional: name of the environment variable that contains the path to your .env file
          moduleName: '@env', // The module name for importing environment variables
          path: '.env', // Path to the .env file
        },
      ],
    ],
  };
};
