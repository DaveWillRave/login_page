import os


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or b'&>\xe0\x1eR=^\x1f"_\xe2f\'\xdc\x98\xf8'

    MONGODB_SETTINGS = {'db': 'userData'}
