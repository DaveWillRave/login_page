from flask import jsonify
from application.models import User
from application import app, api, bcrypt
from flask_restplus import Resource
from flask_jwt_extended import jwt_required, create_access_token
from flask_jwt_extended import get_jwt_identity
import jwt

import uuid

@api.route("/api", "/api/")
class UserAll(Resource):
    def get(self):
        return jsonify(User.objects.all())

    def post(self):
        try:

            userdata = api.payload
            password = bcrypt.generate_password_hash(userdata["password"])
            User(password=password, username=userdata["username"]).save()
            return jsonify({'response': 'The post has worked successfully'})

        except Exception as e:
            return jsonify({'response': 'The post request has encountered an error'})


@api.route("/api/<user_name>")
class UserId(Resource):

    def post(self, user_name):
        # try:

            if User.objects(username=user_name):
                data = api.payload
                # This returns a true or false
                if bcrypt.check_password_hash(User.objects(username=user_name)[0].password, data['password']):
                    # token = jwt.encode({'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)}, app.config['SECRET_KEY'])
                    token = create_access_token(identity=user_name)
                    print(token)
                    return jsonify({'response': 'Successful login!', 'login': True, 'token': token})
                else:
                    return jsonify({'response': 'Failed login!', 'login': False})
            else:
                return jsonify({'response': 'Invalid user!', 'login': False})
        # except:
        #     return jsonify({'response': 'An error has occurred', 'login': False})

    def get(self, user_name):
        return jsonify(User.objects.get(username=user_name))


@app.route('/auth', methods=['GET'])
@jwt_required()
def dashboard():
    return jsonify({'response': 'User authenticated', 'token': True}), 200
