import { getAuth } from 'firebase/auth';
import { firebaseService } from '../services/firebase-service';

const auth = getAuth(firebaseService);

export const getUser = () => {
  if (!auth.currentUser) {
    return {} as any;
  }
  return auth.currentUser;
};

export const getUserEmail = () => {
  if (!auth.currentUser) {
    return;
  }
  return auth.currentUser.email;
};
