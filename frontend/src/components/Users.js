import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './userstable';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Navigation from './Nav';

// import { DataGrid } from '@mui/x-data-grid';
const API_BASEPATH = "http://localhost:8080/api/v1"

const UsersComponent = () => {
    const [users, setusers] = useState([]);
    const [user, setuser] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value } = e.target
        setuser({ ...user, [name]: value })
    }

    useEffect(() => {
        fetchusers();
    }, []);

    const fetchusers = async () => {
        try {
            const response = await axios.get(`${API_BASEPATH}/getallusersforuser`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authKey")}`
                }
            });
            if (response.data.status == true) {
                setusers(response.data.user.users);

            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCreateuser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${API_BASEPATH}/register`, user);
            setusers([...users, response.data.user]);
            setShow(false)
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };


    return (
        <div>


            <Navigation />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>                <div className='create-user'>
                    <form onSubmit={handleCreateuser}>
                        <div className='form-group'>
                            <label>username:</label>
                            <input type='text' name='username' value={user.username} onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>email:</label>
                            <input type='text' name='email' value={user.email
                            } onChange={handleChange} required />
                        </div>
                        <div className='form-group'>
                            <label>password:</label>
                            <input type='text' name='password' value={user.password} onChange={handleChange} required />
                        </div>
                        <button type='submit'>Create user</button>
                    </form>
                </div>
                </Modal.Body>
            </Modal>

            <main>

            </main>

            <footer style={{ marginTop: "30px", width: "100%" }}>

                <UserTable _users={users} />
            </footer>
            <Button style={{ width: "max-content", position: "absolute", bottom: "50px", right: "50px" }} onClick={() => setShow(true)}>Create User</Button>
        </div>
    );
};

export default UsersComponent;
