from bson.objectid import ObjectId
from application import db
from mongoengine import ObjectIdField


class User(db.Document):
    _id = ObjectIdField()
    username = db.StringField(unique=True)
    password = db.StringField()
