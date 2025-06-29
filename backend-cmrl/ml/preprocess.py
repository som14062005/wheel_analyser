import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.utils import shuffle
import joblib
import os

INPUT_PATH = "C:/Users/prana/Projects/New folder/wheel_analyser/backend-cmrl/ml/cleaned_merged_data.csv"

OUTPUT_PATH = "C:/Users/prana/Projects/New folder/wheel_analyser/backend-cmrl/ml/preprocessed_data.csv"

def preprocess_data(df):
    print(f"📋 Original shape: {df.shape}")

    # 🧼 Drop unnecessary columns if they exist
    drop_cols = ['trainfile', 'trainid']
    df = df.drop(columns=[col for col in drop_cols if col in df.columns], errors='ignore')

    # 🧠 Encode categorical columns
    label_cols = ['state', 'side', 'axle']
    encoders = {}
    for col in label_cols:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le

    # 📊 Scale numeric features (skip 'date')
    num_cols = ['wheel_diameter', 'flange_height', 'flange_thickness', 'qr']
    scaler = StandardScaler()
    df[num_cols] = scaler.fit_transform(df[num_cols])

    # 🚨 Convert date to datetime (if not already)
    if not pd.api.types.is_datetime64_any_dtype(df['date']):
        df['date'] = pd.to_datetime(df['date'], errors='coerce')

    # 🌀 Shuffle for training
    df = shuffle(df, random_state=42)

    print(f"✅ Preprocessed shape: {df.shape}")
    return df, scaler, encoders

def main():
    print("🔄 Loading cleaned data...")
    df = pd.read_csv(INPUT_PATH)

    print("⚙️ Preprocessing...")
    df, scaler, encoders = preprocess_data(df)

    # 💾 Save final output
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"💾 Saved preprocessed data to: {OUTPUT_PATH}")

    joblib.dump(scaler, "C:/Users/prana/Projects/New folder/wheel_analyser/backend-cmrl/ml/scaler.pkl")
    joblib.dump(encoders, "C:/Users/prana/Projects/New folder/wheel_analyser/backend-cmrl/ml/encoders.pkl")

    print("✅ Saved scaler and encoders!")

if __name__ == "__main__":
    main()
