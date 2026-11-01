import React from 'react'
import './NotFound.css'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>This page doesn't exist — maybe it got eaten.</p>
      <button onClick={() => navigate('/')}>Back to Menu</button>
    </div>
  );
};

export default NotFound;
