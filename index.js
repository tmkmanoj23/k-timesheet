const express = require('express')
  , app = express()


if (require.main === module) {
} else {
  module.exports = function(config){
    require(__dirname + '/config/index.js').initConfig(config)
    app.use('/', require(__dirname + '/routes'))

    let response = {
      routes: app,
    }
    return response
  }
}
