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
import ForgotPassword from './ForgotPassword';
import { GoogleIcon } from './CustomIcons';
import AppTheme from '../shared-theme/AppTheme';
import { useGoogleLogin } from '@react-oauth/google';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import Cookies from 'js-cookie';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(353, 54.10%, 54.70%, 0.05) 0px 5px 15px 0px, hsla(147, 82.30%, 44.30%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(128, 83.60%, 42.90%, 0.50) 0px 5px 15px 0px, hsla(39, 83.60%, 42.90%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [errorBackendMessage, seterrorBackendMessage] = React.useState([]);
  const [successBackedMessage, setsuccessBackedMessage] = React.useState([]);


  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await axios.post('http://localhost:80/accounts/api/social/login/google/', {
          'code': codeResponse.code
        }, { withCredentials: true });
        if (response.status === 200 && response.data.access && response.data.user.pk && response.data.user.email) {
          window.location.replace('/products');
          Cookies.set('logged_in', true, { expires: new Date(new Date().getTime() + 15 * 60 * 1000), path: '' })
        } else {
          window.location.replace('/login');
        }
      } catch (error) {
        window.location.replace('/login');
      }
    },
    flow: 'auth-code',
    onError: (error) => {
      if(error){
        window.location.replace('/login');
      }
    }
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    if (!emailError || !passwordError) {
      event.preventDefault();
      try {
        const data = new FormData(event.currentTarget);
        const payload = {
          email: data.get('email'),
          password: data.get('password'),
        };
        const csrftoken = Cookies.get('csrftoken');
        const res = await axios.post('http://localhost:80/api/auth/login/', payload, { withCredentials: true }, {
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
        if (res.status === 200 && res.data.access && res.data.user.pk && res.data.user.email) {
          seterrorBackendMessage('')
          setsuccessBackedMessage('Sucessfully logged in, redirecting.')
          window.location.replace('/products');
          Cookies.set('logged_in', true, { expires: new Date(new Date().getTime() + 15 * 60 * 1000), path: '' })
        } else {
          window.location.replace('/login');
        }
      } catch (error) {
        if (error.status == 400) {
          setsuccessBackedMessage('')
          seterrorBackendMessage(error.response.data.non_field_errors || error.response.data.email)
        }
      }

    } else {
      setEmailError(true);
      setPasswordError(true);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 8 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const resetSendPasswordEmail = async (email) => {
    try{
      const response = await axios.post("http://localhost:80/api/auth/password/reset/", {email}, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      seterrorBackendMessage('')
      setsuccessBackedMessage(response.data.detail);
    } catch(error){
      if(error.status == 400){
        setsuccessBackedMessage('')
        seterrorBackendMessage('Something is wrong or please check your email address.')
      }
    }
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          {errorBackendMessage != '' || successBackedMessage != '' ?
            <Alert icon={successBackedMessage ? <CheckIcon fontSize="inherit" /> : ""} severity={successBackedMessage ? "success" : "error"}>
              {errorBackendMessage}
              {successBackedMessage}
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
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <br/>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>

          <ForgotPassword
            open={open}
            handleClose={handleClose}
            handleResetPassword={(email) => {
              resetSendPasswordEmail(email);
            }}
          />


          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => login()}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
