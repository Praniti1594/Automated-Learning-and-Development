from flask import Flask, render_template, request, jsonify
from models import db
from routes import main_blueprint
from flask_cors import CORS
from datetime import timedelta
from flask_session import Session
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from recommendation import recommend_courses  # Import the recommendation logic

# Initialize the Flask app
app = Flask(__name__, template_folder='templates')
CORS(app, supports_credentials=True)

# Configuration settings
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:nnps#1594@localhost:3306/UpskillVision'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'ABCDEF'
app.config['SESSION_TYPE'] = 'filesystem'  # Change this to a valid type
app.config['SESSION_PERMANENT'] = True    # Optional: Sessions expire on browser close
app.config['SESSION_FILE_DIR'] = './flask_session/'  # Directory for session files if using filesystem
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)  # Sessions last for 1 day
Session(app)

# Initialize SQLAlchemy with the app
db.init_app(app)

# Initialize Flask-Migrate for database migrations
migrate = Migrate(app, db)

# Register the blueprint for routes
app.register_blueprint(main_blueprint)

# Route for recommendations
@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({"error": "Please provide a valid user_id"}), 400

    enrolled_courses, recommendations = recommend_courses(user_id)

    return jsonify({
        "enrolled_courses": enrolled_courses,
        "recommended_courses": recommendations
    })

# Main Route
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)