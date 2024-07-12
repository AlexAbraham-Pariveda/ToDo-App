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
          project: doc.data().project,
          checklist: doc.data().checklist,
        });
      });
    } catch (error) {
      console.log(error);
    }
    return tasks;
  }
  async createTasks(
    name: string,
    description: string,
    date: string,
    status: string,
    project: string,
    checklist: object
  ) {
    await addDoc(collection(db, 'Users', this.uid, 'tasks'), {
      name: name,
      description: description,
      date: date,
      status: status,
      project: project,
      checklist: checklist,
    });
  }
  async editTasks(
    name: string,
    description: string,
    date: string,
    status: string,
    project: string,
    checklist: object,
    id: string
  ) {
    console.log(checklist);
    await updateDoc(doc(db, 'Users', this.uid, 'tasks', id), {
      name: name,
      description: description,
      date: date,
      status: status,
      project: project,
      checklist: checklist,
    });
  }

  async deleteTasks(id: string) {
    await deleteDoc(doc(db, 'Users', this.uid, 'tasks', id));
  }
}
