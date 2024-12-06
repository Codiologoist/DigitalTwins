import json
import os
import hashlib

# Function to load JSON files
def load_json(file_path):
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading file {file_path}: {e}")
        return None

# Function to save the merged JSON data
def save_json(file_path, data):
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"Merged data successfully saved to {file_path}")
    except Exception as e:
        print(f"Error saving file {file_path}: {e}")

# Function to validate data format
def validate_data_format(data_item):
    # Check if required fields are present and if field types are correct
    required_keys = ["samples", "timestamps", "num_samples", "duration", "sample_rate", "sample_interval"]
    for key in required_keys:
        if key not in data_item:
            print(f"Error: Missing required field '{key}'")
            return False
        # Check if the field type is correct
        if key == "samples" or key == "timestamps":
            if not isinstance(data_item[key], list):
                print(f"Error: '{key}' should be a list")
                return False
        elif key == "num_samples":
            if not isinstance(data_item[key], int):
                print(f"Error: '{key}' should be an integer")
                return False
        elif key == "duration" or key == "sample_rate" or key == "sample_interval":
            if not isinstance(data_item[key], (int, float)):
                print(f"Error: '{key}' should be a numeric type")
                return False
    return True

# Function to calculate file hash
def calculate_file_hash(file_path):
    try:
        hasher = hashlib.md5()
        with open(file_path, 'rb') as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception as e:
        print(f"Error calculating hash for file {file_path}: {e}")
        return None

# Function to merge data
def merge_json_data(latest_file, merged_file):

    # Check if latest_file exists; if not, exit
    if not os.path.exists(latest_file):
        print(f"Error: File {latest_file} does not exist. Exiting.")
        return

    # Load the latest JSON data file
    latest_data = load_json(latest_file)
    if latest_data is None:
        return
    
    # If merged_file does not exist, create it and copy latest_file data
    if not os.path.exists(merged_file):
        save_json(merged_file, latest_data)
        return

    # Load the merged JSON data file
    merged_data = load_json(merged_file)
    if merged_data is None:
        return
    
    # Check if the 'data' section is of the correct format
    if not isinstance(merged_data.get("data"), list) or not isinstance(latest_data.get("data"), list):
        print("Error: 'data' field should be of list type")
        return
    
    # Check if "last_merged_hashes" exists and compare its value
    if "last_merged_hashes" in merged_data and merged_data["last_merged_hashes"] == calculate_file_hash(latest_file):
        return

    length = min(len(merged_data["data"]), len(latest_data["data"]))
    
    # Merge the 'data' sections
    for i in range(length):
        # Validate the format of the new and old data
        if not validate_data_format(latest_data["data"][i]) or not validate_data_format(merged_data["data"][i]):
            print(f"Data format validation failed, skipping merge for item {i}")
            continue
        
        # Merge the data
        try:
            latest_data["data"][i]["samples"].extend(merged_data["data"][i]["samples"]) 
            merged_data["data"][i]["samples"] = latest_data["data"][i]["samples"] 

            latest_data["data"][i]["timestamps"].extend(merged_data["data"][i]["timestamps"])
            merged_data["data"][i]["timestamps"] = latest_data["data"][i]["timestamps"]

            merged_data["data"][i]["num_samples"] += latest_data["data"][i]["num_samples"]

            merged_data["data"][i]["duration"] += latest_data["data"][i]["duration"]
            
            merged_data["data"][i]["sample_rate"] = merged_data["data"][i]["num_samples"] / merged_data["data"][i]["duration"]

            merged_data["data"][i]["sample_interval"] = 1 / merged_data["data"][i]["sample_rate"]

            merged_data["last_merged_hashes"] = calculate_file_hash(latest_file)

        except KeyError as e:
            print(f"Missing key {e}, skipping merge for this data item")
            continue

    # Save the merged data back to the old file
    save_json(merged_file, merged_data)
