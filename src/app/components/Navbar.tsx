import React, { useState } from 'react';
import styles from '../styles/navbar.module.css';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseService } from '../services/firebase-service';
import { useRouter } from 'next/navigation';

export default function Navbar(props: { userEmail?: any; isBackButton?: boolean }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  const handleSignOut = () => {
    const auth = getAuth(firebaseService);
    signOut(auth)
      .then(() => {
        console.log('Signed out sucessfully');
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.rightAlign}>
      {!props.isBackButton ? (
        <>
          {props.userEmail}
          <IconButton onClick={() => setOpenMenu(!openMenu)}>
            <ExpandMoreIcon />
            <Menu
              style={{ marginTop: '2%' }}
              open={openMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => handleSignOut()}>Sign Out</MenuItem>
            </Menu>
          </IconButton>
        </>
      ) : (
        <Button onClick={() => router.back()}>Back</Button>
      )}
    </div>
  );
}
