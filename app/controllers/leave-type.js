'use strict'

const Q = require('q')
, _ = require('lodash')
, moment = require('moment')
, CWCommons = require('cw-commons')
, CWModel = require('cw-models')
, userModel = CWModel["user"]
, CWError = CWCommons.CWError
, utils = CWCommons.utils
, leaveTypeModel = require('../models/leave-type')

module.exports.getLeaveType = function(req,res) {
	let options = utils.fetchOptionsFromHeaders(req)
	let logger = options.logger
	leaveTypeModel.findMany({},{},options)
		.then(function(results){
			utils.sendResponse(res,results)

		},function(err){
			logger.error(err)
			utils.sendResponse(res,null,500,'failure',err)
	})

}

module.exports.getQuota = function(req, res) {
	let options = utils.fetchOptionsFromHeaders(req)
	let logger = options.logger
	let userId = req.headers.userId
	let selectionCriteria = {
		_id: userId
	}
	userModel.findOne(selectionCriteria,{},options)
		.then(function(user){
		let selectionCriteria = {
			applicableTo : {
				$elemMatch: {
					empGrade : user.employeeGrade,
					location : user.location
				}
			}
		}


		leaveTypeModel.findMany(selectionCriteria,{},options)
			.then(function(records) {
				records = records.map(function(r){
					let applicableToArray = []
					r.applicableTo.forEach(function(a){
						if(a.empGrade == user.employeeGrade && a.empType == user.employeeType && a.location == user.location) {
							applicableToArray.push(a)
						}
					})
					return {
						type: r.type,
						subtype: r.subtype,
						quota: applicableToArray
					}
				})
				utils.sendResponse(res,records)

			}, function(err){
				logger.error(err)
				return utils.sendResponse(res,null,500,'failure',err)
			})
		},function(err){
		logger.error(err)
		utils.sendResponse(res,null,500,'failure',err)
	})



}
module.exports.create = function(req, res) {
	let options = utils.fetchOptionsFromHeaders(req)
	let logger = options.logger
	let data = {
		type: req.body.type,
		allowOverlap: req.body.allowOverlap,
		subtype: req.body.subtype,
		applicableTo : req.body.applicableTo

	}
	leaveTypeModel.create(data,options)
		.then(function(result){

			logger.info('done')
			utils.sendResponse(res,'done')

		},err => {
			logger.error(err)
			return utils.sendResponse(res,null,500,'failure',err)
		})
}

module.exports.updateType = function(req, res) {
	let options = utils.fetchOptionsFromHeaders(req)
	let logger = options.logger
	let id
	if(_.isNil(req.params.id)) {
		logger.error('please send id params')
		return utils.sendResponse(res,null,404,'failure','please send id params')
	}
	else {
		id = req.params.id.toObjectId()
	}
	let selectionCriteria = {
		_id : id
	}
	let dataToUpdate = {
		$set : {
			type: req.body.type,
			allowOverlap: req.body.allowOverlap,
			subtype: req.body.subtype,
			applicableTo : req.body.applicableTo
		}
	}
	leaveTypeModel.update(selectionCriteria,dataToUpdate,{},options)
		.then(function(result){
			if(result) {
				logger.info('update done')
				utils.sendResponse(res,null,200,'success','successfullyUpdated')
			}
			else {
				logger.info('update not done')
				utils.sendResponse(res,null,404,'success','notUpdated')
			}


		},err => {
			logger.error(err)
			return utils.sendResponse(res,null,500,'failure',err)
		})
}
