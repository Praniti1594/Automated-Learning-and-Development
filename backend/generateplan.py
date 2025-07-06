

import os
from flask import Flask, request, jsonify
import google.generativeai as genai
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Database Configuration
DATABASE_URI = 'mysql+pymysql://root:root@localhost/UpSkillVision'
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

# Google Generative AI Configuration
api_key = "" # Store API key in an environment variable
if not api_key:
    raise ValueError("Google API key not found. Set GOOGLE_API_KEY in your environment.")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Function to fetch course details from the database
def fetch_course_details(course_id):
    metadata = MetaData()
    metadata.reflect(bind=engine)  # Reflect all tables
    courses = metadata.tables.get("courses")

    if not courses:
        raise ValueError("Table 'courses' not found in the database.")

    query = courses.select().where(courses.c.course_id == course_id)
    result = session.execute(query).fetchone()
    
    if not result:
        raise ValueError(f"Course with ID {course_id} not found.")

    return {
        "course_name": result.course_name,
        "description": result.description
    }

# Function to generate modules using AI
def generate_modules(course_name, course_description, num_days):
    prompt = f"""
    You are a course planner. Given the course name "{course_name}" and description "{course_description}", 
    generate a detailed daily module plan for {num_days} days. Each day should have:
    1. A topic title.
    2. A brief description of what will be covered.
    3. Key learning objectives.
    4. Suggested resources (e.g., videos, articles, or exercises).

    Format the output as a JSON array, where each day is an object with the following keys:
    - "day": The day number (e.g., 1, 2, 3).
    - "topic": The topic title.
    - "description": A brief description of the topic.
    - "objectives": A list of key learning objectives.
    - "resources": A list of suggested resources.
    """

    response = model.generate_content(prompt)
    
    if response and hasattr(response, "text"):
        return response.text.strip()
    else:
        raise ValueError("Failed to generate module content.")

# Main function to generate course modules
def generate_course_modules(course_id, num_days=10):
    try:
        # Fetch course details
        course = fetch_course_details(course_id)
        course_name = course["course_name"]
        course_description = course["description"]

        # Generate modules using AI
        modules = generate_modules(course_name, course_description, num_days)
        return {
            "course_id": course_id,
            "course_name": course_name,
            "description": course_description,
            "num_days": num_days,
            "modules": modules
        }
    except Exception as e:
        return {"error": str(e)}

# Flask route to generate course modules
@app.route('/generate-modules', methods=['GET'])
def get_course_modules():
    # Get query parameters
    course_id = request.args.get('course_id', type=int)
    num_days = request.args.get('num_days', default=10, type=int)

    if not course_id:
        return jsonify({"error": "course_id is required"}), 400

    # Generate modules
    result = generate_course_modules(course_id, num_days)
    if "error" in result:
        return jsonify(result), 404

    return jsonify(result), 200


