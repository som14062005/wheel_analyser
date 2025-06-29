import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

# Load the preprocessed data
df = pd.read_csv("preprocessed_data.csv")

# Feature columns
features = ['wheel_diameter', 'flange_height', 'flange_thickness', 'qr']
X = df[features]

# --- Generate synthetic target: expected operational days ---
# This is based on the logic: more wear = fewer days
def estimate_rul(row):
    if row['qr'] >= 9:
        return np.random.normal(2000, 150)
    elif row['qr'] >= 7:
        return np.random.normal(1500, 100)
    elif row['qr'] >= 5:
        return np.random.normal(1000, 100)
    else:
        return np.random.normal(400, 50)

# Create target column
df['expected_operational_days'] = df.apply(estimate_rul, axis=1)
y = df['expected_operational_days']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predictions for evaluation
y_pred = model.predict(X_test)

# Evaluation
print("📊 Model Evaluation:")
print(f"  MAE : {mean_absolute_error(y_test, y_pred):.2f}")
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"  RMSE: {rmse:.2f}")
print(f"  R²  : {r2_score(y_test, y_pred):.3f}")


# Save the model
joblib.dump(model, "model.pkl")
print("✅ Model saved as model.pkl")
