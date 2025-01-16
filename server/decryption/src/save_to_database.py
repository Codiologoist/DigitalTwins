from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from datetime import datetime
import glob
import hashlib 

def save_json_to_database():
    
    # Load the .env file
    load_dotenv()

    # Get MONGO_URI environment variable
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/DigitalTwinsDB')

    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    db = client.get_database()  # Get the current database
    data_collection = db["datas"]  # Collection for storing data
    all_data_collection = db["alldatas"]  # Collection for storing AllDataType

    # Function to read a file and parse it into JSON
    def read_file(file_path):
        with open(file_path, "r") as file:
            return json.load(file)
        
    # Function to calculate the MD5 hash of a file's content
    def calculate_file_hash(file_path):
        hasher = hashlib.md5()
        with open(file_path, "rb") as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()

    # Get all JSON files from the ../../decrypted_data/ directory
    data_directory = "../../decrypted_data/"
    json_files = glob.glob(os.path.join(data_directory, "*.json"))

    # Iterate over all files in the directory
    for file_path in json_files:
        
        # Calculate the file hash
        file_hash = calculate_file_hash(file_path)
        
        # Check if this hash already exists in the database
        if data_collection.find_one({"file_hash": file_hash}):
            print(f"File {file_path} already exists in the database. Skipping...")
            continue  # Skip to the next file
        
        # Extract data from the file
        signal_data = read_file(file_path)

        
        if isinstance(signal_data, dict):
            # Extract relevant fields from the JSON data
            signal_type = signal_data.get("signal_type")
            data_runs = signal_data.get("data")
            patient_first_name = signal_data.get("patient_first_name")
            patient_last_name = signal_data.get("patient_last_name")
            admission_time = signal_data.get("admission_time")

            # Format the data as a MongoDB document
            patient_data_document = {
                "signal_type": signal_type,
                "data": data_runs,
                "patient_first_name": patient_first_name,
                "patient_last_name": patient_last_name,
                "admission_time": admission_time,
                "file_hash": file_hash
            }
            
            # Insert the data into the MongoDB Data collection
            inserted_data = data_collection.insert_one(patient_data_document)

            # Update the AllData collection by appending the inserted ObjectId to the corresponding signal_type
            all_data_collection.update_one(
                {"signal_type": signal_type},  # Match documents by signal_type
                {"$addToSet": {"data_ids": inserted_data.inserted_id}},  # Append new ObjectId to the data_ids array
                upsert=True  # If no document is found, create a new one
            )

    print(f"Data from {data_directory} inserted successfully")

    # # Query all documents in the Data collection
    # cursor = data_collection.find()

    # # Print all query results
    # for document in cursor:
    #     print(document)



    # # Clear all data in the Data collection
    # data_collection.delete_many({})

    # # Clear all data in the All Data collection
    # all_data_collection.delete_many({})

    # print("Both collections have been cleared.")



    # # Get all collection names (equivalent to tables in a SQL database)
    # collections = db.list_collection_names()

    # # Print all collection names
    # print("Collections in the database:")
    # for collection in collections:
    #     print(collection)

    # # Print the number of collections
    # print(f"\nTotal collections: {len(collections)}")
    
if __name__ == "__main__":
    save_json_to_database()