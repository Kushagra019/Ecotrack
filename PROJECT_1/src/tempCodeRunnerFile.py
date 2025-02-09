from flask import Flask, request, jsonify, render_template
import mysql.connector
import bcrypt  # Import bcrypt for password hashing

app = Flask(__name__)

# MySQL database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'BASKETBALL#23',  # Update with your MySQL password
    'database': 'user_db',
    'port': 3306
}

# Function to establish a database connection
def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get data from frontend
    username = data.get('username')
    password = data.get('password')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if the username exists
        cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
        user_record = cursor.fetchone()

        if user_record:
            stored_hashed_password = user_record[0]

            # Verify hashed password
            if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password.encode('utf-8')):
                return jsonify({'success': True, 'message': "Login successful!"})
            else:
                return jsonify({'success': False, 'message': "Incorrect password. Try again."})

        return jsonify({'success': False, 'message': "User does not exist. Please register first."})

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return jsonify({'success': False, 'error': str(err)})

    finally:
        cursor.close()
        conn.close()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Get data from frontend
    username = data.get('username')
    password = data.get('password')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'success': False, 'message': "Account already exists. You can log in!"})

        # Hash the password before storing
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert new user into the users table
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password.decode('utf-8')))
        conn.commit()

        return jsonify({'success': True, 'message': "Registered successfully!"})

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return jsonify({'success': False, 'error': str(err)})

    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
