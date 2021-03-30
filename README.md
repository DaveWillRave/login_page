# Login Page
An Angular, Flask API and MongoDB application for logging in and registering users.

## Feature list

+ Login - Login allowing user to login with valid credentials. Login button only enabled if input fields have information.
+ Registration - Registration pop-up with focus backdrop to allow registration if correct inputs applied to fields. Sign up button only enabled if input fields have valid                information. Pop-up can be closed by clicking on background.
+ Homepage - Accessable only if a user is logged in and there is a valid token in memory. Displays the number of users already registered.
+ Logout - Wipes the token from local memory and redirects user to login page.
+ Interceptor - Adds HttpOptions to http requests. 
+ Authguard - Restricts users accessing directories without login credentials.

## Requirements
+ Frontend - This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.5. Angular Materials is used for designing login and homepage components along with Angular CDK library for additional features.

+ Backend - Flask API version 1.1.2 is running on Python 3.8.6. MongoEngine is used by the Flask Api. MongoDB stores user login credentials, with users identified by their username and password. Bcrypt 3.2.0 library is used for encrypting user passwords before sending them into the database. Usernames are unique entries. Werkzeug version 0.16.1 is needed for compatibility with CORS package.

## Setup

+ Angular Development server - Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Use the command 'npm install' to install any requirements.
+ Flask API - To run the flask api install all the requirments using 'pip install -r requirements.txt' 
Then simply run the command 'python -m flask run'

## Relevant Frontend directories
"login_page/frontend/src/app/" contains all the frontend code and with "/auth" containing the token interceptor and auth guard services.
"user.services.ts" handles all the http requests and the get token request.

## Relevant Backend directories
"login_page/backend/application/" contains all the relevant backend code with some references from "__ init__.py" to "config.py" for configuring the Mongo database.




