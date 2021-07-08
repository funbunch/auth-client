require('dotenv').config()
const db = require('./models')
db.connect() //test db connection

const dbTest = async () => { 
  try {  
    //create

    const newUser = new db.User({
      name: 'Me',
      email: 'O@c.com',
      password: '1234'

    })
    
    await newUser.save()
    console.log('new user:', newUser)

    //Read 
    const foundUser = await db.User.findOne({
      name: 'Me'
    })
      
    console.log('found user:', foundUser)
  } catch (err) {
    console.log(err)
  }
}

dbTest()