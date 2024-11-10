# Import dependencies, libraries and classes
import binary_extraction
import folder_extraction
import json_creation
import copy_latest

# Main function that calls the extraction and visualization methods
def main():

    # Copies all the files from the Moberg Monitor into the data folder
    # copy_latest.copy_files()

    # Extract all the data, index, settings and patient files into associated lists
    folder = folder_extraction.FolderExtraction('data/')
    data_files_list, index_files_list, settings_files_list, patient_info =folder.extract_folders()

    decrypter = binary_extraction.DataExtraction(data_files_list, index_files_list, settings_files_list, patient_info)
    
    decrypted_data_files = decrypter.decrypt_all_data_files()
    
    json_creation.save_to_json(decrypted_data_files, "../../decrypted_data")


main()