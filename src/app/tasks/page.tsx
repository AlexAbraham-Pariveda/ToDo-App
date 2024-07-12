'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/projects.module.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import AddIconButton from '@mui/icons-material/add';
import { User, getUser } from '../services/utils';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Task from '../components/Tasks';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Tasks() {
  const auth = getAuth();
  const loggedUser = getUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isAddTasks, setIsAddTasks] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(dayjs());
  const [status, setStatus] = useState('');
  const [parentProject, setParentProject] = useState('');
  const [isAddChecklist, setIsAddChecklist] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [checklistData, setChecklistData] = useState({});

  const statusItems = [
    { name: 'Not Started', color: 'red' },
    { name: 'In Progress', color: 'yellow' },
    { name: 'Completed', color: 'green' },
  ];

  const addProject = () => {
    setIsAddTasks(!isAddTasks);
  };

  const resetFormValues = () => {
    setName('');
    setDescription('');
    setDate(dayjs());
    setStatus('');
    setParentProject('');
    setNewChecklistName('');
    setChecklistData({});
  };

  const createTask = () => {
    const fdate: any = date;
    const formattedDate = new Date(fdate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    console.log(parentProject);
    console.log(status);
    loggedUser?.createTasks(name, description, formattedDate, status || 'Not Started', parentProject, checklistData);
    resetFormValues();
    setIsAddTasks(false);
    fetchTasksData(loggedUser);
  };

  const handleEditTask = async (
    task: { name: any; description: any; date: any; status: any; project: string; id: any },
    name: any,
    description: any,
    date: any,
    status: any,
    parentProject: string,
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
      parentProject || task.project,
      checklist,
      task.id
    );

    fetchTasksData(loggedUser);
  };

  const deleteTask = (e: any, task: { id: string }) => {
    e.stopPropagation();
    handleDeleteTask(task);
  };

  const handleDeleteTask = async (task: { id: string }) => {
    loggedUser?.deleteTasks(task.id);
    fetchTasksData(loggedUser);
  };

  const handleAddChecklist = () => {
    const checklistGroup: any = checklistData;
    checklistGroup[newChecklistName] = {};
    setChecklistData(checklistGroup);
    setNewChecklistName('');
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
      const projectData = await user?.getProjects();
      setTasks(taskData || []);
      setProjects(projectData);
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
                    <DatePicker
                      label="Due Date"
                      value={date || null}
                      onChange={(e: any) => {
                        setDate(e);
                      }}
                    />
                    <Select
                      label="Status"
                      defaultValue={'Not Started'}
                      onChange={(e: any) => {
                        setStatus(e.target.value);
                      }}
                      variant="outlined"
                    >
                      {statusItems.map((stat: any) => (
                        <MenuItem key={stat.name} value={stat.name}>
                          {stat.name}
                        </MenuItem>
                      ))}
                    </Select>
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
                    <br />
                    <br />
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography>Parent Project: </Typography>
                      <Select
                        style={{ minWidth: '40%' }}
                        label="Project"
                        value={parentProject}
                        onChange={(e) => {
                          setParentProject(e.target.value);
                        }}
                        variant="outlined"
                      >
                        {projects?.map((item: any) => (
                          <MenuItem key={item.name} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <br /> <br />
                    <>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography>Checklists</Typography>
                        <IconButton>
                          <AddIconButton onClick={() => setIsAddChecklist(true)} />
                        </IconButton>
                      </Box>
                      {isAddChecklist ? (
                        <>
                          <Accordion expanded={isAddChecklist}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <TextField
                                label="Checklist Name"
                                value={newChecklistName}
                                onChange={(e) => {
                                  setNewChecklistName(e.target.value);
                                }}
                                variant="outlined"
                              />
                            </AccordionSummary>
                            <AccordionDetails>
                              <Button onClick={() => setIsAddChecklist(false)}>Cancel</Button>
                              <Button
                                onClick={() => {
                                  handleAddChecklist();
                                  setIsAddChecklist(false);
                                }}
                              >
                                Add
                              </Button>
                            </AccordionDetails>
                          </Accordion>
                        </>
                      ) : null}
                    </>
                    {Object.keys(checklistData).map((checklistName, index) => (
                      <Accordion key={index}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                            <Typography>{checklistName}</Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            Press <strong>Create Task</strong> before adding items
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </AccordionDetails>
                  <Box display="flex" justifyContent="space-between" alignItems="right">
                    <Button variant="outlined" onClick={() => setIsAddTasks(false)}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={() => createTask()}>
                      Create Task
                    </Button>
                  </Box>
                </Accordion>
              </div>
              <br />
            </>
          ) : null}
          {loadingTasks ? (
            <div className={styles.center}>
              <CircularProgress style={{ marginLeft: '50%' }} />
            </div>
          ) : tasks?.length > 0 ? (
            tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                projects={projects}
                handleEditTask={handleEditTask}
                deleteTask={deleteTask}
              />
            ))
          ) : !isAddTasks ? (
            <h1 style={{ textAlign: 'center' }}>No tasks found</h1>
          ) : null}
        </div>
      </LocalizationProvider>
    </>
  );
}
