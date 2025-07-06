import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const userId = localStorage.getItem("user_id"); // Retrieve user_id from local storage

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!userId) return; // Ensure userId exists before making the request

            try {
                const response = await axios.get("http://127.0.0.1:5000/recommend", {
                    params: { user_id: userId },
                });

                setEnrolledCourses(response.data?.enrolled_courses || []);
                setRecommendedCourses(response.data?.recommended_courses || []);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [userId]);

    return (
        <div>
            <h2>Your Enrolled Courses:</h2>
            <ul>
                {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course, index) => <li key={index}>{course}</li>)
                ) : (
                    <li>No enrolled courses found.</li>
                )}
            </ul>

            <h2>Recommended Courses for You:</h2>
            <ul>
                {recommendedCourses.length > 0 ? (
                    recommendedCourses.map((course, index) => <li key={index}>{course}</li>)
                ) : (
                    <li>No recommendations available.</li>
                )}
            </ul>
        </div>
    );
};

export default Recommendations;
