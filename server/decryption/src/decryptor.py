# Import dependencies, libraries and classes
import binary_extraction
import folder_extraction
import json_creation
import copy_latest
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import json

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

    # Initialize the figure for plotting
    fig, ax = plt.subplots(figsize=(20, 6))  # Increase figure size
    
    # Generate a time axis and ECG signal (this is just example data, real data would come from `read_data`)
    t = np.linspace(0, 10, 2500)  # Time range from 0 to 10 seconds with 2500 data points
    
    # Initialize the line object, ensuring x and y axis data match
    line, = ax.plot([], [], lw=2)
    
    # Set the plot limits and labels, expand y-axis to fit ECG waveform
    ax.set_ylim(-2, 2)
    ax.set_xlim(0, 10)
    ax.set_xlabel("Time (s)", fontsize=14)
    ax.set_ylabel("ECG Signal", fontsize=14)
    
    # Add grid lines to improve plot readability
    ax.grid(True, which='both', linestyle='--', linewidth=0.5)
    
    # Initialize the data generator for reading data in batches
    data_read = read_ecg_data(batch_size=50)
    
    # Set up the animation to dynamically update the plot
    ani = FuncAnimation(fig, animate, frames=200, fargs=(t, None, line, data_read), interval=100, blit=True)
    
    # Adjust layout for the larger figure size
    plt.tight_layout()
    # Display the plot
    plt.show()


def read_ecg_data(batch_size):
    """
    This function simulates reading ECG data in batches.
    It reads data from a file and returns the data in chunks of size `batch_size`.
    """
    while True:
        with open("../../decrypted_data/ECG,II.json", 'r') as file:
            ecg_data = json.load(file)
            ecg_samples = np.array(ecg_data["data"][-1]["samples"])

        # Yield ECG samples in batches
        for i in range(0, len(ecg_samples), batch_size):
            yield ecg_samples[i:i + batch_size]

# Animation function to update ECG data for each frame
def animate(i, t, ecg, line, data_read):
    """
    This function is used for animating and updating the ECG data on each frame.
    """
    # Get the new ECG data
    current_data = next(data_read)
    
    # Check if the current data exceeds the time axis length
    if len(line.get_ydata()) + len(current_data) > len(t):
        # If the y-axis data exceeds the time range, reset the plot
        line.set_xdata(t[:len(current_data)])  # Reset x-axis to match the number of data points
        line.set_ydata(current_data)  # Update the y-axis with the current data
    else:
        # Otherwise, append the new data to the plot
        line.set_ydata(np.append(line.get_ydata(), current_data))  # Append new data to y-axis
        line.set_xdata(t[:len(line.get_ydata())])  # Update x-axis to match the y-axis length

    return line,

main()