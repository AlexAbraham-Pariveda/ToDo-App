'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/page.module.css';
import { deleteUser, getAuth } from 'firebase/auth';
import { firebaseService } from '../services/firebase-service';
import { Button, Grid } from '@mui/material';

import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { getUser } from '../services/utils';

export default function Profile() {
  const router = useRouter();
  const auth = getAuth(firebaseService);
  const loggedUser = getUser();

  const handleDelete = () => {
    if (loggedUser?.currentUser !== null) {
      deleteUser(loggedUser?.currentUser)
        .then(() => {
          router.back();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  return (
    <>
      <Navbar isBackButton />
      <div className={styles.center}>
        <Grid>
          <Grid item xs={12}>
            <h1>Profile</h1>
          </Grid>
          <Grid item xs={12}>
            <p>{loggedUser?.email}</p>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="error" onClick={() => handleDelete()}>
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
