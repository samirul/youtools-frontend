import React from 'react'
import SignIn from '../components/sign-in/SignIn'
import { GoogleOAuthProvider } from '@react-oauth/google'

const Login = () => {
  return (
    <div>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}><SignIn/></GoogleOAuthProvider>
    </div>
  )
}

export default Login
