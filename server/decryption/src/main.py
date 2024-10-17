import subprocess
import platform
import time
import argparse
import os

if __name__ == "__main__":
    # Create an argument parser
    parser = argparse.ArgumentParser()
    # Add command line arguments for the time to wait between script runs
    parser.add_argument('-t', '--time', type=int, default=5, help='Time to wait between script runs in seconds')
    # Parse the command line arguments
    args = parser.parse_args()

    # Determines if we decrypt files once only
    is_run_once = False

    # See if there is a CI_RUN environment variable
    if 'CI_RUN' in os.environ:
        is_run_once = True

    # Loop indefinitely until the script is interrupted
    while True:
        # Determine the appropriate Python command based on the operating system
        python_command = "python3" if platform.system() in ["Linux", "Darwin"] else "python"

        # Run the decryption script
        subprocess.run([python_command, "decryptor.py"])

        if is_run_once:
            break

        # Wait for 5 seconds
        print(f'Sleeping for {args.time} seconds...')
        time.sleep(args.time)