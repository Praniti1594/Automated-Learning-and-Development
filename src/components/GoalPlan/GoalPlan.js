import React, { useState } from "react";

const CreateGoal = ({ courseId }) => {
  const [goalDuration, setGoalDuration] = useState("");
  const [modules, setModules] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to fetch modules from Flask backend
  const fetchModules = async () => {
    if (!courseId) {
      setErrorMessage("Course ID is missing.");
      return;
    }
    if (!goalDuration || goalDuration <= 0) {
      setErrorMessage("Please enter a valid number of days.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/generate-modules?course_id=${courseId}&num_days=${goalDuration}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.modules) {
        setModules(JSON.parse(data.modules)); // Ensure parsing JSON output from AI
        setErrorMessage("");
      } else {
        setErrorMessage("No modules found for this course.");
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
      setErrorMessage("Failed to fetch study plan. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create Goal for Course {courseId || "Not Provided"}</h2>

      {/* Goal Duration Input */}
      <div>
        <label>Goal Duration (Days): </label>
        <input
          type="number"
          value={goalDuration}
          onChange={(e) => setGoalDuration(e.target.value)}
          placeholder="Enter number of days"
        />
      </div>

      {/* Button to Fetch Study Plan */}
      <button onClick={fetchModules}>Create Goal</button>

      {/* Error Message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Display Study Plan */}
      <h3>Study Plan</h3>
      <div>
        {modules.length > 0 ? (
          modules.map((module, index) => (
            <div key={index}>
              <h4>Day {module.day}</h4>
              <p><strong>{module.topic}</strong>: {module.description}</p>
            </div>
          ))
        ) : (
          <p>No plan generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default CreateGoal;
