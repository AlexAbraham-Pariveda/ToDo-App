'use client';
import React, { useState } from 'react';
import { Box, Button, FormHelperText, Grid, Modal, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseService } from '../services/firebase-service';
import { User } from '@/app/types/types';
import { useRouter } from 'next/navigation';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

export default function SignUpModal() {
  const router = useRouter();
  const auth = getAuth(firebaseService);
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (event: any) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        const user = userCredential.user;
        //  setIsOpen(false);
        router.refresh();
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const handleSignIn = (event: any) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredntial) => {
        const user = userCredntial.user;
        console.log(user);
        //   setIsOpen(false);
        router.refresh();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleClose = (reason: string) => {
    if (reason === 'backdropClick') return;
    setIsOpen(!isOpen);
  };

  const displaySignUpIn = () => {
    if (isSigningUp) {
      return (
        <Box sx={style}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  required
                  type="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  required
                  type="password"
                  fullWidth
                />

                <FormHelperText>Have an account? Sign in below</FormHelperText>
              </Grid>

              <Grid item xs={4}>
                <Button variant="outlined" onClick={() => setIsSigningUp(!isSigningUp)}>
                  Sign In
                </Button>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={6}>
                <Button variant="contained" type="submit">
                  Create Account
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      );
    } else {
      return (
        <Box sx={style}>
          <h2>Sign In</h2>
          <form onSubmit={handleSignIn}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  required
                  type="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  required
                  type="password"
                  fullWidth
                />

                <FormHelperText>Have an account? Sign in below</FormHelperText>
              </Grid>

              <Grid item xs={4}>
                <Button variant="outlined" onClick={() => setIsSigningUp(!isSigningUp)}>
                  Sign Up
                </Button>
              </Grid>
              <Grid item xs={4} />
              <Grid item xs={4}>
                <Button variant="contained" type="submit">
                  Sign in
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      );
    }
  };

  return (
    <Modal open={isOpen} onClose={() => handleClose}>
      {displaySignUpIn()}
    </Modal>
  );
}
