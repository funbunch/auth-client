import { useState } from "react"
import axios from "axios"
import jwt from 'jsonwebtoken'
import { Redirect} from "react-router-dom"
import Profile from './Profile.js'

export default function Register(props) {

  // state for the controlled form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
   // state for the flash message from the server
  const [message, setMessage] = useState('')

  // function to handele form submission
const handleSubmit = async e => {
  try {
    e.preventDefault()
    // make a request body
    const requestBody = {
      name: name,
      email: email,
      password: password
    }

    //post a registration date to the server
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/register`, requestBody )
    //take the token out the reponse
    const {token} = response.data

    //set token in local storage
    localStorage.setItem('jwtToken', token)

    //decode the token
      const decoded = jwt.decode(token)

    //set the user in the App.js state
    props.setCurrentUser(decoded)

  } catch (err) {
    //set message of the error is a 400
    if(err.response.status === 400) {
      setMessage(err.response.data.msg)
    } else {
      console.log(err)
    }
  }
}
  console.log('submit the form 🐸')

  //redirect if user is logged in
  if(props.currentUser) return <Redirect to='/profile' component={Profile } currentUser={props.currentUser} />
  
  return( 
    <div>
    <h3>Registration Form:</h3>

    <form onSubmit={handleSubmit}> 
    <label htmlFor="name-input">Name:</label>

      <input 
        type="text"
        placeholder='enter your name user...'
        value={name}
        onChange={e => setName(e.target.value)}
      />
      
      <label htmlFor="name-input">email:</label>

      <input 
        type="text"
        placeholder='enter your email user...'
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <label htmlFor="passord-input">password:</label>

      <input 
        type="password"
        placeholder='enter your password user...'
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <input type="submit"
        value='make new account' 
      /> 
    </form>
    </div>
  )
}