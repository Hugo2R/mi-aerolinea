const path = require('path')
const fs = require('fs')
const express = require('express')

const PORT = process.env.PORT || 3006
const app = express()

app.get('/cities', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
	res.header("Content-Type",'application/json')
  res.sendFile(path.join(__dirname, 'cities.json'))
})

app.get('/flights', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
	res.header("Content-Type",'application/json')
  res.sendFile(path.join(__dirname, 'flights.json'))
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

 

