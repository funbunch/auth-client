require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
//connect to db 
const db = require('./models')
db.connect()

//config express
const app = express()
const PORT = process.env.PORT || 3020
const rowdyResults = rowdy.begin(app)

//middleware
app.use(cors())
//body parser middlewares
app.use(express.urlencoded({ extends: false }))
app.use(express.json()) //for the requst body
app.use((req, res, next) => {
  console.log(`incoming req on: ${req.method} ${req.url}`)
  res.locals.anything = '🐤'    
  next()
})

//controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))

const middleware = (req, res, next) => {
  console.log('i am a route specific middle 🦋')
  next()
}

app.get('/', middleware, (req, res) => {
  console.log(res.locals)
  res.json({msg: 'hello from the backend'})
})

//listen on a port
app.listen(PORT, () => {
  rowdyResults.print()
  console.log(`listening on port: ${PORT} 🦴`)

})