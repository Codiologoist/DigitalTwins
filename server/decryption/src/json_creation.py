import os
import pathlib
import numpy as np
import json

def save_to_json(data_dict, directory):
    output_dir = os.path.join(os.path.dirname(__file__), directory)
    os.makedirs(output_dir, exist_ok=True)

    for data_file in data_dict.get('decrypted_data', []):
        signal_data = {
            'signal_type': data_file['signal_type'],
            'data': []
        }

        for run in data_file['data']:
            run_data = {
                'samples': run['samples'].tolist(),
                'timestamps': run['timestamps'].tolist(),
                'num_samples': run['num_samples'],
                'duration': run['duration'],
                'sample_rate': run['sample_rate'],
                'sample_interval': run['sample_interval'],
                'start_time': run['start_time']
            }

            signal_data['data'].append(run_data)
        signal_data['patient_first_name'] = data_dict['patient_first_name']
        signal_data['patient_last_name'] = data_dict['patient_last_name']
        signal_data['admission_time'] = data_dict['admission_time']
        file_path = os.path.join(output_dir, f"{signal_data['signal_type']}.json")
        with open(file_path, 'w') as json_file:
            json.dump(signal_data, json_file, indent=4)