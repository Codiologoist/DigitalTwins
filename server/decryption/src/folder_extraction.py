import pathlib
import os


class FolderExtraction:
    """
    Class to extract the data, index and settings file from the overall data folder. This is done since only these
    files are needed to extract the necessary values.
    """
    def __init__(self, folder):
        self.folder = folder

    def extract_folders(self):
        data_files, index_files, settings_files, patient_information = [], [], [], ''
        data_path = os.path.join(pathlib.Path(__file__).parent.resolve(), "data", "")
        directory = os.fsencode(data_path)

        # Iterate over all the files in the data directory and check the filename.
        # Based on the filenames separate the necessary files into their associated list.
        # This way we can easily iterate over all the files of a certain type in binary_extraction.
        for file in os.listdir(directory):
            filename = os.fsdecode(file)  # Decode the filename from bytes to string
            filename = os.path.join("data", filename)
            if "NumericQuality" in filename or "WaveQuality" in filename:
                continue
            elif "Char" in filename:
                continue
            elif "Impedance" in filename:
                continue
            elif "Composite" in filename:
                continue
            elif filename.endswith("patient.info"):
                patient_information = filename
            elif "Float" or "Integer" in filename:
                if "Alert" in filename:
                    continue
                if "MarkEvent" in filename:
                    continue
                if filename.endswith(",data"):
                    data_files.append(filename)
                elif filename.endswith(",index"):
                    index_files.append(filename)
                elif filename.endswith(",settings"):
                    settings_files.append(filename)
            else:
                continue

        return data_files, index_files, settings_files, patient_information
