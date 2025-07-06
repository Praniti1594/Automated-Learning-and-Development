import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Participant-Dashboard.css'; // Separate CSS file for Participant Dashboard
import Logout from '../Logout/Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faChartBar,faArrowRight } from '@fortawesome/free-solid-svg-icons';
import amn7 from '../../images/amn7.png';


const ParticipantDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // State for dynamic user ID

  // Fetch userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(Number(storedUserId)); // Convert to number if needed
    } else {
      console.error('User ID not found in localStorage.');
    }
  }, []);

  return (
    <div className="dashboard-container1">
        <div className="navbar">
      <div className="navbar-buttons"> 
      <div onClick={() => navigate('/enrolled')}>
          <div class="nav-btn">Enrolled</div>
        </div>
        <div onClick={() => navigate('/unenrolled')}>
          <div class="nav-btn">Not Enrolled</div>
        </div>
        <div onClick={() => navigate('/completed')}>
          <div class="-btn">Completed</div>
        </div>
        <span className="navbar-title">Participant Dashboard</span>
        <div className="logout-btn1">
      <Logout />
    </div>
    </div>   
      </div>

      <div className="dashboard-content">


      <div className="widgets-container1">
     <div className="widget-box1" onClick={() => navigate('/user-course-list')}>
       <div className="widget-content1">
     
        <h4>
        Courses List
        
        <FontAwesomeIcon icon={faBookOpen} className="widget-icon" />
        </h4>
        <p>
        Master in-demand coding skills with our expert-led courses! From Python to AI, level up your tech game at your own pace.
        <br></br>
        <br></br>
        <b 
      style={{ 
        color: "#23262a", 
        cursor: "pointer", 
        display: "inline-flex", 
        alignItems: "center",
        gap: "5px",
        transition: "color 0.3s ease" 
      }}
      onMouseOver={(e) => (e.target.style.color = "#23262a")}
      onMouseOut={(e) => (e.target.style.color = "#23262a")}
    >
      Explore now <FontAwesomeIcon icon={faArrowRight} />
    </b>
        
        </p>
        
       </div>
     </div>
    
     <div className="widget-box1" onClick={() =>navigate(`/user-progress-page/${userId}`,{ state: { userType: 'participant' } })}>
       <div className="widget-content1">
   
       <h4>
        Progress-Overview
        <FontAwesomeIcon icon={faChartBar} className="widget-icon" />
        </h4>
        <p>
        Track your coding journey with real-time progress insights! Stay motivated as you conquer courses and achieve milestones
        </p>
       </div>
     </div>
   
   </div>

   
  {/* Image Section */}
  <div className="image-container1">
  <img src={amn7} alt="" />
  </div>
  </div>
      {/* Main Content */}
      <div className="main-content">
        
    
       
      </div>
    </div>
  );
};

export default ParticipantDashboard;