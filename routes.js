const express = require('express')
  , app = express()
  , leaveType = require(__dirname + '/app/controllers/leave-type.js')

app.get('/getLeavetype', leaveType.getLeaveType)
app.get('/getQuota', leaveType.getQuota)
app.post('/createLeaveType',leaveType.create)
app.put('/updateLeaveType',leaveType.updateType)


module.exports = app
