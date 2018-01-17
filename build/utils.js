'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.getMultiEntry = function (globPath) {
  let entries = {}
  glob.sync(globPath).forEach(function (entry) {
    let pathArray
    // basename = path.basename(entry, path.extname(entry))
    // 支持多级目录嵌套，只有取出 src~xxx.js之间的部分作为pathname,所以js文件叫什么没什么关系，html文件名称和js文件所在目录的名称相同，默认路由地址也是目录的地址，有需要可以修改nginx的做新的映射
    pathArray = entry.split('/')
    pathArray = pathArray.slice(pathArray.indexOf('src') + 1, -1)

    let pathname = pathArray.join('/')
    entries[pathname] = entry
  })
  return entries
}


exports.genHtmlWebpackPlugins = function (entries) {
  let isProd = process.env.NODE_ENV === 'production'
  let htmlWebpackPlugins = Object.keys(entries).map(function (pathname) {
    let conf = {
      filename: pathname + '.html',
      template: config.templatePath,
      inject: true,
      // chunks: [pathname],
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }
    if (isProd) {
      conf.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
      conf.chunks = ['vendor', 'manifest', 'common', 'app', pathname]
    } else {
      conf.chunks = ['vendor', pathname]
    }
    return new HtmlWebpackPlugin(conf)
  })

  return htmlWebpackPlugins
}
