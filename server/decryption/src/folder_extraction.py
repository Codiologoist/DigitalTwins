import pathlib
import os


class FolderExtraction:
    """
    Class to extract the data, index and settings file from the overall data folder. This is done since only these
    files are needed to extract the necessary values.
    """
    def __init__(self, folder): # Constructor to initialize the folder path
        self.folder = folder

    def extract_folders(self):
        """
        Extracts the data, index, settings and patient information files from the data folder.
        """
        data_files, index_files, settings_files, patient_information = [], [], [], ''   # Initialize lists to store the files
        data_path = os.path.join(pathlib.Path(__file__).parent.resolve(), "data", "")   # Path to the data folder
        directory = os.fsencode(data_path)                                              # Encode the path to bytes

        # Iterate over all the files in the data directory and check the filename.
        # Based on the filenames separate the necessary files into their associated list.
        # This way we can easily iterate over all the files of a certain type in binary_extraction.
        for file in os.listdir(directory):
            filename = os.fsdecode(file)                # Decode the filename from bytes to string
            filename = os.path.join(data_path, filename)   # Join the filename with the data folder path
            if "NumericQuality" in filename or "WaveQuality" in filename:
                continue
            elif "Char" in filename:
                continue
            elif "Impedance" in filename:
                continue
            elif "EEG,Composite,SampleSeries" in filename:
                continue
                if "Alert" in filename:
                    continue
                if "MarkEvent" in filename:
                    continue
                if filename.endswith(",data"):          # Store the data files
                    data_files.append(filename)
                elif filename.endswith(",index"):       # Store the index files
                    index_files.append(filename)
                elif filename.endswith(",settings"):    # Store the settings files
                    settings_files.append(filename)
            elif filename.endswith("patient.info"):
                patient_information = filename          # Store the patient information file
            elif "Float" or "Integer" in filename:
                if "Alert" in filename:
                    continue
                if "MarkEvent" in filename:
                    continue
                if filename.endswith(",data"):          # Store the data files
                    data_files.append(filename)
                elif filename.endswith(",index"):       # Store the index files
                    index_files.append(filename)
                elif filename.endswith(",settings"):    # Store the settings files
                    settings_files.append(filename)
            else:
                continue

        return data_files, index_files, settings_files, patient_information

