import os
import pathlib
import numpy as np
import json

def save_to_json(data_dict, directory):
    """
    Iterates over all data files in the decrypted_data dictionary and saves them as 
    json files in the specified directory.

    :param data_dict: Dictionary containing the decrypted data
    :param directory: Directory to save the json files
    """
    output_dir = os.path.join(os.path.dirname(__file__), directory) # Output directory to save json files
    os.makedirs(output_dir, exist_ok=True)                          # Create directory if it does not exist

    for data_file in data_dict.get('decrypted_data', []):           # Iterate over all data files in decrypted_data
        signal_data = {                                             # Create dictionary to store signal data
            'signal_type': data_file['signal_type'],
            'data': []
        }

        for run in data_file['data']:           # Iterate over all runs in data file
            run_data = {
                'samples': run['samples'].tolist(),         # Data of each sample in run
                'timestamps': run['timestamps'].tolist(),   # Timestamps of each data sample
                'num_samples': run['num_samples'],          # Number of samples in data run
                'duration': run['duration'],                # Duration of run
                'sample_rate': run['sample_rate'],          # Sample rate in Hz
                'sample_interval': run['sample_interval'],  # Interval between each data sample
                'start_time': run['start_time'],            # Start time of run
                'unit': run['unit']
            }

            signal_data['data'].append(run_data)
        signal_data['patient_first_name'] = data_dict['patient_first_name'] # Patient first name
        signal_data['patient_last_name'] = data_dict['patient_last_name']   # Patient last name
        signal_data['admission_time'] = data_dict['admission_time']         # Admission time
        file_path = os.path.join(output_dir, f"{signal_data['signal_type']}.json")  # File path to save json file
        with open(file_path, 'w') as json_file:             # Open file to write
            json.dump(signal_data, json_file, indent=4)     # Save data to json file
