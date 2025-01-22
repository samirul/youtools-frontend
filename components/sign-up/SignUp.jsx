import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import { GoogleIcon } from './CustomIcons';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import {useGoogleLogin} from '@react-oauth/google';
import Cookies from 'js-cookie';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(128, 83.60%, 42.90%, 0.50) 0px 5px 15px 0px, hsla(39, 83.60%, 42.90%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [confirmpasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmpasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [backendErrorMessage, setBackendErrorMessage] = React.useState([])
  const [profilecreatedMessage, setprofilecreatedMessage] = React.useState('')

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmpassword = document.getElementById('confirm_password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage(' Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage(' Password must be at least 8 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (confirmpassword.value && password.value != confirmpassword.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage(' Confirm password and password is not matching.')
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    if (!nameError || !emailError || !passwordError || !confirmpasswordError) {
      event.preventDefault();
      try {
        const csrftoken = Cookies.get('csrftoken');
        const data = new FormData(event.currentTarget);
        const response = await axios.post("http://localhost:8000/api/registration/", {
          "email": data.get('email'),
          "password1": data.get('password'),
          "password2": data.get('password2'),

          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
        if (response.status == 201) {
          setprofilecreatedMessage(response.data.detail)
          setBackendErrorMessage('')
        }
      } catch (error) {
        if (error.status == 400) {
          if(error.response.data.email){
            setBackendErrorMessage('')
            setBackendErrorMessage(error.response.data.email);
          }
          if(error.response.data.password1){
            setBackendErrorMessage('')
            setBackendErrorMessage(error.response.data.password1);
          }
          if(error.response.data.non_field_errors){
            setBackendErrorMessage('')
            setBackendErrorMessage(error.response.data.non_field_errors);
          }
          setprofilecreatedMessage('')
        } else if (error.status == 500) {
          setBackendErrorMessage('')
          setBackendErrorMessage("Email is already created.");
          setprofilecreatedMessage('')
        }
        
      }

    } else {
      setNameError(true);
      setEmailError(true);
      setPasswordError(true);
      setConfirmPasswordError(true);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        axios.interceptors.request.use(
          (config) => {
            config.withCredentials = true
            return config
          },
          (error) => {
            return Promise.reject(error)
          }
        )
        const response = await axios.post('http://localhost:8000/accounts/api/social/login/google/',{
          'code': codeResponse.code
        },{ withCredentials: true });
        if (response.status === 200 && response.data.access && response.data.user.pk && response.data.user.email) {
          window.location.replace('/');
        } else {
          window.location.replace('/login');
        }
      } catch (error) {
        console.error('Authentication Error', error);
      }
    },
    flow: 'auth-code',
    onError: (error) => {
      console.error('Login Failed:', error);
    }
  });

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          {profilecreatedMessage != '' || backendErrorMessage != '' || confirmpasswordErrorMessage != ''  ?
            <Alert icon={profilecreatedMessage ?<CheckIcon fontSize="inherit" /> : "" } severity={profilecreatedMessage ? "success" : "error"}>
              {profilecreatedMessage}
              {backendErrorMessage}
              {confirmpasswordErrorMessage}
            </Alert> : ""
          }
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Youtools
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Confirm Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password2"
                placeholder="••••••"
                type="password"
                id="confirm_password"
                autoComplete="confirm-password"
                variant="outlined"
                error={confirmpasswordError}
                helperText={confirmpasswordErrorMessage}
                color={confirmpasswordError ? 'error' : 'primary'}
              />
            </FormControl>
            <br />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => login()}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
