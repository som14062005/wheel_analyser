# app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
from datetime import timedelta
from dateutil.parser import parse
from pymongo import MongoClient
import os
import time
import pandas as pd
from email_alert import check_and_send_alerts, send_email_alert
 # ✅ Only import send_email_alert (not check_and_send_alerts)

# ==== App Setup ====
app = Flask(__name__)
CORS(app)

# ==== Load Model and Scaler ====
MODEL_PATH = "C:/wheel analyser/backend-cmrl/ml/model.pkl"
SCALER_PATH = "C:/wheel analyser/backend-cmrl/ml/scaler.pkl"

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ Model and scaler loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model/scaler: {e}")
    model = None
    scaler = None

# ==== Home ====
@app.route("/")
def home():
    return {"message": "✅ CMRL RUL Prediction API is running!"}

# ==== Prediction Endpoint ====
@app.route("/predict/<train_id>", methods=["GET"])
def predict(train_id):
    start_time = time.time()

    if not model or not scaler:
        return jsonify({"error": "Model or Scaler not loaded"}), 500

    try:
        client = MongoClient("mongodb://localhost:27017")
        db = client["wheeldb"]
        collection = db["wheeldatas"]
    except Exception as e:
        return jsonify({"error": "MongoDB connection failed", "details": str(e)}), 500

    entries = list(collection.find({
        "TrainID": {"$regex": f"^{train_id}$", "$options": "i"}
    }))

    if not entries:
        return jsonify({"error": f"No data found for TrainID: {train_id}"}), 404

    result_by_axle = {}
    input_vectors = []
    meta_info = []

    for entry in entries:
        axle = entry.get("Axle")
        state = entry.get("State")
        side = entry.get("Side")

        if not axle or not state or not side:
            continue

        if axle not in result_by_axle:
            result_by_axle[axle] = {
                "TrainID": entry.get("TrainID", train_id),
                "wheelId": axle,
                "before": {},
                "after": {}
            }

        try:
            raw_date = entry.get("date") or entry.get("timestamp")
            install_date = parse(str(raw_date))
        except Exception as e:
            print(f"⚠️ Skipping entry (date issue): {e}")
            continue

        try:
            input_vector = {
                "wheel_diameter": float(entry["diameter"]),
                "flange_height": float(entry["flangeHeight"]),
                "flange_thickness": float(entry["flangeThickness"]),
                "qr": float(entry["qr"])
            }
        except Exception as e:
            print(f"⚠️ Skipping entry (value error): {e}")
            continue

        input_vectors.append(input_vector)
        meta_info.append((axle, state, side, install_date))

    if not input_vectors:
        return jsonify({"error": "No valid entries to predict"}), 400

    input_df = pd.DataFrame(input_vectors)
    try:
        scaled = scaler.transform(input_df)
        predictions = model.predict(scaled)
    except Exception as e:
        return jsonify({"error": "Model prediction failed", "details": str(e)}), 500

    for i, (axle, state, side, install_date) in enumerate(meta_info):
        rul_days = predictions[i]
        replacement_date = install_date + timedelta(days=int(round(rul_days)))

        result_by_axle[axle][state][side] = {
            "install_date": install_date.strftime("%Y-%m-%d"),
            "rul_days": round(float(rul_days), 2),
            "expected_replacement_date": replacement_date.strftime("%Y-%m-%d")
        }

    print("⏱️ Total Prediction Time:", round(time.time() - start_time, 2), "seconds")
    return jsonify(list(result_by_axle.values()))

# ==== Email Test Endpoint ====
@app.route("/send-test-email", methods=["POST"])
def send_test_email():
    data = request.json
    try:
        send_email_alert(
            data["TrainID"],
            data["wheelId"],
            data["side"],
            data["expectedDate"],
            data["installDate"],
            data["rul"]
        )
        return jsonify({"message": "✅ Email sent successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==== Start Server ====
if __name__ == "__main__":
    # ❌ DO NOT call check_and_send_alerts() here!
    app.run(debug=True, port=5001)
