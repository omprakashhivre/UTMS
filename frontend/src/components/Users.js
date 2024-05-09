import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './userstable';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Navigation from './Nav';
import { useNavigate } from 'react-router-dom';
// import { DataGrid } from '@mui/x-data-grid';
const API_BASEPATH = "https://utms.onrender.com/api/v1"

const UsersComponent = () => {
    const navigate = useNavigate()
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
        if (!localStorage.getItem("authKey")) navigate("/")

    }, []);


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
