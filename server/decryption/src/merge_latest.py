import json
import os

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

# Function to merge data
def merge_json_data(new_file, all_file):

    # Check if new_file exists; if not, exit
    if not os.path.exists(new_file):
        print(f"Error: File {new_file} does not exist. Exiting.")
        return

    # Load the new JSON data file
    new_data = load_json(new_file)
    if new_data is None:
        return
    
    # If all_file does not exist, create it and copy new_file data
    if not os.path.exists(all_file):
        save_json(all_file, new_data)
        return

    # Load the all JSON data file
    all_data = load_json(all_file)
    if all_data is None:
        return
    
    # Check if the 'data' section is of the correct format
    if not isinstance(all_data.get("data"), list) or not isinstance(new_data.get("data"), list):
        print("Error: 'data' field should be of list type")
        return

    length = min(len(all_data["data"]), len(new_data["data"]))
    
    # Merge the 'data' sections
    for i in range(length):
        # Validate the format of the new and old data
        if not validate_data_format(new_data["data"][i]) or not validate_data_format(all_data["data"][i]):
            print(f"Data format validation failed, skipping merge for item {i}")
            continue
        
        # Merge the data
        try:
            new_data["data"][i]["samples"].extend(all_data["data"][i]["samples"]) 
            all_data["data"][i]["samples"] = new_data["data"][i]["samples"] 

            new_data["data"][i]["timestamps"].extend(all_data["data"][i]["timestamps"])
            all_data["data"][i]["timestamps"] = new_data["data"][i]["timestamps"]

            all_data["data"][i]["num_samples"] += new_data["data"][i]["num_samples"]

            all_data["data"][i]["duration"] += new_data["data"][i]["duration"]
            
            all_data["data"][i]["sample_rate"] = all_data["data"][i]["num_samples"] / all_data["data"][i]["duration"]

            all_data["data"][i]["sample_interval"] = 1 / all_data["data"][i]["sample_rate"]

        except KeyError as e:
            print(f"Missing key {e}, skipping merge for this data item")
            continue

    # Save the merged data back to the old file
    save_json(all_file, all_data)
