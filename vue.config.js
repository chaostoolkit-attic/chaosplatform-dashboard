module.exports = {
   transpileDependencies: ['vuex-module-decorators'],
   devServer: {
      proxy: 'http://localhost:8090'
   }
}