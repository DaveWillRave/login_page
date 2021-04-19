import unittest
import json
# This will allow the user to mock an object during a test, and object is restored after the test is run.
from datetime import timedelta

from mongoengine import *
from application import routes, app, api, bcrypt, models
from application.models import User
from flask_jwt_extended import decode_token, create_access_token

from unittest.mock import Mock
from unittest.mock import patch
from flask import jsonify, make_response
import requests

class TestHash(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """
         setup class to disconnect any current connections, connect to the mock database url,
          and save a temporary user to the database for testing hashing function and the post function (for frontend login)
        """
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')
        user_1 = {'_id': '6062dabdbbb2c3f109a049e9', 'username': 'James', 'password': '123'}
        User(username=user_1['username'], _id=user_1['_id'], password=user_1['password']).save()

        print("setupClass")

    @classmethod
    def tearDownClass(cls):
        disconnect()
        print("teardownClass")

    def test_hashing(self):
        with app.test_client() as client:
            """
            Send data as POST form to endpoint and testing the the hashing in the post request.
            """
            unhashed_password = "123"
            user_2 = {'username': 'John', 'password': unhashed_password}
            good_result = client.post(
                '/api',
                data=user_2
            )
            hashed_password = good_result.json['hashed_password']

            self.assertRaises(TypeError, StringField, 123)
            self.assertEqual(200, good_result.status_code)
            self.assertNotEqual(unhashed_password, hashed_password)
            self.assertTrue(bcrypt.check_password_hash(hashed_password, unhashed_password))

