from flask import Flask, render_template, request, jsonify
import random  # Simulating region-based CO₂ data

app = Flask(__name__)


emission_sources = [
    {"id": "electricity", "name": "Electricity", "factor": 0.4, "unit": "kWh"},
    {"id": "car", "name": "Car Travel", "factor": 0.2, "unit": "km"},
    {"id": "flight", "name": "Air Travel", "factor": 0.2, "unit": "km"},
    {"id": "meat", "name": "Meat Consumption", "factor": 6.0, "unit": "kg"},
    {"id": "waste", "name": "Waste", "factor": 0.5, "unit": "kg"},
]


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/calculator')
def calculator():
    return render_template('index.html', emission_sources=emission_sources)


@app.route('/region')
def region():
    return render_template('region.html')


@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    total_emissions = sum(
        next((s["factor"] * float(e["value"]) for s in emission_sources if s["id"] == e["sourceId"]), 0) for e in data
    )
    return jsonify({"total": round(total_emissions, 2)})


@app.route('/region-data')
def region_data():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if lat and lon:
        estimated_co2 = round(random.uniform(3.0, 12.0), 2)  # Simulated CO₂ data
        return jsonify({"co2": estimated_co2})
    return jsonify({"error": "Invalid location"}), 400

@app.route('/progress')
def progress():
    return render_template('progress.html')


if __name__ == '__main__':
    app.run(debug=True)
