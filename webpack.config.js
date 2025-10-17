const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    mode: 'development'
  }, argv);
  
  // Solution radicale - remplacer complètement devServer
  config.devServer = {
    ...config.devServer,
    // Garder seulement les options valides
    port: env.port || 19006,
    host: 'localhost',
    hot: true,
    liveReload: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  };
  
  // Supprimer toutes les options problématiques
  delete config.devServer._assetEmittingPreviousFiles;
  delete config.devServer._assetEmittingWorker;
  delete config.devServer._send;
  delete config.devServer._stats;
  
  return config;
};