import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Reuse the MongoDB URI from TypeScript connection
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)

# Access the same database and collection used in index.ts
db = client["DigitalTwinsDB"]  # Database name
collection = db["patients"]  # Collection name

# Path to the decrypted data folder
decrypted_data_folder = os.path.join("server", "decrypted_Data")

def save_json_to_db(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)

            # Extract the patient data from the JSON
            patient_data = {
                "signal_type": data.get("signal_type", ""),
                "patient_first_name": data.get("patient_first_name", ""),
                "patient_last_name": data.get("patient_last_name", ""),
                "admission_time": data.get("admission_time", 0),
                "data": data.get("data", []),  # Assuming 'data' is an array of DataRun objects
            }

            # Insert or update patient data into the database
            existing_patient = collection.find_one({
                "patient_first_name": patient_data["patient_first_name"],
                "patient_last_name": patient_data["patient_last_name"],
                "admission_time": patient_data["admission_time"]
            })

            if existing_patient:
                # Update the existing patient document, adding the new data as an array
                updated_data = existing_patient.get("data", []) + patient_data["data"]
                collection.update_one(
                    {"_id": existing_patient["_id"]},
                    {"$set": {"data": updated_data}}
                )
                print(f"Updated data for {patient_data['patient_first_name']} {patient_data['patient_last_name']}")
            else:
                # Insert a new patient record
                collection.insert_one(patient_data)
                print(f"Inserted new data for {patient_data['patient_first_name']} {patient_data['patient_last_name']}")

    except Exception as e:
        print(f"Error saving {file_path}: {e}")


def save_all_json_files():
    for root, dirs, files in os.walk(decrypted_data_folder):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                save_json_to_db(file_path)

# Call the function to save all JSON files
save_all_json_files()
