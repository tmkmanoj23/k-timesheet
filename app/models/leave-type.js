var MongoClient = require('mongodb').MongoClient
, assert = require('assert')
, Q = require('q')
, url = "mongodb://localhost:27017/britannia"


module.exports.create = function(data, options) {
	let logger = options.logger
		q = Q.defer()
	MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err)
  	console.log("succesfully connected to db")
  	db.collection('leave_type').insert(data,function(err,result){
  		if(err) {
  			logger.error(err)
  			q.reject(err)
  			db.close()
  			return q.promise
  		}
  		else {
  			logger.info('record created successfully')
  			q.resolve('success')
  			db.close()
  			logger.info('closed the db ')

  		}
  	})

 });
	return q.promise
}
module.exports.findMany = function(selectionCriteria,queryOptions,options) {
	let logger = options.logger
		q = Q.defer()
	MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err)
  	console.log("succesfully connected to db")
  	db.collection('leave_type').find(selectionCriteria, queryOptions).toArray(function(err,result){
  		if(err) {
  			logger.error(err)
  			q.reject(err)
  			db.close()
  			return q.promise
  		}
  		else {
  			q.resolve(result)
  			db.close()
  			logger.info('closed the db ')

  		}
  	})

 });
	return q.promise
}
module.exports.update = function(selectionCriteria,dataToUpdate,updateOptions,options) {
	let logger = options.logger
		q = Q.defer()
	MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err)
  	console.log("succesfully connected to db")
	  db.collection('leave_type').update(selectionCriteria, dataToUpdate, updateOptions, (err, doc) => {
	    if (err) {
	      logger.error(err)
	      q.reject(err)
	      db.close()
	      return q.promise
	    }
	      if(doc.result.nModified == 0 && !doc.result.upserted){
	        q.resolve(false)
	        db.close()
	      }
	      else if(doc.result.nModified > 0) {
	        q.resolve(true)
	        db.close()
	      }
		});
	})
	return q.promise
}
