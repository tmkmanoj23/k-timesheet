const express = require('express')
  , app = express()
  , leaveType = require(__dirname + '/app/controllers/leave-type.js')

app.put('/leaveType/update/:id',leaveType.updateType)
app.get('/leaveTypes', leaveType.getLeaveType)
app.get('/leaveTypes/quota', leaveType.getQuota)
app.post('/leaveType/create',leaveType.create)



module.exports = app
