const express = require('express')
const app = express()
const port = process.env.PORT || '3000'

require('./startup/routes')(app);
app.listen(port)