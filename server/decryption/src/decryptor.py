# Import dependencies, libraries and classes
import binary_extraction
import folder_extraction
import json_creation
import copy_latest
import merge_latest

# Main function to run the decryption process
def main():
    # Copies all the files from the Moberg Monitor into the data folder
    # copy_latest.copy_files()

    # Extract all the data, index, settings and patient files into associated lists
    folder = folder_extraction.FolderExtraction('data/')

    # Extract the data, index, settings and patient information files (binary)
    data_files_list, index_files_list, settings_files_list, patient_info = folder.extract_folders()

    # Extract the relevant data from the binary files
    decrypter = binary_extraction.DataExtraction(data_files_list, index_files_list, settings_files_list, patient_info)
    
    # Decrypt the data files (with binary_extraction)
    decrypted_data_files = decrypter.decrypt_all_data_files()
    
    # Save the decrypted data to json files (which get sent to frontend)
    json_creation.save_to_json(decrypted_data_files, "../../decrypted_data")

    merge_latest.merge_json_data("../../decrypted_data/ECG,II.json", "../../decrypted_data/ECG,II,Merged.json")

main()
