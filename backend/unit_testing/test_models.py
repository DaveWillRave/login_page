import unittest
from application import models
from mongoengine import *
from application.models import User


class TestModels(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
        setup class to disconnect any current connections, connect to the mock database url,
        and save a temporary user to the database for testing get models and schema (for frontend login)
        """
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')
        print("setupClass")

    @classmethod
    def tearDownClass(cls):
        disconnect()
        print("teardownClass")

    def setUp(self):
        self.user_1 = models.User(**{'_id': '6062dabdbbb2c3f109a049e9', 'username': 'James', 'password': '123'})

    def test_models(self):
        """
        Testing the schema make sure the document model works correctly
        """

        self.assertEqual(self.user_1['_id'], models.ObjectId('6062dabdbbb2c3f109a049e9'))
        self.assertEqual(self.user_1['username'], "James")
        self.assertEqual(self.user_1['password'], "123")

    def test_mongo(self):
        """
        Testing for how models saves and retrieves the mockupDB data
        """
        user1 = self.user_1
        pers = User(username=user1.username, _id=user1._id, password=user1.password)
        pers.save()
        fresh_pers = User.objects().first()
        print("fresh_pers.username")
        self.assertEqual(fresh_pers.username, 'James')
        self.assertEqual(fresh_pers.password, '123')


if __name__ == '__main__':
    unittest.main()