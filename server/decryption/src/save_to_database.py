from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from datetime import datetime
import glob

# Load the .env file
load_dotenv()

# Get MONGO_URI environment variable
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/DigitalTwinsDB')

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client.get_database()  # Get the current database
data_collection = db["Data"]  # Collection for storing data
all_data_collection = db["AllData"]  # Collection for storing AllDataType

# Function to read a file and parse it into JSON
def read_file(file_path):
    with open(file_path, "r") as file:
        return json.load(file)

# Get all JSON files from the ../../decrypted_data/ directory
data_directory = "../../decrypted_data/"
json_files = glob.glob(os.path.join(data_directory, "*.json"))

# Iterate over all files in the directory
for file_path in json_files:
    # Extract data from the file
    signal_data = read_file(file_path)

    # Extract relevant fields from the JSON data
    signal_type = signal_data.get("signal_type")
    patient_first_name = signal_data.get("patient_first_name")
    patient_last_name = signal_data.get("patient_last_name")
    admission_time = signal_data.get("admission_time")
    data_runs = signal_data.get("data")

    # Format the data as a MongoDB document
    patient_data_document = {
        "signal_type": signal_type,
        "data": data_runs,
        "patient_first_name": patient_first_name,
        "patient_last_name": patient_last_name,
        "admission_time": admission_time
    }

    # Insert the data into the MongoDB Data collection
    inserted_data = data_collection.insert_one(patient_data_document)

    # Assuming each file type (e.g., "ECG,II", "ABP,Dias") corresponds to a field in the AllDataType collection
    all_data_update = {
        signal_type: [inserted_data.inserted_id]  # Add the inserted Data document's ObjectId to the corresponding field
    }

    # Update the AllData collection (if the AllData collection already exists)
    all_data_collection.update_one(
        {"_id": inserted_data.inserted_id},  # Replace with the appropriate _id
        {"$addToSet": all_data_update},  # Use $addToSet to ensure no duplicate ObjectId
        upsert=True  # If no document is found, insert a new one
    )

    print(f"Data from {file_path} inserted with ObjectId: {inserted_data.inserted_id}")

# # Query all documents in the Data collection
# cursor = data_collection.find()

# # Print all query results
# for document in cursor:
#     print(document)
