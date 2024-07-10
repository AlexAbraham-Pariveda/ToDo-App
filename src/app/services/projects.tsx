import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase-service';
import { Tasks } from './tasks';

export class Projects extends Tasks {
  uid: any;

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
  async editProjects(name: string, description: string, id: string) {
    await updateDoc(doc(db, 'Users', this.uid, 'projects', id), { name: name, description: description });
  }

  async deleteProjects(id: string) {
    await deleteDoc(doc(db, 'Users', this.uid, 'projects', id));
  }
}
