from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from google.oauth2 import id_token
from google.auth.transport import requests
from app import db, mail
from models import User
from flask_mail import Message
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'User already exists with this email'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            name=data['name']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/google', methods=['POST'])
def google_auth():
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        # Verify Google token
        try:
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), os.getenv('GOOGLE_CLIENT_ID')
            )
            
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return jsonify({'error': 'Invalid token issuer'}), 400
                
        except ValueError:
            return jsonify({'error': 'Invalid token'}), 400
        
        # Extract user info
        google_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', email)
        
        # Check if user exists
        user = User.query.filter_by(google_id=google_id).first()
        
        if not user:
            # Check if user exists with same email
            user = User.query.filter_by(email=email).first()
            if user:
                # Link Google account to existing user
                user.google_id = google_id
            else:
                # Create new user
                user = User(
                    email=email,
                    name=name,
                    google_id=google_id
                )
                db.session.add(user)
        
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Google authentication successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def send_todo_notification_email(user_email, user_name, todo_title):
    """Send email notification when a todo is created"""
    try:
        msg = Message(
            subject='New Todo Created',
            sender=os.getenv('MAIL_USERNAME'),
            recipients=[user_email]
        )
        
        msg.body = f"""
        Hi {user_name},

        You have successfully created a new todo:
        
        Title: {todo_title}
        
        Best regards,
        Todo App Team
        """
        
        msg.html = f"""
        <h2>Hi {user_name},</h2>
        <p>You have successfully created a new todo:</p>
        <h3>Title: {todo_title}</h3>
        <br>
        <p>Best regards,<br>Todo App Team</p>
        """
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
