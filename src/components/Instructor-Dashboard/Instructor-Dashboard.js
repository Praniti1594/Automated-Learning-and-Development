import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Instructor-Dashboard.css'; 
import Logout from '../Logout/Logout';
import instructorImage from '../../images/anm10.jpg'; // Adjust the filename if needed

const InstructorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="instructor-dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="dashboard-title">Instructor Dashboard</h2>
      

        {/* Logout button on the right */}
        <div className="logout-button">
          <Logout />
        </div>
      </nav>

      <div className="content-wrapper">
        {/* Sidebar-style navigation (Left Side) */}
        <div className="sidebar">
          <button onClick={() => navigate('/hr-performance-dashboard', { state: { userType: 'instructor' } })}>
            User Performance
          </button>

          <button onClick={() => navigate('/course-list', { state: { userType: 'instructor' } })}>
            View Courses List
          </button>

          <Link to="/Courses" state={{ userType: "instructor" }}>
            <button>Create Course</button>
          </Link>

          <button onClick={() => navigate('/course-edit', { state: { userType: 'instructor' } })}>
            Edit Course
          </button>
        </div>

     

        {/* Image on the Right Side */}
        <div className="image-container3">
          <img src={instructorImage} alt="Instructor" className="instructor-image" />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;


// import React from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './Instructor-Dashboard.css'; 
// import Logout from '../Logout/Logout';

// const InstructorDashboard = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="dashboard-container1">
//       {/* Sidebar */}
//       <aside className="sidebar1">
//         <h2>Instructor Dashboard</h2>
//         <ul className="sidebar-menu">

//           <li onClick={() => navigate('/hr-performance-dashboard', { state: { userType: 'instructor' } })}>
//             User Performance
//           </li>

//           <li onClick={() => navigate('/course-list', { state: { userType: 'instructor' } })}>
//             View Courses List
//           </li>
          
//           <li>
//             <Link to="/Courses" state={{ userType: "instructor" }}>
//               Create Course
//             </Link>
//           </li>
          
//           <li onClick={() => navigate('/course-edit',{ state: { userType: 'instructor' } })}>
//             Edit Course
//           </li>
//         </ul>
//         <Logout />
//       </aside>

//       {/* Main Content */}
//       <div className="main-content1">
//         <header className="main-header1">
//           <h1>Welcome, Instructor!</h1>
//         </header>

//       </div>
//     </div>
//   );
// };

// export default InstructorDashboard;