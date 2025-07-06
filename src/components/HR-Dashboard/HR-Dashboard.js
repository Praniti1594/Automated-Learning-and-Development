
import { useNavigate, Link } from 'react-router-dom';

import './HR-Dashboard.css';
import Logout from '../Logout/Logout';

const HRdashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <div className="navbar">
      <div className="navbar-buttons"> 
      <div onClick={() => navigate('/approve-users')}>
          <div class="approve-users-btn">Approve Users</div>
        </div>
        <div onClick={() => navigate('/hr-leaderboard-page', { state: { userType: 'hr' } })}>
          <div class="leaderboard-btn">Leaderboard</div>
        </div>
        <div onClick={() => navigate('/hr-course-review', { state: { userType: 'hr' } })}>
          <div class="course-review-btn">Course Review</div>
        </div>
        <span className="navbar-title">HR Dashboard</span>
        <div className="logout-btn1">
      <Logout />
    </div>
    </div>   
      </div>

      {/* Widgets */}
      <div className="widgets-container">
     
        {/* <div className="widget-box" onClick={() => navigate('/user-role-management', { state: { userType: 'hr' } })}>
          <div className="widget-content">User Role Management</div>
        </div> */}
        <div className="widget-box" onClick={() => navigate('/course-list', { state: { userType: 'hr' } })}>
          <div className="widget-content">View Courses List</div>
        </div>
        <div className="widget-box">
          <div className="widget-content">
            <Link to="/Courses" state={{ userType: "hr" }}>Create Course</Link>
          </div>
        </div>
        <div className="widget-box" onClick={() => navigate('/course-edit', { state: { userType: 'hr' } })}>
          <div className="widget-content">Edit Course</div>
        </div>
        {/* <div className="widget-box" onClick={() => navigate('/department-management-page', { state: { userType: 'hr' } })}>
          <div className="widget-content">Manage Department</div>
        </div> */}
        <div className="widget-box" onClick={() => navigate('/hr-performance-dashboard', { state: { userType: 'hr' } })}>
          <div className="widget-content">User Performance</div>
        </div>
        <div className="widget-box" onClick={() => navigate('/hr-filter-performance', { state: { userType: 'hr' } })}>
          <div className="widget-content">Filter Performance</div>
        </div>
       
        <div className="widget-box" onClick={() => navigate('/hr-participant-pie-chart', { state: { userType: 'hr' } })}>
          <div className="widget-content">Active vs Completed Courses</div>
        </div>
      
      </div>
    </div>
  );
};

export default HRdashboard;

// import { useNavigate, Link } from 'react-router-dom';

// import './HR-Dashboard.css';
// import Logout from '../Logout/Logout';

// const HRdashboard = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="dashboard-container">
//       {/* Navbar */}
//       <div className="navbar">
//       <span className="navbar-title">HR   Dashboard</span>
//         <Logout />
//       </div>
//       <div className="widgets-container">
//       <div className="widget-box" onClick={() => navigate('/approve-users', { state: { userType: 'hr' } })}>
//   <div className="widget-content">Approve Users</div>


//   </div>
//   <div className="widget-box" onClick={() => navigate('/user-role-management', { state: { userType: 'hr' } })}>
//     <div className="widget-content">User Role Management</div>
//   </div>
//   <div className="widget-box" onClick={() => navigate('/course-list', { state: { userType: 'hr' } })}>
//     <div className="widget-content">View Courses List</div>
//   </div>
//   <div className="widget-box">
//     <div className="widget-content">
//       <Link to="/Courses" state={{ userType: "hr" }}>Create Course</Link>
//     </div>
//   </div>
//   <div className="widget-box" onClick={() => navigate('/course-edit', { state: { userType: 'hr' } })}>
//     <div className="widget-content">Edit Course</div>
//   </div>
//   <div className="widget-box" onClick={() => navigate('/department-management-page', { state: { userType: 'hr' } })}>
//     <div className="widget-content">Manage Department</div>
//   </div>
//   <div className="widget-box" onClick={() => navigate('/hr-performance-dashboard', { state: { userType: 'hr' } })}>
//     <div className="widget-content">User Performance</div>
//   </div>
//   <div className="widget-box" onClick={() => navigate('/hr-filter-performance', { state: { userType: 'hr' } })}>
//     <div className="widget-content">Filter Performance</div>
//   </div>
//   <div className="widget-box" onClick={() => navigate('/hr-leaderboard-page', { state: { userType: 'hr' } })}>
//     <div className="widget-content">Leaderboard</div>
//   </div>
//   <div className="widget-box" onClick={() => navigate('/hr-participant-pie-chart', { state: { userType: 'hr' } })}>
//     <div className="widget-content">Active vs Completed Courses</div>
//   </div>
//   <div className="widget-box" onClick={() => navigate('/hr-course-review', { state: { userType: 'hr' } })}>
//     <div className="widget-content">Course Review</div>
//   </div>
// </div>



      
//     </div>
//   );
// };

// export default HRdashboard;
