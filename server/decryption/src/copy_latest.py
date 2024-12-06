import os
import shutil
import glob


# Method to copy all the files from the most recently updated folder based on a given directory
def copy_files():
    # Directory of the Moberg Monitor network path
    directory = '//CNS22503/Archive/PatientData_1733475717404995'

    # Copy all the files within the newest folder on the Moberg Monitor into the data folder
    dest = os.path.join(os.getcwd(), 'data')
    # newest_folder = max(glob.glob(os.path.join(directory, '*/')), key=os.path.getmtime)
    shutil.copytree(directory, dest, dirs_exist_ok=True)
