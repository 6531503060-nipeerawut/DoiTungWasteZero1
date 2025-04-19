import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedMessage = ({ message }) => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
            <h3>{message}</h3>
            <h3>Login Now</h3>
            <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
    );
};

export default UnauthorizedMessage;