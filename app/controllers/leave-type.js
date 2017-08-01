'use strict'

const Q = require('q')
, _ = require('lodash')
, moment = require('moment')
, CWCommons = require('cw-commons')
, CWModel = require('cw-models')
, CWError = CWCommons.CWError
, utils = CWCommons.utils
, leaveTypeModel = require('../models/leave-type')

module.exports.getLeaveType = function(req,res) {
	let options = utils.fetchOptionsFromHeaders(req)
	let logger = options.logger
	let type
	if(_.isNil(req.query.type)) {
		logger.error('please send type in query params')
		return utils.sendResponse(res,null,404,'failure','please send type in query params')
	}
	else {
		type = req.query.type
	}
	let selectionCriteria ={
		type: type
	}
	leaveTypeModel.findMany(selectionCriteria,{},options)
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
	let empGrade
	let empLocation
	if(_.isNil(req.query.empGrade)) {
		logger.error('please send emp grade in query params')
		return utils.sendResponse(res,null,404,'failure','please send emp grade in query params')
	}
	else {
		empGrade = req.query.empGrade
	}
	if(_.isNil(req.query.location)) {
		logger.error('please send emp grade in query params')
		return utils.sendResponse(res,null,404,'failure','please send emp grade in query params')
	}
	else {
		empLocation = req.query.location
	}

	let selectionCriteria = {
		assignedTo : {
			$elemMatch: {
				empGrade : empGrade,
				location : empLocation
			}
		}
	}

let assignedToArray = []
	leaveTypeModel.findMany(selectionCriteria,{},options)
		.then(function(records) {
			records = records.map(function(r){
				r.assignedTo.forEach(function(a){
					if(a.empGrade == empGrade) {
						assignedToArray.push(a)
					}
				})
				return {
					type: r.type,
					subtype: r.subtype,
					quota: assignedToArray
				}
			})
			utils.sendResponse(res,records)

		}, function(err){
			logger.error(err)
			return utils.sendResponse(res,null,500,'failure',err)
		})

}
module.exports.create = function(req, res) {
	let options = utils.fetchOptionsFromHeaders(req)
	let logger = options.logger
	let data = {
		type: req.body.type,
		allowOverlap: req.body.allowOverlap,
		subtype: req.body.subtype,
		assignedTo : req.body.assignedTo

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
	let type
	if(_.isNil(req.query.type)) {
		logger.error('please send type in query params')
		return utils.sendResponse(res,null,404,'failure','please send type in query params')
	}
	else {
		type = req.query.type
	}
	let selectionCriteria = {
		type : type
	}
	let dataToUpdate = {
		$set : {
			type: req.body.type,
			allowOverlap: req.body.allowOverlap,
			subtype: req.body.subtype,
			assignedTo : req.body.assignedTo
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
