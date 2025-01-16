import argparse
import os
import shutil
import binary_extraction
import folder_extraction
import json_creation
import copy_latest
import merge_latest
import save_to_database

if __name__ == "__main__":
    # Create an argument parser
    parser = argparse.ArgumentParser()
    # Add command line arguments for the duration of data to decrypt
    parser.add_argument('-d', '--duration', type=int, default=5, help='This argument is to be used for the duraton of data that is to be decrypted')
    # If this is the first time we run the script, we do not start from the beginning of the data files as there could be alot of data
    # And that adds limits to the latency of the server.
    parser.add_argument('-f', '--first', action='store_true', help='If this is the first time we run the script')
    # Receive that Path to the patient file on the CNS monitor
    parser.add_argument('-p', '--path', type=str, default='\\CNS', help='Path to the patient file on the CNS monitor')
    # Add argument for testing the front-end. This argument causes the python component to simulate the CNS monitor
    parser.add_argument('-t', '--test', action='store_true', help='If set to true, the python component will simulate the CNS monitor')
    # Parse the command line arguments
    args = parser.parse_args()

    # Copies all the files from the Moberg Monitor into the data folder
    # copy_latest.copy_files(args.path)

    # Get the directory of the current Python script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Use script_dir to define paths
    data_folder = os.path.join(script_dir, 'data')
    os.makedirs(data_folder, exist_ok=True)

    # Create the decrypted_data folder
    decrypted_data_folder = os.path.abspath(os.path.join(script_dir, '../../decrypted_data'))
    os.makedirs(decrypted_data_folder, exist_ok=True)

    # Delete index_info if this is the first time main runs
    if args.first:
        index_info_folder = os.path.abspath(os.path.join(script_dir, 'index_info'))
        if os.path.exists(index_info_folder):
            shutil.rmtree(index_info_folder)
        
    # Extract all the data, index, settings and patient files into associated lists
    folder = folder_extraction.FolderExtraction('data/')

    # Extract the data, index, settings and patient information files (binary)
    data_files_list, index_files_list, settings_files_list, patient_info = folder.extract_folders()

    # Extract the relevant data from the binary files
    decrypter = binary_extraction.DataExtraction(data_files_list, index_files_list, settings_files_list, patient_info, args.duration, args.first, args.test)
    
    # Decrypt the data files (with binary_extraction)
    decrypted_data_files = decrypter.decrypt_all_data_files()
    
    # Save the decrypted data to json files (which get sent to frontend)
    json_creation.save_to_json(decrypted_data_files, "../../decrypted_data")
    
    # Save descrypted json data into database
    save_to_database.save_json_to_database()