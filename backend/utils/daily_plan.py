from datetime import datetime, timedelta
from models import Course, Module, Quiz

def generate_daily_plan(user_id, course_id, duration_days=None, start_date=None):
    # Fetch course details
    course = Course.query.get(course_id)
    if not course:
        return {"error": "Course not found"}

    # Fetch modules and quizzes
    modules = Module.query.filter_by(course_id=course_id).order_by(Module.order_no).all()
    quizzes = Quiz.query.join(Module).filter(Module.course_id == course_id).all()

    if not modules:
        return {"error": "No modules found for this course"}

    # Determine total days
    if duration_days:
        total_days = duration_days
    elif course.end_date:
        total_days = (course.end_date - course.start_date).days
    else:
        total_days = 30  # Default duration

    start_date = start_date or datetime.utcnow().date()
    daily_plan = {}

    total_modules = len(modules)
    module_index = 0

    # Evenly distribute modules across all days
    for day in range(1, total_days + 1):
        day_key = f"Day {day}"
        daily_plan[day_key] = {"modules": []}

        if module_index < total_modules:
            module = modules[module_index]
            tasks = module.learning_points.split(". ")

            # Split tasks into smaller chunks if more days than modules
            chunk_size = max(1, len(tasks) // (total_days // total_modules + 1))
            daily_plan[day_key]["modules"].append({
                "title": module.module_title,
                "tasks": tasks[:chunk_size]
            })

            # Remove assigned tasks to avoid repetition
            modules[module_index].learning_points = ". ".join(tasks[chunk_size:])

            # Move to the next module only if all its tasks are covered
            if not modules[module_index].learning_points:
                module_index += 1

    # Spaced quiz allocation
    quiz_index = 0
    total_quizzes = len(quizzes)
    quiz_days = sorted(list(daily_plan.keys()))  # Ensure quizzes are spaced out

    for i in range(0, len(quiz_days), max(1, total_days // total_quizzes)):  # Distribute quizzes evenly
        if quiz_index < total_quizzes:
            daily_plan[quiz_days[i]]["quiz"] = quizzes[quiz_index].quiz_title
            quiz_index += 1

    return daily_plan