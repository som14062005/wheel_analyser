import pandas as pd
import glob
import os

# Path to the folder with your 52 CSV files
folder_path = r"C:\Users\prana\Projects\New folder\wheel_analyser\backend-cmrl\data"

# Find all .csv files in the folder
csv_files = glob.glob(os.path.join(folder_path, "*.csv"))

# Create list to collect DataFrames
dataframes = []

for file in csv_files:
    df = pd.read_csv(file)
    df['TrainFile'] = os.path.basename(file).replace('.csv', '')  # Optional: track source file
    dataframes.append(df)

# Combine all files into one DataFrame
merged_df = pd.concat(dataframes, ignore_index=True)

# Save the final merged file
output_path = os.path.join(folder_path, "combined_data.csv")
merged_df.to_csv(output_path, index=False)

print(f"✅ Combined CSV saved to:\n{output_path}")
