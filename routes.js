const express = require('express')
  , app = express()
  , leaveType = require(__dirname + '/app/controllers/leave-type.js')

app.get('/getLeavetype', leaveType.get)
app.post('/createLeaveType',leaveType.create)
app.put('/updateLeaveType',leaveType.update)


module.exports = app
