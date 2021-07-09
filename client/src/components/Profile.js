import { useState, useEffect } from "react"
import { Redirect } from "react-router"
import axios from "axios"
import Login from "./Login"


export default function Profile(props) {
  
  //state is info from server
const [message, setMessage] = useState('')

//hit the auth locked route on the backend
useEffect(() => {
  const getPrivateMessage = async () => {
    try {
      // get the jwt from local storage
      const token = localStorage.getItem('jwtToken')


      //make up the auth headers
      const authHeaders = {
        Authorization : token
      }

      //hit the auth locked endpoint
      const response =  await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/auth-locked`, { headers: authHeaders})
      console.log(response.data)
      setMessage(response.data.msg)

      //set state date from the server
    }catch(err) {
      console.log(err)
      //log user out if err
    }
  }
  getPrivateMessage()

})

//redirect if there is not user in state
if(!props.currentUser) return <Redirect to='/login' component={ Login } currentUser= {props.currentUser } />

  return( 
    <div>
      <h4>Greetings {props.currentUser.name} 🐙</h4>
      <h5>your email is { props.currentUser.email}</h5>

      <p>You have a secret message from the user area: </p>
      <p>{message}</p>
    </div>
  )
}