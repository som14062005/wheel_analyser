from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Load model and scaler
try:
    model = joblib.load("model.pkl")
    scaler = joblib.load("scaler.pkl")
    print("✅ Model and scaler loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model/scaler: {e}")
    model = None
    scaler = None

FEATURES = ["wheel_diameter", "flange_height", "flange_thickness", "qr"]

@app.route("/")
def index():
    return {"message": "🚇 CMRL RUL Prediction API with replacement date logic is running!"}

@app.route("/predict", methods=["POST"])
def predict_with_dates():
    if model is None or scaler is None:
        return jsonify({"error": "Model or scaler not loaded"}), 500

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    result = {
        "TrainID": data.get("TrainID", "Unknown"),
        "wheelId": data.get("wheelId", "Unknown"),
        "before": {},
        "after": {}
    }

    for state in ["before", "after"]:
        if state not in data:
            continue

        for side in ["LH", "RH"]:
            if side not in data[state]:
                continue

            block = data[state][side]
            try:
                # Get installation date
                date_str = block.get("date")
                install_date = datetime.fromisoformat(date_str)
            except Exception:
                result[state][side] = {
                    "error": "Missing or invalid 'date' (use format: yyyy-mm-dd)"
                }
                continue

            try:
                input_vector = [
                    float(block["diameter"]),
                    float(block["flangeHeight"]),
                    float(block["flangeThickness"]),
                    float(block["qr"])
                ]
                input_scaled = scaler.transform([input_vector])
                rul_days = model.predict(input_scaled)[0]

                replacement_date = install_date + timedelta(days=int(round(rul_days)))

                result[state][side] = {
                    "rul_days": round(float(rul_days), 2),
                    "install_date": install_date.strftime("%Y-%m-%d"),
                    "expected_replacement_date": replacement_date.strftime("%Y-%m-%d")
                }
            except Exception as e:
                result[state][side] = {
                    "error": f"Invalid input or missing field: {str(e)}"
                }

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
