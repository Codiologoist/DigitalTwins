import os
import pathlib
import numpy as np
import json


class JsonCreation:
    """
    Class to create the json files using all the extracted values from the binary files.
    """
    def __init__(self, data_qual_str, data_qual_time, measurement, start_date_time, time_vector, units, files, full_name):
        self.data_qual_str = data_qual_str
        self.data_qual_time = data_qual_time
        self.measurement = measurement
        self.start_date_time = start_date_time
        self.time_vector = time_vector
        self.units = units
        self.files = files
        self.full_name = full_name

    def save_json(self):
        # Change directory to json
        json_path = os.path.join(pathlib.Path(__file__).parent.resolve(), "../../decrypted_data", "")
        os.chdir(json_path)

        # Iterate over all the files and create a json file with the corresponding values
        for i in range(len(self.files)):
            json_dict = {'data_qual_str': self.data_qual_str[self.files[i]],
                        'data_qual_time': self.data_qual_time[self.files[i]],
                        'measurement_data': self.measurement[self.files[i]],
                        'start_date_time': self.start_date_time[0],
                        'time_vector': self.time_vector[self.files[i]],
                        'units': self.units[self.files[i]],
                        'full_name': self.full_name}
            self.convert_to_json(json_dict, self.files[i][5:] + ".json")
            print(f'Json File Created: {self.files[i][5:] + ".json"}')

        # Change directory back to main
        os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir))
    
    def convert_to_json(self, data_dict, output_json_path):
        """Convert the .json file data to .json."""
        if data_dict is None:
            print("No data to convert. Please load the .json file first.")
            return

        try:
            # Convert numpy arrays and bytes to JSON-compatible forjsons
            data_for_json = {}
            for key, value in data_dict.items():
                if isinstance(value, bytes):
                    data_for_json[key] = value.decode()  # Convert bytes to string
                elif isinstance(value, (list, tuple)):
                    data_for_json[key] = list(value)
                elif isinstance(value, np.ndarray):
                    data_for_json[key] = value.tolist()  # Convert numpy arrays to lists
                else:
                    data_for_json[key] = value
            
            # Write data to JSON file
            with open(output_json_path, 'w') as json_file:
                json.dump(data_for_json, json_file, indent=4)
            print(f"Data successfully written to {output_json_path}")
        except Exception as e:
            print(f"Error converting to JSON: {e}")
