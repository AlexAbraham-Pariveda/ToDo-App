'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/projects.module.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { db, firebaseService } from '../services/firebase-service';
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import AddIconButton from '@mui/icons-material/add';
import EditIconButton from '@mui/icons-material/edit';
import DeleteIconButton from '@mui/icons-material/delete';
import { useRouter } from 'next/navigation';
import { User, getUser } from '../services/utils';

export default function Projects() {
  const auth = getAuth(firebaseService);
  const loggedUser = getUser();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isAddProject, setIsAddProject] = useState(false);
  const [isEditProject, setIsEditProject] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const addProject = () => {
    setIsAddProject(!isAddProject);
  };
  const toggleEdit = (project: any) => {
    setIsEditProject(true);
  };

  const createProject = () => {
    loggedUser?.createProjects(name, description);
    setIsAddProject(false);
    fetchProjectsData(loggedUser);
  };

  const handleEditProject = async (project: any) => {
    loggedUser?.editProjects(name || project.name, description || project.description, project.id);
    setIsEditProject(false);
    fetchProjectsData(loggedUser);
  };

  const deleteProject = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, project: any) => {
    e.stopPropagation();
    handleDeleteProject(project);
  };

  const handleDeleteProject = async (project: any) => {
    loggedUser?.deleteProjects(project.id);
    fetchProjectsData(loggedUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setLoadingProjects(true);
        fetchProjectsData(currentUser);
      } else {
        setProjects([]);
        setLoadingProjects(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProjectsData = async (currentUser: any) => {
    try {
      const user = new User(currentUser);
      const projectData = await user?.getProjects();
      setProjects(projectData || []);
    } catch (error) {
      console.log('error');
    } finally {
      setLoadingProjects(false);
    }
  };

  return (
    <>
      <Navbar isBackButton />
      <div>
        <div className={styles.center}>
          <h1>Your Projects</h1>

          <IconButton>
            <AddIconButton onClick={() => addProject()} />
          </IconButton>
        </div>
        {isAddProject ? (
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
                <Button variant="contained" style={{ float: 'right' }} onClick={() => createProject()}>
                  Create Project
                </Button>
              </Accordion>
            </div>
            <br />
          </>
        ) : null}
        {loadingProjects ? (
          <div className={styles.center}>
            <CircularProgress />
          </div>
        ) : projects?.length > 0 ? (
          projects.map((project: any) => (
            <div key={project.name} className={styles.accordion}>
              <Accordion style={{ width: '80%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} id={project.name}>
                  <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                    {!isEditProject ? (
                      <Typography>{project.name}</Typography>
                    ) : (
                      <TextField
                        label="name"
                        defaultValue={project.name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        autoFocus
                      />
                    )}
                    <Box>
                      <Button size="small" onClick={() => toggleEdit(project)}>
                        <EditIconButton />
                      </Button>

                      <Button size="small" onClick={(e) => deleteProject(e, project)}>
                        <DeleteIconButton />
                      </Button>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {!isEditProject ? (
                    <Typography>{project.description}</Typography>
                  ) : (
                    <>
                      <TextField
                        label="description"
                        defaultValue={project.description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        autoFocus
                        fullWidth
                      />
                      <Button
                        onClick={() => {
                          setIsEditProject(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => handleEditProject(project)}>Save</Button>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
              <br />
            </div>
          ))
        ) : (
          <h1>no projects found</h1>
        )}
      </div>
    </>
  );
}
