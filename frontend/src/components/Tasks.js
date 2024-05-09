import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/esm/Spinner';
// import ValidateToken from './TokenValidate';
const API_BASEPATH = "http://localhost:8080/api/v1";

function TaskTable({_tasks}) {
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchTasks();
    }, [_tasks]);

    const fetchTasks = async () => {
        try {
            setLoad(true)
            const response = await axios.get(`${API_BASEPATH}/getalltasksforuser`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authKey")}`
                }
            });
            setTasks(response.data.user.Tasks);
            setLoad(false)
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoad(false)

        }
    };

    const openModelToUpdateTask = (index) => {
        setEditTask(tasks[index])
        console.log(tasks[index]);
        setShow(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditTask({ ...editTask, [name]: value })
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${API_BASEPATH}/updatetask/${editTask.id}`,editTask, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authKey")}`
                }
            });
            const newTask = response.data.task
            setTasks(tasks.map((t) => {
                if(t.id === editTask.id)
                    return newTask
                return t
                }));
            setShow(false)
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_BASEPATH}/deletetask/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authKey")}`
                }
            });
            setTasks(tasks.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h2>Task List</h2>


            {
                load ?
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    :
                    <>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Title</th>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Status</th>
                        <th style={tableHeaderStyle}>Priority</th>
                        <th style={tableHeaderStyle}>Due Date</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTasks.map((task, index) => (
                        <tr key={task.id}>
                            <td style={tableCellStyle}>{task.title}</td>
                            <td style={tableCellStyle}>{task.description}</td>
                            <td style={tableCellStyle}>{task.status}</td>
                            <td style={tableCellStyle}>{task.priority}</td>
                            <td style={tableCellStyle}>{new Date(task.duedate).toLocaleDateString()}</td>
                            <td style={tableCellStyle}>
                                <button onClick={() => openModelToUpdateTask(index)}>Edit</button>
                                <button onClick={() => handleDelete(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: '20px' }}>
                {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }, (_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)} style={paginationButtonStyle}>
                        {i + 1}
                    </button>
                ))}
            </div>
            </>
}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>                <div className='create-task'>
                    <form onSubmit={handleEdit}>
                        <div className='form-group'>
                            <label>Title:</label>
                            <input type='text' name='title' value={editTask.title} onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Description:</label>
                            <input type='text' name='description' value={editTask.description
                            } onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Status:</label>
                            <input type='text' name='status' value={editTask.status} onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Priority:</label>
                            <input type='text' name='priority' value={editTask.priority} onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Due Date:</label>
                            <input type='date' name='duedate' value={editTask.duedate} onChange={handleChange} required />
                        </div>
                        <button type='submit'>Create Task</button>
                    </form>
                </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
};

const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
};

const paginationButtonStyle = {
    backgroundColor: '#f4f4f4',
    border: '1px solid #ddd',
    padding: '8px 16px',
    marginRight: '5px',
    cursor: 'pointer',
};

export default TaskTable;
