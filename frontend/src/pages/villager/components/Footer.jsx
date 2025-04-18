import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTrash, FaTachometerAlt, FaPlus } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-light py-3 d-flex justify-content-around border-top mt-auto">
            <Link to="/v/homevillager" className="text-dark text-decoration-none"><FaHome size={30} /></Link>
            <Link to="/v/wastedatavillager" className="text-dark text-decoration-none"><FaTrash size={30} /></Link>
            <Link to="/v/addingwastevillager" className="text-dark text-decoration-none"><FaPlus size={30} /></Link>
            <Link to="/v/dashboard" className="text-dark text-decoration-none"><FaTachometerAlt size={30} /></Link>
        </footer>
    );
}

export default Footer;