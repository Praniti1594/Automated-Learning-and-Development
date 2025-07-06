import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApproveUsers.css';
import { useNavigate } from 'react-router-dom';

const ApproveUsers = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/users/pending');
        setPendingUsers(response.data.pending_users || []);
      } catch (err) {
        console.error('Error fetching pending users:', err);
        setError('Failed to fetch pending users.');
      }
    };
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/users/approve/${userId}`);
      alert('User approved successfully');
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user.');
    }
  };

  return (
    <div className="approve-users-container">
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
      <h2 className='heading'>Users Awaiting Approval</h2>
      {error && <div className="error-message">{error}</div>}
      {pendingUsers.length === 0 ? (
        <p className="no-users">No users awaiting approval.</p>
      ) : (
        <div className="user-card-container">
          {pendingUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3>{user.first_name} {user.last_name}</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <span className="role-badge">{user.role_name || "N/A"}</span>
              </div>
              <button className="approve-button" onClick={() => handleApprove(user.id)}>✅ Approve</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveUsers;
