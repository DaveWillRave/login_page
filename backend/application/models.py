from bson.objectid import ObjectId
from application import db
from mongoengine import ObjectIdField

#  Sets up the models for the user database with username selected as the unique field for the user collection.
class User(db.Document):
    _id = ObjectIdField()
    username = db.StringField(unique=True)
    password = db.StringField()
