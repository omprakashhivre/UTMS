import React, { useState } from 'react';

const handleLogin = async (credentials) => {
    try {
        setError('');
        console.log('Login API call:', credentials);
    } catch (error) {
        setError('Login failed');
    }
};

const handleRegister = async (userData) => {
    try {
        setError('');
        console.log('Register API call:', userData);
    } catch (error) {
        setError('Registration failed');
    }
};



module.exports = { handleLogin, handleRegister }