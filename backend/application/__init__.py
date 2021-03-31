from flask import Flask
from flask_bcrypt import Bcrypt
from config import Config
from flask_mongoengine import MongoEngine
from flask_restplus import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Rest plus application is declared
api = Api()
# Flask application is declared
app = Flask(__name__)
# Instance of bcrypt is declare for the encryption type.
bcrypt = Bcrypt(app)
# Config file is passed into the application
app.config.from_object(Config)
CORS(app)
# Instance of JWT is declared for the token.
jwt = JWTManager(app)
# Instance of db is declared for the mongo database.
db = MongoEngine(app)
# Iniializes the api
api.init_app(app)

from application import routes

