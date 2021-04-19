from flask import jsonify, make_response, Response, request, Flask
import json
import http.client
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
            test = False

            if api.payload is None:
                test = True
                userdata = request.form.to_dict()
            else:
                userdata = api.payload

            password = bcrypt.generate_password_hash(userdata["password"])
            User(password=password, username=userdata["username"]).save()

            if test:
                User.objects(username=userdata["username"]).delete()
                hashed_password = password.decode()
                return make_response(
                    jsonify({'response': 'The post has worked successfully', 'hashed_password': hashed_password}), 200)

            return make_response(jsonify({'response': 'The post has worked successfully'}), 200)

        except (AttributeError, TypeError):
            # raise AssertionError('Input variables should be strings')
            return make_response(jsonify({'response': 'The post request has encountered an error'}), 406)



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
                    return make_response(jsonify({'response': 'Successful login!', 'login': True, 'token': token}), 200)
                else:
                    """Return login false if the hashes do not match."""
                    return make_response(jsonify({'response': 'Failed login!', 'login': False}), 401)
            else:
                return make_response(jsonify({'response': 'Invalid user!', 'login': False}), 401)
        except:
            return make_response(jsonify({'response': 'An error has occurred', 'login': False}), 401)

    def get(self, user_name):
        """Get user by their username"""
        try:
            response = jsonify(User.objects.get(username=user_name))
            return make_response(response, 200)
        except Exception as e:
            return make_response(jsonify({'status': 'failed', 'error': str(e)}), 400)

# Sets the route to verify the token stored on the frontend and return true.
@jwt_required()
def dashboard():
    return make_response(jsonify({'response': 'User authenticated', 'token': True}), 200)
