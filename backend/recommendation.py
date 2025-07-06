import mysql.connector
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Database Connection
def get_db_connection():
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='root',
        database='UpskillVision'
    )
    return conn

# Fetch all courses
def fetch_all_courses(cursor):
    query = "SELECT course_id, course_name FROM courses"
    cursor.execute(query)
    return cursor.fetchall()

# Fetch user's enrolled courses
def get_enrolled_courses(cursor, user_id):
    query = """
    SELECT courses.course_id, courses.course_name 
    FROM user_courses 
    JOIN courses ON user_courses.course_id = courses.course_id 
    WHERE user_courses.user_id = %s AND user_courses.status = 'enrolled'
    """
    cursor.execute(query, (user_id,))
    return cursor.fetchall()

# Get course recommendations based on enrolled courses
def recommend_courses(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    enrolled_courses = get_enrolled_courses(cursor, user_id)
    all_courses = fetch_all_courses(cursor)

    if not enrolled_courses:
        return [], ["No enrolled courses found!"]

    enrolled_course_names = [course[1] for course in enrolled_courses]
    all_course_names = [course[1] for course in all_courses]

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(all_course_names)

    # Find similarity for each enrolled course and store the most similar ones
    similarity_scores = []
    for enrolled_course in enrolled_course_names:
        course_vector = vectorizer.transform([enrolled_course])
        cosine_similarities = cosine_similarity(course_vector, tfidf_matrix).flatten()
        similarity_scores.append(cosine_similarities)

    # Average similarity scores across all enrolled courses
    avg_similarity = sum(similarity_scores) / len(similarity_scores)
    
    # Get the top recommended courses (excluding enrolled ones)
    recommended_indices = avg_similarity.argsort()[-10:][::-1]
    recommended_courses = [all_courses[i][1] for i in recommended_indices if all_courses[i][1] not in enrolled_course_names]

    # Shuffle recommendations to provide a different order each time
    random.shuffle(recommended_courses)

    cursor.close()
    conn.close()

    return enrolled_course_names, recommended_courses[:6]