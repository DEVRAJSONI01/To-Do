from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, Todo
from routes.auth import send_todo_notification_email

todos_bp = Blueprint('todos', __name__)

@todos_bp.route('/', methods=['GET'])
@jwt_required()
def get_todos():
    try:
        user_id = get_jwt_identity()
        todos = Todo.query.filter_by(user_id=user_id).order_by(Todo.created_at.desc()).all()
        
        return jsonify({
            'todos': [todo.to_dict() for todo in todos]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@todos_bp.route('/', methods=['POST'])
@jwt_required()
def create_todo():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        # Create new todo
        todo = Todo(
            title=data['title'],
            description=data.get('description', ''),
            user_id=user_id
        )
        
        db.session.add(todo)
        db.session.commit()
        
        # Get user info for email
        user = User.query.get(user_id)
        
        # Send email notification (run in background to avoid blocking)
        if user and user.email:
            try:
                send_todo_notification_email(user.email, user.name, todo.title)
            except Exception as email_error:
                print(f"Email sending failed: {email_error}")
                # Don't fail the todo creation if email fails
        
        return jsonify({
            'message': 'Todo created successfully',
            'todo': todo.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@todos_bp.route('/<int:todo_id>', methods=['PUT'])
@jwt_required()
def update_todo(todo_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Find todo
        todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
        
        if not todo:
            return jsonify({'error': 'Todo not found'}), 404
        
        # Update fields
        if 'title' in data:
            todo.title = data['title']
        if 'description' in data:
            todo.description = data['description']
        if 'completed' in data:
            todo.completed = data['completed']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Todo updated successfully',
            'todo': todo.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@todos_bp.route('/<int:todo_id>', methods=['DELETE'])
@jwt_required()
def delete_todo(todo_id):
    try:
        user_id = get_jwt_identity()
        
        # Find todo
        todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
        
        if not todo:
            return jsonify({'error': 'Todo not found'}), 404
        
        db.session.delete(todo)
        db.session.commit()
        
        return jsonify({'message': 'Todo deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@todos_bp.route('/<int:todo_id>', methods=['GET'])
@jwt_required()
def get_todo(todo_id):
    try:
        user_id = get_jwt_identity()
        
        # Find todo
        todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
        
        if not todo:
            return jsonify({'error': 'Todo not found'}), 404
        
        return jsonify({'todo': todo.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
