import pandas as pd

# Correct file paths
INPUT_PATH = "../data/combined_data.csv"
OUTPUT_PATH = "cleaned_merged_data.csv"

def clean_data(df):
    print("📋 Original shape:", df.shape)

    # 🔤 Standardize column names
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]

    # 🧽 Drop rows with missing essential data
    df = df.dropna(subset=[
        "wheel_diameter", "flange_height", "flange_thickness", "qr", "date"
    ])

    # 📆 Convert 'date' to datetime format
    df["date"] = pd.to_datetime(df["date"], format="%d.%m.%Y", errors="coerce")

    # ❗ Drop rows where date conversion failed
    df = df.dropna(subset=["date"])

    # ✅ Clip extreme values (optional)
    df["wheel_diameter"] = df["wheel_diameter"].clip(750, 900)
    df["flange_height"] = df["flange_height"].clip(20, 45)
    df["flange_thickness"] = df["flange_thickness"].clip(20, 40)
    df["qr"] = df["qr"].clip(2, 15)

    print("✅ Cleaned shape:", df.shape)
    return df

def main():
    print("🔄 Loading merged data...")
    try:
        df = pd.read_csv(INPUT_PATH)
    except FileNotFoundError:
        print(f"❌ File not found: {INPUT_PATH}")
        return

    print("🧹 Cleaning data...")
    cleaned = clean_data(df)

    cleaned.to_csv(OUTPUT_PATH, index=False)
    print(f"📁 Saved cleaned data to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
