import { initializeApp } from "firebase/app";

const firebaseConfig = { //TODO: make these into env variables
  apiKey: "AIzaSyC8oSQ0mZBmBWwXa12w9YC9pImMIhvC7j8",
  authDomain: "todo-958a7.firebaseapp.com",
  projectId: "todo-958a7",
  storageBucket: "todo-958a7.appspot.com",
  messagingSenderId: "468366453017",
  appId: "1:468366453017:web:c1ca75a6cbf4d8b1373d88"
  };

export const firebaseService = initializeApp(firebaseConfig)

