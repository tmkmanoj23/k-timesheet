var config = require(__dirname + '/index.js').initConfig(null,function(err,config){return config})

var mongodb = require('mongodb')
module.exports.init = function (callback) {
 var server = new mongodb.Server(config.databaseHost, config.databasePort, {})
  new mongodb.Db(config.databaseName, server, {w: 1}).open(function (error, client) {
    module.exports.client = client
    callback(error)
  })
}
