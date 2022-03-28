module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/cosmos-api': {
        target: 'https://api.cosmos.network',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/cosmos-api': ''
        }
      },
      '/cosmos-rpc': {
        target: 'https://rpc.cosmos.network',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/cosmos-rpc': ''
        }
      },
      '/rest-graph': {
        target: 'https://center-rest.nutbox.app/v1/common/search',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/rest-graph': ''
        }
      }
    }
  },
  runtimeCompiler: true,
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ['*', '.mjs', '.js', '.vue', '.json', '.gql', '.graphql']
    },
    module: {
      rules: [ // fixes https://github.com/graphql/graphql-js/issues/1272
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/static/css/mixin.scss";'
      }
    }
  }
}
