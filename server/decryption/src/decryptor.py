# Import dependencies, libraries and classes
import binary_extraction_own
import folder_extraction
import json_creation
import copy_latest
from threading import Timer
import matplotlib.pyplot as plt
import numpy as np

# Main function that calls the extraction and visualization methods
def main():

    # Copies all the files from the Moberg Monitor into the data folder
    # copy_latest.copy_files()

    # Extract all the data, index, settings and patient files into associated lists
    folder = folder_extraction.FolderExtraction('data/')
    data_files_list, index_files_list, settings_files_list, patient_info =folder.extract_folders()

def validate_measurement_data(measurement):
    # Extract values for validation
    samples = measurement['samples']
    timestamps = measurement['timestamps']
    num_samples = measurement['num_samples']
    duration = measurement['duration']
    sample_rate = measurement['sample_rate']
    sample_interval = measurement['sample_interval']
    input_min = measurement.get('input_min')
    input_max = measurement.get('input_max')
    output_min = measurement.get('output_min')
    output_max = measurement.get('output_max')

    # Validation 1: Check if timestamps are increasing and match sample interval
    time_diffs = np.diff(timestamps)
    if not np.allclose(time_diffs, sample_interval):
        print("Timestamp check failed: Timestamps do not match the sample interval.")
    else:
        print("Timestamp check passed: Timestamps match the sample interval.")

    # Validation 2: Check if num_samples matches the length of samples array
    if len(samples) != num_samples:
        print(f"Sample count check failed: Expected {num_samples} samples but found {len(samples)}.")
    else:
        print("Sample count check passed.")

    # Validation 3: Check if duration matches sample count and interval
    calculated_duration = num_samples * sample_interval
    if not np.isclose(duration, calculated_duration):
        print(f"Duration check failed: Expected {calculated_duration} seconds, got {duration} seconds.")
    else:
        print("Duration check passed.")

    # Validation 4: Verify that sample_rate is consistent with sample_interval
    calculated_sample_rate = 1 / sample_interval
    if not np.isclose(sample_rate, calculated_sample_rate):
        print(f"Sample rate check failed: Expected {calculated_sample_rate} Hz, got {sample_rate} Hz.")
    else:
        print("Sample rate check passed.")

    # Validation 5: Verify that sample values are within the expected range (after conversion)
    if input_min is not None and output_min is not None:
        if (samples < output_min).any() or (samples > output_max).any():
            print("Sample value range check failed: Some samples are out of the expected range.")
        else:
            print("Sample value range check passed.")
    

main()
