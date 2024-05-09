import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskTable from './Tasks';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Navigation from './Nav';

// import { DataGrid } from '@mui/x-data-grid';
const API_BASEPATH = "http://localhost:8080/api/v1"

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({
        title: "",
        description: "",
        priority: "",
        status: "",
        duedate: ""
    });

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value } = e.target
        setTask({ ...task, [name]: value })
    }


    const handleCreateTask = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${API_BASEPATH}/createtask`, task, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authKey")}`
                }
            });
            setTasks([...tasks, response.data.task]);
            setShow(false)
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div>

        <Navigation/>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>                <div className='create-task'>
                    <form onSubmit={handleCreateTask}>
                        <div className='form-group'>
                            <label>Title:</label>
                            <input type='text' name='title' value={task.title} onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Description:</label>
                            <input type='text' name='description' value={task.description
                            } onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Status:</label>
                            <input type='text' name='status' value={task.status} onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Priority:</label>
                            <input type='text' name='priority' value={task.priority} onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Due Date:</label>
                            <input type='date' name='duedate' value={task.duedate} onChange={handleChange} required />
                        </div>
                        <button type='submit'>Create Task</button>
                    </form>
                </div>
                </Modal.Body>
            </Modal>

            <main>

            </main>

            <footer style={{ marginTop: "30px", width: "100%" }}>
                <TaskTable _tasks={tasks}/>
            </footer>
            <Button style={{ width: "max-content", position: "absolute", bottom: "50px", right: "50px" }} onClick={() => setShow(true)}>Create Task</Button>
        </div>
    );
};

export default Home;
