# Import dependencies, libraries and classes
import binary_extraction
import folder_extraction
import json_creation
import copy_latest
from threading import Timer

# Global Variables
patient_name, date, measurements = "", "", {}

# Main function that calls the extraction and visualization methods
def main():
    # Global variables was used to pass values between the two threads
    global patient_name, date, measurements

    # Copies all the files from the Moberg Monitor into the data folder
    # copy_latest.copy_files()

    # Extract all the data, index, settings and patient files into associated lists
    folder = folder_extraction.FolderExtraction('data/')
    data_file_list, index_file_list, settings_file_list, qual_time_list, qual_str_list, patient_info = folder.extract_folders()

    # Extract the data, time_vector, units, start_time values and more from the binary files
    data = binary_extraction.DataExtraction(data_file_list,
                                            index_file_list,
                                            settings_file_list,
                                            qual_time_list,
                                            qual_str_list,
                                            patient_info[0])

    patient_start, patient_discharged, patient_start_str, patient_name = data.extract_xml()
    # print(patient_start_str)
    date = patient_start_str[0][:-4]
    index_dict = data.extract_index_files(patient_start)
    data_dict = data.extract_data_files()
    qual_dict = data.extract_qual_time(patient_start)
    units, data_type, data_modality = data.extract_units()
    qual_str = data.extract_qual_string()

    # Create json files from the binary extracted values
    json = json_creation.JsonCreation(qual_str, qual_dict, data_dict, patient_start_str, index_dict, units, data_file_list, patient_name)
    json.save_json()

    

main()
