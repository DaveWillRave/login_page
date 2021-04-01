from bson.objectid import ObjectId
from application import db
from mongoengine import ObjectIdField


class User(db.Document):
    """
    Sets up the models for the user database with username selected as the unique
     field for the user collection.
    """
    _id = ObjectIdField()
    username = db.StringField(unique=True)
    password = db.StringField()
