import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, firebaseService } from '../services/firebase-service';
import { getDatabase, onValue, ref } from 'firebase/database';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

const auth = getAuth(firebaseService);

export class User {
  currentUser: any;
  email: any;
  uid: any;
  constructor(currentUser: any) {
    this.currentUser = currentUser;
    this.email = currentUser?.email;
    this.uid = currentUser?.uid;
  }

  async getProjects() {
    const projects: any = [];
    try {
      const projectSnapshot = await getDocs(collection(db, 'Users', this.uid, 'projects'));
      projectSnapshot.forEach((doc) => {
        projects.push({ name: doc.data().name, description: doc.data().description, id: doc.id });
      });
    } catch (error) {
      console.log(error);
    }
    return projects;
  }

  async createProjects(name: string, description: string) {
    await addDoc(collection(db, 'Users', this.uid, 'projects'), { name: name, description: description });
  }
  async deleteProjects(id: string) {
    await deleteDoc(doc(db, 'Users', this.uid, 'projects', id));
  }
}

let thisUser: User | null = null;

onAuthStateChanged(auth, (user) => {
  thisUser = new User(user);
});

export const getUser = () => {
  return thisUser;
};
