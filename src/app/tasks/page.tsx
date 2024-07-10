'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/projects.module.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import AddIconButton from '@mui/icons-material/add';
import { User, getUser } from '../services/utils';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Task from '../components/Tasks';

export default function Tasks() {
  const auth = getAuth();
  const loggedUser = getUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isAddTasks, setIsAddTasks] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const addProject = () => {
    setIsAddTasks(!isAddTasks);
  };

  const createTask = () => {
    loggedUser?.createTasks(name, description);
    setIsAddTasks(false);
    fetchTasksData(loggedUser);
  };

  const handleEditTask = async (
    task: { name: any; description: any; date: any; status: any; id: any },
    name: any,
    description: any,
    date: any,
    status: any,
    checklist: any
  ) => {
    const formattedDate = new Date(date || task.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    loggedUser?.editTasks(
      name || task.name,
      description || task.description,
      formattedDate,
      status || task.status,
      checklist,
      task.id
    );

    fetchTasksData(loggedUser);
  };

  const deleteTask = (e: any, task: { id: string }) => {
    e.stopPropagation();
    //   handleDeleteTask(task);
  };

  const handleDeleteTask = async (task: { id: string }) => {
    loggedUser?.deleteTasks(task.id);
    fetchTasksData(loggedUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setLoadingTasks(true);
        fetchTasksData(currentUser);
      } else {
        setTasks([]);
        setLoadingTasks(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTasksData = async (currentUser: User | User | null) => {
    try {
      const user = new User(currentUser);
      const taskData = await user?.getTasks();
      setTasks(taskData || []);
    } catch (error) {
      console.log('error');
    } finally {
      setLoadingTasks(false);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Navbar isBackButton />
        <div>
          <div className={styles.center}>
            <h1>Your Tasks</h1>
            <IconButton>
              <AddIconButton onClick={() => addProject()} />
            </IconButton>
          </div>
          {isAddTasks ? (
            <>
              <div className={styles.accordion}>
                <Accordion style={{ width: '80%' }} expanded>
                  <AccordionSummary>
                    <TextField
                      label="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      label="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </AccordionDetails>
                  <Button variant="contained" style={{ float: 'right' }} onClick={() => createTask()}>
                    Create Task
                  </Button>
                </Accordion>
              </div>
              <br />
            </>
          ) : null}
          {loadingTasks ? (
            <div className={styles.center}>
              <CircularProgress />
            </div>
          ) : tasks?.length > 0 ? (
            tasks.map((task) => (
              <Task key={task.id} task={task} handleEditTask={handleEditTask} deleteTask={deleteTask} />
            ))
          ) : (
            <h1>No tasks found</h1>
          )}
        </div>
      </LocalizationProvider>
    </>
  );
}
