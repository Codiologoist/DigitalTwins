import os
import shutil
import glob


# Method to copy all the files from the most recently updated folder based on a given directory
def copy_files(directory):
    """
    Copies all the files from the most recently updated folder based on a given directory.

    Parameters
    ----------
    directory : str
        The directory to find the data in the CNS monitor.

    Notes
    -----
    The files are copied to a folder named 'data' in the same directory as the script.

    """
    # Copy all the files within the newest folder on the Moberg Monitor into the data folder
    dest = os.path.join(os.getcwd(), 'data')
    shutil.copytree(directory, dest, dirs_exist_ok=True)
