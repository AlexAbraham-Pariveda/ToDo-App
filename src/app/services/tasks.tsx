import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase-service';

export class Tasks {
  uid: any;

  async getTasks() {
    const tasks: any = [];
    try {
      const taskSnapshot = await getDocs(collection(db, 'Users', this.uid, 'tasks'));
      taskSnapshot.forEach((doc) => {
        console.log(doc.data());
        tasks.push({
          name: doc.data().name,
          description: doc.data().description,
          id: doc.id,
          status: doc.data().status,
          date: doc.data().date,
          checklist: doc.data().checklist,
        });
      });
    } catch (error) {
      console.log(error);
    }
    return tasks;
  }
  async createTasks(name: string, description: string) {
    await addDoc(collection(db, 'Users', this.uid, 'tasks'), { name: name, description: description });
  }
  async editTasks(name: string, description: string, date: string, status: string, checklist: object, id: string) {
    console.log(checklist);
    await updateDoc(doc(db, 'Users', this.uid, 'tasks', id), {
      name: name,
      description: description,
      date: date,
      status: status,
      checklist: checklist,
    });
  }

  async deleteTasks(id: string) {
    await deleteDoc(doc(db, 'Users', this.uid, 'tasks', id));
  }
}
