'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/projects.module.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIconButton from '@mui/icons-material/edit';
import DeleteIconButton from '@mui/icons-material/delete';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import AddIconButton from '@mui/icons-material/add';

const Task = ({ task, projects, handleEditTask, deleteTask, viewOnly }: any) => {
  const [isEditTasks, setIsEditTasks] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(dayjs());
  const [status, setStatus] = useState('');
  const [parentProject, setParentProject] = useState('');
  const [checklistData, setChecklistData] = useState(task.checklist || {});
  const [isAddChecklist, setIsAddChecklist] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [newChecklistItemName, setNewChecklistItemName] = useState('');
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);

  const statusItems = [
    { name: 'Not Started', color: 'red' },
    { name: 'In Progress', color: 'orange' },
    { name: 'Completed', color: 'green' },
  ];

  const openEdit = () => {
    setIsEditTasks(true);
  };

  const closeEdit = () => {
    setIsEditTasks(false);
  };

  const handleOnCheck = (isChecked: any, groupName: string, itemName: string) => {
    const checklistGroup: any = checklistData;
    if (checklistGroup.hasOwnProperty(groupName)) {
      if (checklistGroup[groupName].hasOwnProperty(itemName)) {
        checklistGroup[groupName][itemName] = isChecked;
        setChecklistData(checklistGroup);
      }
    }
  };
  const handleAddChecklist = () => {
    const checklistGroup: any = checklistData;
    checklistGroup[newChecklistName] = {};
    setChecklistData(checklistGroup);
  };

  const handleAddChecklistItem = (checklistName: string) => {
    const checklistGroup: any = checklistData;
    checklistGroup[checklistName] = { ...checklistGroup[checklistName], [newChecklistItemName]: false };
    setChecklistData(checklistGroup);
    setNewChecklistItemName('');
  };

  const handleDeleteCheck = (checklistName: string) => {
    const checklistGroup: any = checklistData;
    delete checklistGroup[checklistName];
    setChecklistData(checklistGroup);
  };

  const handleDeleteChecklistItem = (checklistName: string, itemName: string) => {
    const checklistGroup: any = checklistData;
    delete checklistGroup[checklistName][itemName];
    setChecklistData(checklistGroup);
  };

  return (
    <div className={styles.accordion}>
      <Accordion style={{ width: '80%' }} expanded={isTaskExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon onClick={() => setIsTaskExpanded(!isTaskExpanded)} />}
          id={task.name}
        >
          <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
            {!isEditTasks ? (
              <Typography>{task.name}</Typography>
            ) : (
              <TextField
                label="name"
                defaultValue={task.name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                variant="outlined"
                autoFocus
                required
              />
            )}
            {!isEditTasks ? (
              <Typography> {task.date} </Typography>
            ) : (
              <DatePicker
                label="Due Date"
                value={date || null}
                onChange={(e: any) => {
                  setDate(e);
                }}
              />
            )}
            {!isEditTasks ? (
              <Typography style={{ color: statusItems.filter((item) => item.name === task.status)[0].color }}>
                {task.status}
              </Typography>
            ) : (
              <Select
                label="Status"
                defaultValue={task.status}
                onChange={(e) => {
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
            )}

            {!viewOnly ? (
              <Box>
                <Button size="small" onClick={() => openEdit()}>
                  <EditIconButton />
                </Button>

                <Button size="small" onClick={(e) => deleteTask(e, task)}>
                  <DeleteIconButton />
                </Button>
              </Box>
            ) : null}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {!isEditTasks ? (
            <Typography>{task.description}</Typography>
          ) : (
            <>
              <TextField
                label="description"
                defaultValue={task.description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                autoFocus
                fullWidth
              />
            </>
          )}
          <br />
          <br />
          {!isEditTasks ? (
            <>
              <Typography>Project: {parentProject || task.project}</Typography>
            </>
          ) : (
            <>
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
            </>
          )}
          <br />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>Checklists</Typography>
            {isEditTasks ? (
              <IconButton>
                <AddIconButton onClick={() => setIsAddChecklist(true)} />
              </IconButton>
            ) : null}
          </Box>
          <br />

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

          {Object.keys(checklistData).length === 0 ? <Typography>No items</Typography> : null}

          {!isEditTasks
            ? Object.keys(checklistData).map((checklistName, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                      <Typography>{checklistName}</Typography>
                      <Box width="60%">
                        {Object.values(checklistData[checklistName]).length ? (
                          <LinearProgress
                            style={{ width: '80%', marginRight: '10px' }}
                            variant="determinate"
                            value={
                              (Object.values(checklistData[checklistName]).filter(Boolean).length /
                                Object.values(checklistData[checklistName]).length) *
                              100
                            }
                          />
                        ) : (
                          <br />
                        )}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {Object.keys(checklistData[checklistName]).map((itemName, idx) => (
                      <FormGroup key={idx}>
                        <FormControlLabel
                          control={<Checkbox checked={checklistData[checklistName][itemName]} />}
                          label={itemName}
                        />
                      </FormGroup>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))
            : Object.keys(checklistData).map((checklistName, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                      <Typography>{checklistName}</Typography>
                      <Box width="60%" display="flex" justifyContent="space-between" alignItems="center">
                        {Object.values(checklistData[checklistName]).length ? (
                          <LinearProgress
                            style={{ width: '80%', marginRight: '10px' }}
                            variant="determinate"
                            value={
                              (Object.values(checklistData[checklistName]).filter(Boolean).length /
                                Object.values(checklistData[checklistName]).length) *
                              100
                            }
                          />
                        ) : (
                          <br />
                        )}
                        <Button size="small" onClick={() => handleDeleteCheck(checklistName)}>
                          <DeleteIconButton />
                        </Button>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {Object.keys(checklistData[checklistName]).map((itemName, idx) => (
                      <>
                        <FormControlLabel
                          key={idx}
                          control={
                            <Checkbox
                              defaultChecked={checklistData[checklistName][itemName] || false}
                              onChange={(e) => handleOnCheck(e.target.checked, checklistName, itemName)}
                            />
                          }
                          label={itemName}
                        />
                        <Button size="small" onClick={() => handleDeleteChecklistItem(checklistName, itemName)}>
                          <DeleteIconButton />
                        </Button>

                        <br />
                      </>
                    ))}
                    <>
                      <br />
                      <TextField
                        label="Add Item"
                        value={newChecklistItemName}
                        onChange={(e) => setNewChecklistItemName(e.target.value)}
                        variant="outlined"
                      />{' '}
                      <br />
                      <Button onClick={() => closeEdit()}>Cancel</Button>
                      <Button
                        onClick={() => {
                          handleAddChecklistItem(checklistName);
                        }}
                      >
                        Add
                      </Button>
                    </>
                  </AccordionDetails>
                </Accordion>
              ))}
          <br />
          {!viewOnly ? (
            <>
              <Button
                onClick={() => {
                  closeEdit(), setIsTaskExpanded(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  closeEdit();
                  setIsTaskExpanded(false);
                  handleEditTask(task, name, description, date, status, parentProject, checklistData);
                }}
              >
                Save
              </Button>
            </>
          ) : null}
        </AccordionDetails>
      </Accordion>
      <br />
    </div>
  );
};

export default Task;
