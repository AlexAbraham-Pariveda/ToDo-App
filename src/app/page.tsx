'use client';
import { useEffect, useState } from 'react';
import styles from './styles/page.module.css';
import Navbar from './components/Navbar';
import { getAuth } from 'firebase/auth';
import { firebaseService } from './services/firebase-service';
import { User } from './types/types';
import SignUpModal from './signUp/page';
import { CircularProgress } from '@mui/material';
import { getUser } from './services/utils';

export default function Home() {
  const loggedUser = getUser();
  const [user, setUser] = useState();
  const auth = getAuth(firebaseService);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      setUser(user);
      setIsAuthLoading(!isAuthLoading);
    });
  }, [auth]);

  return (
    <div>
      {!isAuthLoading ? (
        !auth.currentUser ? (
          <SignUpModal />
        ) : (
          <>
            <Navbar userEmail={loggedUser?.email} />
            <div className={styles.center}>
              <h1>Home Page</h1>
            </div>
          </>
        )
      ) : (
        <div className={styles.center}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
