import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

const API_BASEPATH = "http://localhost:8080/api/v1";

function UserTable({ _users }) {
    const [users, setusers] = useState([]);
    const [edituser, setEdituser] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchusers();
    }, [_users]);

    const fetchusers = async () => {
        try {
            setLoad(true)
            const response = await axios.get(`${API_BASEPATH}/getallusers`);
            setusers(response.data.users);
            setLoad(false)
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoad(false)

        }
    };

    const openModelToUpdateuser = (index) => {
        setEdituser(users[index])
        console.log(users[index]);
        setShow(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEdituser({ ...edituser, [name]: value })
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${API_BASEPATH}/updateuser/${edituser.id}`, edituser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authKey")}`
                }
            });
            const newuser = response.data.user
            setusers(users.map((t) => {
                if (t.id === edituser.id)
                    return newuser
                return t
            }));
            setShow(false)
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_BASEPATH}/deleteuser/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authKey")}`
                }
            });
            setusers(users.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const indexOfLastuser = currentPage * usersPerPage;
    const indexOfFirstuser = indexOfLastuser - usersPerPage;
    const currentusers = users.slice(indexOfFirstuser, indexOfLastuser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h2>User List</h2>
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
                                    <th style={tableHeaderStyle}>id</th>
                                    <th style={tableHeaderStyle}>username</th>
                                    <th style={tableHeaderStyle}>email</th>
                                    <th style={tableHeaderStyle}>password</th>
                                    <th style={tableHeaderStyle}>createdAt</th>
                                    <th style={tableHeaderStyle}>updatedAt</th>
                                    <th style={tableHeaderStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentusers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td style={tableCellStyle}>{user.id}</td>
                                        <td style={tableCellStyle}>{user.username}</td>
                                        <td style={tableCellStyle}>{user.email}</td>
                                        <td style={tableCellStyle} title={user.password}>{user.password.slice(0, 7) + '...'}</td>
                                        <td style={tableCellStyle}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td style={tableCellStyle}>{new Date(user.updatedAt).toLocaleDateString()}</td>
                                        <td style={tableCellStyle}>
                                            <button onClick={() => openModelToUpdateuser(index)}>Edit</button>
                                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '20px' }}>
                            {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
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
                <Modal.Body>                <div className='create-user'>
                    <form onSubmit={handleEdit}>
                        <div className='form-group'>
                            <label>username:</label>
                            <input type='text' name='username' value={edituser.username} onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>email:</label>
                            <input type='text' name='email' value={edituser.email
                            } onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>password:</label>
                            <input type='text' name='password' value={edituser.password} onChange={handleChange} required />
                        </div>
                        <button type='submit'>Update user</button>
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

export default UserTable;
