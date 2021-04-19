import unittest
import json
# This will allow the user to mock an object during a test, and object is restored after the test is run.
import flask_jwt_extended
from mongoengine import *
from application import routes, app, api, bcrypt, models
from application.models import User
from flask_jwt_extended import decode_token

from unittest.mock import Mock
from unittest.mock import patch
from flask import jsonify, make_response
import requests


# class Person(Document):
#     name = StringField()

class ApiResponseMock(object):
    """
    An object to define a standard API Response.
    """
    def __init__(self, status_code, response):
        self.status_code = status_code
        self.response = response
        self.text = str(json.dumps(response))


class TestRoutes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
         setup class to disconnect any current connections, connect to the mock database url,
          and save a temporary user to the database for testing get functions and the post function (for frontend login)
        """
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')
        user_1 = {'_id': '6062dabdbbb2c3f109a049e9', 'username': 'James', 'password': '123'}
        user_2 = {'_id': '605e4c879cd28ab1cca591b8', 'username': 'Bob', 'password': 'cba'}
        # pass = abc
        login_user = {'_id': '605f583d605104259229a39c',
                      'password': '$2b$12$NQMhiNagI637rUuwJ2RCCeXik0eVeErtQ6npGYUg7/O3NFeq4EUkO', 'username': 'Joe'}

        User(username=user_1['username'], _id=user_1['_id'], password=user_1['password']).save()
        User(username=user_2['username'], _id=user_2['_id'], password=user_2['password']).save()
        User(username=login_user['username'], _id=login_user['_id'], password=login_user['password']).save()
        print("setupClass")

    @classmethod
    def tearDownClass(cls):
        disconnect()
        print("teardownClass")

    def test_userGet(self):
        with app.app_context():
            """ 
            Getting the mock data of the by passing the username as a parameter to the get.
            """
            valid_code = routes.UserId().get("James")
            # This form is preferred over getting key value pairs from dict because it makes ID fetching easier.
            valid_user = User.objects().first()
            self.assertEqual(200, valid_code.status_code)
            self.assertEqual(models.ObjectId("6062dabdbbb2c3f109a049e9"), valid_user._id)
            self.assertEqual("James", valid_user.username)
            self.assertEqual("123", valid_user.password)
            """
            Retrieving status code and user data
            """

            invalid_code1 = routes.UserId().get("Sam")
            print(f"GetOne - Expecting error message, getting: '{invalid_code1.json['error']}'")
            self.assertEqual(400, invalid_code1.status_code)
            """
            Testing for a user which does not exist
            """
            invalid_code2 = routes.UserId().get("jAmEs")
            print(f"GetOne - Expecting error message, getting: '{invalid_code2.json['error']}'")
            self.assertEqual(400, invalid_code2.status_code)
            """
            Testing if existing username is case sensitive (true by default)
            """

    def test_usersGet(self):
        with app.app_context():
            """
            Getting all of the mock data and checks for first entry in the tuple
            """
            namelist = []
            get_users = routes.UserAll()
            code = get_users.get().status_code
            userlist = get_users.get().json
            for user in userlist:
                name = user["username"]
                namelist.append(name)
            print(userlist)

            print(f"GetAll - Expecting status code 200, getting: {code}")
            self.assertEqual(200, code)
            self.assertEqual(3, len(userlist))

    def test_post(self):
        with app.test_client() as client:
            """
            Send data as POST form to endpoint
            """
            user_2 = {'username': 'John', 'password': 'qwe123'}
            goodresult = client.post(
                '/api',
                data=user_2
            )
            self.assertEqual(200, goodresult.status_code)

    def test_postlogin(self):
        with app.test_client() as client:
            """
            Testing Login function by sending username in url and password as payload.
            """
            valid_name = "Joe"
            valid_login = {'password': 'abc'}
            valid_result = client.post(
                f'/api/{valid_name}',
                data=json.dumps(valid_login),
                content_type='application/json'
            )

            self.assertEqual(200, valid_result.status_code)
            """
            Sending valid details to login function and expecting positive response
            """

            invalid_name = "Joey"
            valid_login = {'password': 'abc'}
            invalid_result1 = client.post(
                f'/api/{invalid_name}',
                data=json.dumps(valid_login),
                content_type = 'application/json'
            )

            self.assertEqual(401, invalid_result1.status_code)
            """
            Sending invalid user to login function and expecting negative response
            """

            valid_name = "Joe"
            invalid_login = {'password': '541'}
            invalid_result2 = client.post(
                f'/api/{valid_name}',
                data=json.dumps(invalid_login),
                content_type='application/json'
            )
            """
            Sending invalid password to login function and expecting negative response
            """
            self.assertEqual(401, invalid_result2.status_code)

    def test_token(self):
        with app.test_client() as client:
            """ 
            Testing token validity by passing in existing user, and attempting to fetch generated token.
            Then checks what user the token is attached to against the user that was sent.
            """
            valid_name = "Joe"
            valid_login = {'password': 'abc'}
            valid_result = client.post(
                f'/api/{valid_name}',
                data=json.dumps(valid_login),
                content_type='application/json'
            )
            x = flask_jwt_extended.create_access_token(identity='bob', fresh=False, expires_delta=None)
            print(x)
            name_attachedto_token = valid_result.json["token"]
            self.assertEqual( 'Joe', decode_token(name_attachedto_token)['sub'],)
