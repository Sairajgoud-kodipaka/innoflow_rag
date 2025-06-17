from django.utils import timezone
from .models import UserProfile # Assuming UserProfile is the correct model for activity logging

def log_activity(user, activity_type, message):
    """
    Logs a user's activity.
    You might want to expand this to a proper ActivityLog model later.
    """
    try:
        # For now, we'll just print to the console. 
        # In a real application, you would save this to a database.
        print(f"[{timezone.now()}] User {user.username} (ID: {user.id}) - Type: {activity_type}, Message: {message}")
        # Example of saving to a model (uncomment and implement if you have an ActivityLog model):
        # ActivityLog.objects.create(
        #     user=user,
        #     activity_type=activity_type,
        #     message=message
        # )
    except Exception as e:
        print(f"Error logging activity for user {user}: {e}") 