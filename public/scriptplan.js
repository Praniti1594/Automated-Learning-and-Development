async function generatePlan() {
    const courseName = document.getElementById("courseName").value.trim();
    const goalDuration = document.getElementById("goalDuration").value;

    if (!courseName) {
        alert("Please enter a valid course name!");
        return;
    }
    if (!goalDuration || goalDuration <= 0) {
        alert("Please enter a valid number of days!");
        return;
    }

    const apiKey = "AIzaSyB1QiMcUVr8Yd2yy0M9bkAFwmfe9KXho9c"; // 🔥 Replace this with your actual Gemini API key
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Generate a structured study plan for a course on "${courseName}" to be completed in ${goalDuration} days.
        - Provide a day-wise breakdown of topics.
        - Format the response in raw JSON only, like:
        {
            "plan": [
                { "day": 1, "topic": "Introduction", "learning_points": "Basic concepts, prerequisites" },
                { "day": 2, "topic": "Core Topics", "learning_points": "Detailed breakdown of important concepts" }
            ]
        }`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("Raw API Response:", data);

        if (data && data.candidates) {
            let generatedText = data.candidates[0]?.content?.parts[0]?.text || "{}";

            // 🔥 Remove any non-JSON parts (like ```json ... ```)
            generatedText = generatedText.replace(/```json|```/g, "").trim();

            const studyPlan = JSON.parse(generatedText).plan;

            displayStudyPlan(studyPlan);
        } else {
            alert("Failed to generate study plan. Try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error generating study plan. Check console for details.");
    }
}

function displayStudyPlan(plan) {
    const studyPlanDiv = document.getElementById("studyPlan");
    studyPlanDiv.innerHTML = "<h2>Generated Study Plan</h2>";

    plan.forEach((entry) => {
        const dayDiv = document.createElement("div");
        dayDiv.innerHTML = `<h3>Day ${entry.day}</h3>
                            <p><strong>Topic:</strong> ${entry.topic}</p>
                            <p><strong>Key Points:</strong> ${entry.learning_points}</p>`;
        studyPlanDiv.appendChild(dayDiv);
    });
}
