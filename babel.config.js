module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Ajouter ce plugin pour supporter import.meta
      ['babel-plugin-transform-import-meta', { 
        module: 'ES6' 
      }]
    ],
  };
};