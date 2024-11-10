import sys
import numpy as np
import xml.etree.cElementTree as et
import pandas as pd
from enum import Enum
import struct

class Type(Enum):
    FLOAT = 'FLOAT'
    INTEGER = 'INTEGER'
    CHAR = 'CHAR'
    COMPOSITE = 'COMPOSITE'

class DataExtraction:
    def __init__(self, index_files, data_files, settings_files):
        self.index_files = index_files
        self.data_files = data_files
        self.settings_files = settings_files
        
    def decrypt_index_file(self, file_path, big_endian=False):
        index_size = 28
        start_pos = 0
        indicies = []
        end_pos = start_pos + index_size
        endian = 'little'
        index_li = []

        if big_endian:
            endian = 'big'
        
        try:
            with open(file_path, "rb") as index_file:
                data = index_file.read()

            while len(data) > end_pos:
                indicies.append(data[start_pos:end_pos])
                start_pos += index_size
                end_pos += index_size

            for index in indicies:
                index_entry = {}
                index_entry['number'] = int.from_bytes(index[0:8], byteorder=endian, signed=False)
                index_entry['time'] = int.from_bytes(index[8:16], byteorder=endian, signed=False)
                index_entry['interval_frac'] = int.from_bytes(index[16:20], byteorder=endian, signed=False)
                index_entry['interval_int'] = int.from_bytes(index[20:24], byteorder=endian, signed=False)
                index_entry['format'] = index[24]
                index_entry['checksum'] = index[25]
                index_entry['bytes'] = int.from_bytes(index[26:28], byteorder=endian, signed=False)
                index_li.append(index_entry)
            
            return index_li
        except Exception:
            raise Exception("Error reading from file").with_traceback(sys.exc_info()[2])

        
    def process_one_data_run(self, data_file, conversion_dict, index_dict_curr, index_dict_after=None, threshold=None, data_type=Type.FLOAT, big_endian=False):
        data_dict = {}
        endian = 'little'
        decrypted_samples = []
        sample_timestamps = []

        if big_endian:
            endian = 'big'

        if data_type == Type.FLOAT:
            func = lambda x: struct.unpack('<f', x)[0]
        elif data_type == Type.INTEGER:
            func = lambda x: int.from_bytes(x, byteorder=endian, signed=True)
        elif data_type == Type.CHAR:
            raise NotImplementedError("CHAR data type not implemented yet")
        elif data_type == Type.COMPOSITE:
            raise NotImplementedError("COMPOSITE data type not implemented yet")

        sample_interval = (index_dict_curr['interval_int'] + (index_dict_curr['interval_frac'] / (2**32)))

        sample_rate = 1000000 / sample_interval

        if index_dict_after != None:
            samples_in_run = index_dict_after['number'] - index_dict_curr['number']
        else:
            samples_in_run = int(len(data_file) / (index_dict_curr['bytes']) - index_dict_curr['number'])

        data_run_duration = samples_in_run * sample_interval / 1000000

        for i in range(samples_in_run):
            sample_timestamps.append((sample_interval * i) / 1000000)
            value = func(data_file[(index_dict_curr['number'] + i) * index_dict_curr['bytes']:
                                                    (index_dict_curr['number'] + i + 1) * index_dict_curr['bytes']])
            if conversion_dict != None:
                value = self.map_to_milivolts(value, conversion_dict['input_min'], conversion_dict['input_max'], 
                                              conversion_dict['output_min'], conversion_dict['output_max'])
            decrypted_samples.append(value)

        decrypted_samples = np.asarray(decrypted_samples)

        if (threshold != None):
            decrypted_samples = np.where(np.abs(decrypted_samples) > threshold, np.nan, decrypted_samples)
            decrypted_samples = pd.Series(decrypted_samples).interpolate().to_numpy()

        data_dict['samples'] = decrypted_samples
        data_dict['timestamps'] = np.asarray(sample_timestamps)
        data_dict['num_samples'] = samples_in_run
        data_dict['duration'] = data_run_duration
        data_dict['sample_rate'] = sample_rate
        data_dict['sample_interval'] = sample_interval / 1000000
        data_dict['start_time'] = index_dict_curr['time']

        return data_dict
        
        # Duration (seconds) = (Number of Samples * Sample Interval (microseconds)) / 1,000,000
        # Sample Interval (microseconds) = integer portion + (fractional portion / (2^32))
        # Sample Rate (Hz) = 1,000,000 / Sample Interval (microseconds)

    def process_all_data_runs(self, data_file, index_file, settings_file, threshold, data_type=Type.FLOAT):
        all_data_runs = []
        index_li = self.decrypt_index_file(index_file)
        settings_dict = {}

        setting_tuple = self.process_settings_file(settings_file)

        if isinstance(setting_tuple, tuple) and len(setting_tuple) == 5:
            settings_dict['input_min'] = setting_tuple[1]
            settings_dict['input_max'] = setting_tuple[2]
            settings_dict['output_min'] = setting_tuple[3]
            settings_dict['output_max'] = setting_tuple[4]
        else:
            settings_dict = None


        try:
            with open(data_file, "rb") as data_file:
                data = data_file.read()
        except Exception:
            raise Exception("Error reading from file").with_traceback(sys.exc_info()[2])
        
        for index in index_li:
            data_run = {}
            index_next_pos = index_li.index(index) + 1

            if index_next_pos < len(index_li):
                data_run = self.process_one_data_run(data, settings_dict, index, index_li[index_next_pos], threshold, data_type)
                data_run['unit'] = setting_tuple[0]
                all_data_runs.append(data_run)
            else:
                data_run = self.process_one_data_run(data, settings_dict, index, None, threshold, data_type)
                data_run['unit'] = setting_tuple[0]
                all_data_runs.append(data_run)

        return all_data_runs
    
    def map_to_milivolts(self, x, input_min, input_max, output_min, output_max):
        real_value = ((x - input_min) / (input_max - input_min)) * (output_max - output_min) + output_min
        
        return real_value

    

    def process_settings_file(self, xml_path):
        # Parse the XML content
        tree = et.parse(xml_path)
        root = tree.getroot()

        # Find the SampleConversion element
        sample_conversion = root.find("SampleConversion")

        if sample_conversion is not None:
            # Extract and convert the values into a list of integers
            values = list(map(int, sample_conversion.text.strip().split(',')))
            # Assign to input and output range variables
            input_min, input_max, output_min, output_max = values

        # Find the Units element
        units = root.find("Units")

        # Save unit type to string variable
        unit_type = units.text.strip()
        
        if sample_conversion is not None:
            return unit_type, input_min, input_max, output_min, output_max,
        else:
            return unit_type, None, None, None, None
        