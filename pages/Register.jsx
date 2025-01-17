import React from 'react'
import SignUp from '../components/sign-up/SignUp'
import { GoogleOAuthProvider } from '@react-oauth/google';

const Register = () => {
  return (
    <div>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}><SignUp/></GoogleOAuthProvider>
    </div>
  )
}

export default Register
