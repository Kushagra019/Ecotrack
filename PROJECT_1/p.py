from flask import Flask, request, jsonify, render_template
import pandas as pd
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Define carbon emission factor (example values in kg CO2e per km and kg waste)
EMISSION_FACTOR_TRANSPORT = 0.12  # per km (example)
EMISSION_FACTOR_WASTE = 2.5      # per kg (example)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Invalid file format. Please upload a CSV file."}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # Read CSV file
        df = pd.read_csv(file_path)

        # Validate columns
        required_columns = ['Name', 'Distance Travelled', 'Waste Management']
        if not all(col in df.columns for col in required_columns):
            return jsonify({"error": "CSV file must contain the following columns: Name, Distance Travelled, Waste Management."}), 400

        # Calculate totals
        total_distance = df['Distance Travelled'].sum()
        total_waste = df['Waste Management'].sum()

        # Calculate carbon footprint
        carbon_footprint = (total_distance * EMISSION_FACTOR_TRANSPORT) + (total_waste * EMISSION_FACTOR_WASTE)

        # Return results
        return jsonify({
            "total_distance": total_distance,
            "total_waste": total_waste,
            "carbon_footprint": carbon_footprint
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
