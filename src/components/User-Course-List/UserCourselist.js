import React, { useState, useEffect } from 'react';
import './UserCourselist.css';
import axios from 'axios';

const UserCourselist = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // Fetch courses and sync with localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();

        // Sync localStorage with server data
        const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
        const syncedCourses = data.map((course) => {
          const storedCourse = storedCourses.find(
            (c) => c.courseId === course.course_id
          );
          if (storedCourse) {
            if (storedCourse.status === 'enroll') {
              course.enrolled = true;
            } else if (storedCourse.status === 'complete') {
              course.completed = true;
            }
          }
          return course;
        });

        // Update localStorage with the latest data from the server
        localStorage.setItem(
          'courses',
          JSON.stringify(
            syncedCourses
              .map((course) => ({
                courseId: course.course_id,
                status: course.completed
                  ? 'complete'
                  : course.enrolled
                  ? 'enroll'
                  : null,
              }))
              .filter((c) => c.status)
          )
        );

        setCourses(syncedCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Recommendation system using axios
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) return;

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/recommend`, {
          params: { user_id: storedUserId },
        });

        // response.data should contain recommended_courses (names) and enrolled_courses
        const recCourseNames = response.data?.recommended_courses;
        const enrolledCourseNames = response.data?.enrolled_courses || [];

        // Fetch full details of all courses
        const courseResponse = await axios.get(`http://127.0.0.1:5000/api/courses`);
        const allCourses = courseResponse.data;

        // Match course details by course name (filter out undefined)
        const recCourses = recCourseNames.map(courseName =>
          allCourses.find(course => course.course_name === courseName)
        ).filter((course) => course);

        setEnrolledCourses(enrolledCourseNames);
        setRecommendedCourses(recCourses);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleAction = async (endpoint, courseId) => {
    if (!userId) {
      setError('User ID not found. Please log in first.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, user_id: userId }),
      });

      if (!response.ok) {
        const message = await response.json();
        throw new Error(message.message || `${endpoint} failed`);
      }

      const updatedStatus =
        endpoint === 'enroll'
          ? 'enroll'
          : endpoint === 'complete'
          ? 'complete'
          : null;

      // Update courses state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.course_id === courseId
            ? {
                ...course,
                enrolled: endpoint === 'enroll',
                completed: endpoint === 'complete',
              }
            : course
        )
      );

      // Update recommended courses state
      setRecommendedCourses((prevRecommendedCourses) =>
        prevRecommendedCourses.map((course) =>
          course.course_id === courseId
            ? { ...course, enrolled: endpoint === 'enroll' }
            : course
        )
      );

      // Update localStorage with new status
      const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
      const existingIndex = storedCourses.findIndex((c) => c.courseId === courseId);

      if (updatedStatus) {
        if (existingIndex >= 0) {
          storedCourses[existingIndex].status = updatedStatus;
        } else {
          storedCourses.push({ courseId, status: updatedStatus });
        }
      } else if (existingIndex >= 0) {
        storedCourses.splice(existingIndex, 1);
      }

      localStorage.setItem('courses', JSON.stringify(storedCourses));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="course-list-container">
      {/* Recommended Courses Section */}
      <div>
        <h1 className="user-course-list-header">Recommended Courses for You:</h1>
        <div className="course-grid">
          {recommendedCourses.length > 0 ? (
            recommendedCourses.map((course) => (
              <div key={course.course_id} className="course-card">
                <h3>{course.course_name || 'Untitled Course'}</h3>
                <p>
                  <strong>Description:</strong>{' '}
                  {course.description || 'No description available.'}
                </p>
                <p>
                  <strong>Instructor:</strong>{' '}
                  {course.instructor_name || 'Unknown Instructor'}
                </p>
                <p>
                  <strong>Start Date:</strong>{' '}
                  {course.start_date
                    ? new Date(course.start_date).toLocaleDateString()
                    : 'TBD'}
                </p>
                <p>
                  <strong>End Date:</strong>{' '}
                  {course.end_date
                    ? new Date(course.end_date).toLocaleDateString()
                    : 'TBD'}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  {course.completed
                    ? 'Completed'
                    : course.enrolled
                    ? 'Enrolled'
                    : 'Not Enrolled'}
                </p>
                {course.enrolled ? (
                  <div>
                    <button
                      className="complete-button"
                      onClick={() => handleAction('complete', course.course_id)}
                    >
                      Mark as Completed
                    </button>
                    <button
                      className="unenroll-button"
                      onClick={() => handleAction('unenroll', course.course_id)}
                    >
                      Unenroll
                    </button>
                  </div>
                ) : (
                  <button
                    className="enroll-button"
                    onClick={() => handleAction('enroll', course.course_id)}
                  >
                    Enroll
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="course-card">
              <p>No recommendations available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Courses List Section */}
      <h1 className="user-course-list-header">Courses List</h1>
      <button
        className="user-course-list-back-button"
        onClick={handleBackButtonClick}
      >
        Back
      </button>
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.course_id} className="course-card">
            <h3>{course.course_name || 'Untitled Course'}</h3>
            <p>
              <strong>Description:</strong>{' '}
              {course.description || 'No description available.'}
            </p>
            <p>
              <strong>Instructor:</strong>{' '}
              {course.instructor_name || 'Unknown Instructor'}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {course.start_date
                ? new Date(course.start_date).toLocaleDateString()
                : 'TBD'}
            </p>
            <p>
              <strong>End Date:</strong>{' '}
              {course.end_date
                ? new Date(course.end_date).toLocaleDateString()
                : 'TBD'}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {course.completed
                ? 'Completed'
                : course.enrolled
                ? 'Enrolled'
                : 'Not Enrolled'}
            </p>
            {course.enrolled ? (
              <div>
                <button
                  className="complete-button"
                  onClick={() => handleAction('complete', course.course_id)}
                >
                  Mark as Completed
                </button>
                <button
                  className="unenroll-button"
                  onClick={() => handleAction('unenroll', course.course_id)}
                >
                  Unenroll
                </button>
              </div>
            ) : (
              <button
                className="enroll-button"
                onClick={() => handleAction('enroll', course.course_id)}
              >
                Enroll
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCourselist;
