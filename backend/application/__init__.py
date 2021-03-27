from flask import Flask
from flask_bcrypt import Bcrypt
from config import Config
from flask_mongoengine import MongoEngine
from flask_restplus import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager

api = Api()
app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config.from_object(Config)
CORS(app)
jwt = JWTManager(app)
db = MongoEngine(app)
api.init_app(app)

from application import routes

