const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute.js')

// GET /users -- test api endpoint
  router.get('/', (req, res) => {
    res.json({ msg:' Hi from user endpoint'})

  })

// POST /users/register -- CREATE a new user (aka registration)
router.post('/register', async (req, res) => {
  try {
    //check if user exists
    const findUser = await db.User.findOne({
      email: req.body.email
    })

    //if user found -- dont let them register
    if(findUser) return res.status(400).json({msg: 'user already exist in the db' }) 
    console.log(findUser)
    // hash the password from req.body

    const password = req.body.password
    const salt = 12
    const hashedPassword =  await bcrypt.hash(password, salt)

    // create our new user
    const newUser = await db.User({ 
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    await newUser.save()
    // create the jwt payload

    const payload = { 
      name: newUser.name,
      email: newUser.email,
      id: newUser.id
    }

    // sign the jwt and send a response
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 60 * 60 })
    res.json({ token })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'internal server err'})
  }
})

// POST /user/login -- validdate login credentials 
router.post('/login', async (req,res) => {
  try {
    //try to find user in db from req.body.email
    const findUser = await db.User.findOne({
      email: req.body.email
    })

    const validationFailedMess = 'Incorrect username or password 😌'
    //if user not found - return immediately
    if(!findUser) return res.status(400).json({ msg: validationFailedMess })
    

  // check users pw against what is in the req.body
    const matchPassword = await bcrypt.compare(req.body.password, findUser.password)
  // if the pw doesnt match --return immediately 
    if(!matchPassword) return res.status(400).json({ msg: validationFailedMess })
  //create the jwy payload 

  const payload = {
    name: findUser.name,
    email: findUser.email,
    id:  findUser.id
  }

  // sign the jwt and send it back

  const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
  res.json({token})

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'internal server err'})
  }


})

//GET /auth-locked -- will redirecte if a bad jwt is found
router.get('/auth-locked', authLockedRoute, (req, res) => {
  //do whatever we like with user
  console.log(res.locals.user)
  //send private data back
  res.json({msg: 'welcome to the auth locked route you lucky 🐶'})
})


module.exports = router