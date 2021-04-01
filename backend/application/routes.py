from flask import jsonify
from application.models import User
from application import app, api, bcrypt
from flask_restplus import Resource
from flask_jwt_extended import jwt_required, create_access_token
from flask_jwt_extended import get_jwt_identity
import jwt

import uuid

""" 
 The routes implement in the classes by making them
 inheret the restplus api and make use of the models specified in
 models.py. 
 """

@api.route("/api", "/api/")
class UserAll(Resource):

    def get(self):
        """
        Gets all users in the database
        and returns a json.
        """
        return jsonify(User.objects.all())

    def post(self):

        """
        Try to post the user to the database
        otherwise return a negative response
        """
        try:
            """
            Takes in a payload, encrypts the password using 
            the bycrypt library and saves it to the database
            """
            userdata = api.payload
            password = bcrypt.generate_password_hash(userdata["password"])
            User(password=password, username=userdata["username"]).save()
            return jsonify({'response': 'The post has worked successfully'})

        except Exception as e:
            return jsonify({'response': 'The post request has encountered an error'})


@api.route("/api/<user_name>")
class UserId(Resource):
    def post(self, user_name):
        """
        passes and instance of the
        class UserID to post and username as a parameter
        """
        try:
            if User.objects(username=user_name):
                """ 
                This loop should return a true or false based on 
                the payload credentials. 
                """
                data = api.payload
                """ Checks the password hash against the hash stored in the database. """
                if bcrypt.check_password_hash(User.objects(username=user_name)[0].password, data['password']):
                    """If hashes match creates a token and return true to the frontend"""
                    token = create_access_token(identity=user_name)
                    print(token)
                    return jsonify({'response': 'Successful login!', 'login': True, 'token': token})
                else:
                    """Return login false if the hashes do not match."""
                    return jsonify({'response': 'Failed login!', 'login': False})
            else:
                return jsonify({'response': 'Invalid user!', 'login': False})
        except:
            return jsonify({'response': 'An error has occurred', 'login': False})

    def get(self, user_name):
        """Get user by their username"""
        return jsonify(User.objects.get(username=user_name))

# Sets the route to verify the token stored on the frontend and return true.
@app.route('/auth', methods=['GET'])
@jwt_required()
def dashboard():
    return jsonify({'response': 'User authenticated', 'token': True}), 200
