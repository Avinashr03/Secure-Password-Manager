from flask import Flask, request, jsonify, session
from flask_cors import CORS
import secrets
from cryptography.fernet import Fernet 
import string
from pymongo import MongoClient

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Set the secret key for the Flask application
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# Initialize Fernet for encryption/decryption
fernet = Fernet(Fernet.generate_key())

class PasswordManager:
    def __init__(self):
        self.user_credentials = {}

    def add_user(self, username, password):
        if username not in self.user_credentials:
            self.user_credentials[username] = {}
          
        enc_message = fernet.encrypt(password.encode())
        self.user_credentials[username]['password'] = enc_message

    def add_site(self, username, sitename, password):
        if 'saved_passwords' not in self.user_credentials[username]:
            self.user_credentials[username]['saved_passwords'] = {}
        enc_message = fernet.encrypt(password.encode())
        self.user_credentials[username]['saved_passwords'][sitename] = enc_message

    def get_user_by_username(self, username):
        return self.user_credentials.get(username)

    def user_exists(self, username):
        return username in self.user_credentials

    def verify_password(self, username, sitename, password):
        user = self.get_user_by_username(username)
        if 'password' in user:
            stored_password = user['password']
            dec_pass = fernet.decrypt(stored_password).decode()
            return password == dec_pass
        return False
    
    def generate_strong_password(self, length=12):
        characters = string.ascii_letters + string.digits + string.punctuation
        strong_password = ''.join(secrets.choice(characters) for _ in range(length))
        return strong_password
    

    def password_strength_dp(self, password):
        length_weight = 2
        uppercase_weight = 2
        lowercase_weight = 2
        digit_weight = 2
        symbol_weight = 3
        sequence_penalty = 4

        n = len(password)
        dp = [0] * (n + 1)

        for i in range(1, n + 1):
            dp[i] = dp[i - 1] + length_weight
            dp[i] += uppercase_weight if password[i - 1].isupper() else 0
            dp[i] += lowercase_weight if password[i - 1].islower() else 0
            dp[i] += digit_weight if password[i - 1].isdigit() else 0
            dp[i] += symbol_weight if not password[i - 1].isalnum() else 0
            dp[i] -= sequence_penalty * self.check_common_sequences(password[:i])
            dp[i] = max(dp[i], dp[i - 1])

        return dp[n]

    def check_common_sequences(self, substring):
        common_sequences = [
        '123', 'abc', 'password', 'qwerty', 'admin', 'letmein', 'welcome', '123456',
        '987654321', '111111', 'admin123', 'test', 'pass', 'root', 'toor', 'login',
        'default', 'password123', 'adminadmin', 'guest', 'superuser', 'changeme',
        'monkey', 'letmein', 'football', 'iloveyou', '1234', '4321', 'asdf', 'zxcv',
        'trustno1', 'password1', 'starwars', 'dragon', 'master', 'hello', '12345',
        'abcdef', 'qazwsx', '1q2w3e', 'admin1234', '123qwe', 'zxcvbn', 'qwertyuiop',
        'login123', 'welcome123', 'adminadmin123', 'password1234', 'pass123', 'adminadminadmin',
        'admin12345', 'adminadminadmin123', 'password12345', 'letmein123', 'test123',
        'iloveyou123', 'qwerty123', 'abc123', 'admin1', 'admin12', 'admin1234', 'admin12345',
        'admin123456', 'admin1234567', 'admin12345678', 'admin123456789', 'admin1234567890'
    
        ]

        penalty = 0
        for seq in common_sequences:
            if seq in substring.lower():
                penalty += 1
        return penalty
    
    def binary_search_username(self, sorted_usernames, target_username):
        low, high = 0, len(sorted_usernames) - 1

        while low <= high:
            mid = (low + high) // 2
            mid_username = sorted_usernames[mid]['username']

            if mid_username == target_username:
                return mid
            elif mid_username < target_username:
                low = mid + 1
            else:
                high = mid - 1

        return -1


