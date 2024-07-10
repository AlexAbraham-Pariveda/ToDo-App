import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseService } from '../services/firebase-service';

import { Projects } from './projects';

const auth = getAuth(firebaseService);

export class User extends Projects {
  currentUser: any;
  email: any;
  uid: any;
  constructor(currentUser: any) {
    super();
    this.currentUser = currentUser;
    this.email = currentUser?.email;
    this.uid = currentUser?.uid;
  }
}

let thisUser: User | null = null;

onAuthStateChanged(auth, (user) => {
  thisUser = new User(user);
});

export const getUser = () => {
  return thisUser;
};
