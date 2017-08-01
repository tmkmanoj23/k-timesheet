'use strict'

var projectName = "k-timesheet"
  , appDir = __dirname.match(new RegExp("(.*\/("+ projectName +")\/)(.*)$"))[1]
  , extend = require('extend')
  , currentEnv = process.env.NODE_ENV || 'development'
  , envFilePath = __dirname + "/env/" + currentEnv + ".js"
  , environmentOptions = require(envFilePath)


module.exports.initConfig = function (config, cb) {
  var configObj = {}
  if (config) {
    extend(true, configObj, config)
    configObj.mainAppDir = config.mainAppDir
  }
  else {
    configObj.databaseHost = environmentOptions.database.host
    configObj.databasePort = environmentOptions.database.port
    configObj.databaseName = environmentOptions.database.name
    configObj.databaseUrl = environmentOptions.database.path + environmentOptions.database.name
  }
  configObj.appDir = appDir
  configObj.serviceUrl = environmentOptions.PI.host
  configObj.webUrl = environmentOptions.web.host
  if (cb) {
    return cb(null, configObj)
  }
  else {
    module.exports.config = configObj
  }
}