password_manager = PasswordManager()

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        new_username = data['username']
        new_password = data['password']
        if not password_manager.user_exists(new_username):
            password_manager.add_user(new_username, new_password)  # Assuming sitename is the same as username
            return jsonify({'status': 'success', 'message': 'User registered successfully'})
        else:
            return jsonify({'status': 'error', 'message': 'Username already exists'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
    
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        login_username = data['username']
        login_password = data['password']
        print(login_username,login_password)
        if password_manager.verify_password(login_username, login_username, login_password):
            session['username'] = login_username  # Set the username in the session for later usage
            print(session)
            return jsonify({'status': 'success', 'message': 'Login successful'})
        else:
            return jsonify({'status': 'error', 'message': 'Invalid username or password'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
    
@app.route('/add_user', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        print("Session:", session) 
        if 'username' in session:
            site_name = data['sitename']
            new_password = data['password']
            username = session['username']
           
            if site_name and new_password:
                username = session['username']
                print(password_manager.user_credentials)
                if password_manager.user_exists(username):
                    password_manager.add_site(username, site_name, new_password)
                    print(password_manager.user_credentials)
                    return jsonify({'status': 'success', 'message': 'Site added successfully'})
                else:
                    return jsonify({'status': 'error', 'message': 'Site does not exist'})
            else:
                return jsonify({'status': 'error', 'message': 'Incomplete data provided'})
        else:
            return jsonify({'status': 'error', 'message': 'User not logged in'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/verify_password', methods=['POST'])
def verify_password():
    try:
        data = request.get_json()
        if 'username' in session:
            verify_username = session['username']
            verify_sitename = data['verify_sitename']
            verify_password = data['verify_password']
            
            user_credentials = password_manager.get_user_by_username(verify_username)
            if user_credentials and 'saved_passwords' in user_credentials:
                saved_passwords = user_credentials['saved_passwords']
                
                if verify_sitename in saved_passwords:
                    encrypted_password = saved_passwords[verify_sitename]
                    decrypted_password = fernet.decrypt(encrypted_password).decode()
                    
                    if verify_password == decrypted_password:
                        return jsonify({'status': 'success', 'message': 'Password is correct.'})
                    else:
                        return jsonify({'status': 'error', 'message': 'Password is incorrect.'})
                else:
                    return jsonify({'status': 'error', 'message': f"Site name {verify_sitename} not found for user {verify_username}"})
            else:
                return jsonify({'status': 'error', 'message': 'No saved passwords found for this user'})
        else:
            return jsonify({'status': 'error', 'message': 'User not logged in'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/search_sitename', methods=['POST'])
def search_sitename():
    try:
        data = request.get_json()
        if 'username' in session:
            username = session['username']
            print('username1'+ username)
            target_sitename =data['search_sitename']
            print(target_sitename)
            user_credentials = password_manager.get_user_by_username(username)
            if 'saved_passwords' in user_credentials:
                saved_passwords = user_credentials['saved_passwords']
                target_sitename = request.json['search_sitename']
                print(target_sitename)
          
                sitename_index = binary_search_sitename(sorted(saved_passwords.keys()), target_sitename)
               
                if sitename_index != -1:
                    sitename = sorted(saved_passwords.keys())[sitename_index]
                   
                    dec_message = fernet.decrypt(saved_passwords[sitename]).decode()
                  
                    return jsonify({'status': 'success', 'message': f"Password for {sitename}: {dec_message}"})
                else:
                    return jsonify({'status': 'error', 'message': f"Site name {target_sitename} not found for user {username}"})
            else:
                return jsonify({'status': 'error', 'message': 'No saved passwords found for this user'})
        else:
            return jsonify({'status': 'error', 'message': 'User not logged in'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

def decrypt_password(encrypted_password):
    key = Fernet.generate_key()  # Generate or load the key as needed
    fernet = Fernet(key)
    dec_message = fernet.decrypt(encrypted_password).decode()
    return dec_message

def binary_search_sitename(sorted_sitenames, target_sitename):
    low, high = 0, len(sorted_sitenames) - 1

    while low <= high:
        mid = (low + high) // 2
        mid_sitename = sorted_sitenames[mid]

        if mid_sitename == target_sitename:
            return mid
        elif mid_sitename < target_sitename:
            low = mid + 1
        else:
            high = mid - 1

    return -1



@app.route('/password_strength', methods=['POST'])
def password_strength():
    try:
        data = request.get_json()
        password_to_assess = data['password_to_assess']
        strength = password_manager.password_strength_dp(password_to_assess)
        return jsonify({'status': 'success', 'message': f"The strength of the password is: {strength}"})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/generate_strong_password', methods=['GET'])
def generate_strong_password():
    try:
        strong_password = password_manager.generate_strong_password()
        return jsonify({'status': 'success', 'message': f"Generated strong password: {strong_password}"})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
