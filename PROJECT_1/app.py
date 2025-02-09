from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import sqlite3
import os
import pandas as pd
import csv
import datetime
import bcrypt  # Ensure bcrypt is installed (pip install bcrypt)

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Change this to a strong secret key
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Generate sample data
dates = [(datetime.datetime.now() - datetime.timedelta(days=x)).strftime('%Y-%m-%d') 
         for x in range(14, 0, -1)]
emissions = [20 + (i % 5) + (i / 10) for i in range(14)]

# Create DataFrame and save to CSV
df = pd.DataFrame({'date': dates, 'emissions': emissions})
df.to_csv('carbon_data.csv', index=False)
print("Sample data created successfully!")

# MySQL connection (Replace with your actual connection details)
def get_db_connection():
    conn = sqlite3.connect("database.db")  # Change to MySQL if needed
    conn.row_factory = sqlite3.Row
    return conn

# Carbon emission factors
EMISSION_FACTOR_TRANSPORT = 0.12  # per km
EMISSION_FACTOR_WASTE = 2.5      # per kg

# Routes
@app.route('/')
def home():
    return render_template('index1.html')

@app.route('/progress')
def progress():
    return render_template('progress.html')

@app.route('/get_data')
def get_data():
    try:
        csv_path = os.path.join(os.path.dirname(__file__), 'carbon_data.csv')
        
        if not os.path.exists(csv_path):
            return jsonify({'error': 'CSV file not found'}), 404

        df = pd.read_csv(csv_path)
        if 'date' not in df.columns or 'emissions' not in df.columns:
            return jsonify({'error': 'CSV file must contain "date" and "emissions" columns'}), 400

        return jsonify({'dates': df['date'].tolist(), 'emissions': df['emissions'].tolist()})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/organization', methods=['GET', 'POST'])
def organization():
    if request.method == 'GET':
        return render_template('organization.html')

    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    total_distance, total_waste, carbon_footprint = calculate_footprint(file_path)
    return jsonify({
        "total_distance": total_distance,
        "total_waste": total_waste,
        "carbon_footprint": carbon_footprint
    })

def calculate_footprint(filename):
    total_distance = 0
    total_waste = 0
    carbon_footprint = 0

    with open(filename, mode="r") as file:
        reader = csv.reader(file)
        next(reader)  # Skip header
        
        for row in reader:
            distance = float(row[1])
            waste = float(row[2])
            total_distance += distance
            total_waste += waste
            carbon_footprint += (distance * 0.2) + (waste * 0.5)
    
    return total_distance, total_waste, carbon_footprint

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'success': False, 'message': "Invalid request data"}), 400

        username = data['username']
        password = data['password']

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'success': False, 'message': "Account already exists. You can log in!"})

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert new user
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password.decode('utf-8')))
        conn.commit()
        return jsonify({'success': True, 'message': "Registered successfully!"})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/calculator')
def calculator():
    return render_template('choice.html')

@app.route("/index")
def individual():
    return render_template("index.html", emission_sources=emission_sources)

@app.route('/region')
def region():
    return render_template('region.html')

@app.route('/index', methods=['POST'])
def calculate():
    try:
        data = request.json
        if not isinstance(data, list):
            return jsonify({"error": "Invalid data format"}), 400

        total_emissions = sum(
            next((s["factor"] * float(e["value"]) for s in emission_sources if s["id"] == e["sourceId"]), 0)
            for e in data
        )
        return jsonify({"total": round(total_emissions, 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/multi-user', methods=['GET', 'POST'])
def multi_user():
    if request.method == 'GET':
        return render_template("multi.html", emission_sources=emission_sources)

    try:
        data = request.json
        if not isinstance(data, list):
            return jsonify({"error": "Invalid data format"}), 400

        total_emissions = sum(
            next((s["factor"] * float(e["value"]) for s in emission_sources if s["id"] == e["sourceId"]), 0)
            for e in data
        )
        return jsonify({"total": round(total_emissions, 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/choice')
def choice():
    return render_template('choice.html')

@app.route('/login')
def login():
    return render_template('home.html')

# Define emission sources
emission_sources = [
    {"id": "electricity", "name": "Electricity", "factor": 0.4, "unit": "kWh"},
    {"id": "car", "name": "Car Travel", "factor": 0.2, "unit": "km"},
    {"id": "flight", "name": "Air Travel", "factor": 0.2, "unit": "km"},
    {"id": "meat", "name": "Meat Consumption", "factor": 6.0, "unit": "kg"},
    {"id": "waste", "name": "Waste", "factor": 0.5, "unit": "kg"},
]

if __name__ == '__main__':
    app.run(debug=True)
