from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
import os

# Import config based on environment
if os.environ.get('FLASK_ENV') == 'production':
    from config_production import Config
else:
    from config import Config

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # CORS configuration - allow all origins for development
    CORS(app, 
         origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    mail.init_app(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.todos import todos_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(todos_bp, url_prefix='/api/todos')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app
