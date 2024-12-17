# DigitalTwins

## Project Summary
This project is a web-based patient bedside monitor application that simulates the visualization and trending of patient signals, similar to a hospital bedside monitor. It dynamically plots real-time signals (with low latency) and visualizes historical trends over a specific time range.

#### The application uses:

Python for decrypting the incoming patient data and converting it into JSON format.
TypeScript for backend services and logic.
React for frontend visualization and dynamic plotting.

## Features
- Dynamic Signal Visualization: Displays real-time patient data in a dynamic graphical format that replicates the behavior of the bedside monitor.
- Trend View: Visualize historical patient data trends over a specified time period.
- Data Decryption Securely process and decrypt patient data using Python and convert it to JSON format for ease of use.

## Dependencies
- Node.js: Ensure that you have Node.js installed to work with this project.
## Installation Instructions
1. Clone the repository:
   ```bash
   git clone "https://github.com/tehreemAsif63/DigitalTwins"
2. Navigate to the project directory:
   ```bash
   cd DigitalTwins
3. Install the required dependencies:
   ```bash
   npm install
4. Run the application:
   - Development mode:
      ```bash
      npm run dev
   - Production mode:
      ```bash
      npm start
##### Note: For specific instructions regarding the server and client, please refer to their respective ReadMes.

## Data flow
1. Data Decryption: Incoming patient monitor data is decrypted and processed into JSON format using the Python service.
2. Backend API: The server exposes RESTful endpoints to:
   - Receive patient data.
   - Retrieve real-time and trend patient signal data.
3. Frontend (React): Consumes the APIs to display:
   - Real-time signals: Dynamically plotted on charts.
   - Trend view: Historical data visualization.

## Architecture Picture

## Collaborators
- Developer 1: Omid Khodaparast
- Developer 2: Marko Mojsov
- Developer 3: Yingchao Ji
- Developer 4: Shiyao Xin
- Developer 5: Tehreem Asif

## Further Development
- Reducing latency for real-time signal visualization.
- Adding alert/notification systems for abnormal patient data.

## Confidentiality
The file `binary_extraction.py` contains proprietary logic and is **not included** as part of this open-source project.

## Credits
This project was developed and maintained by Codiologist.

## License
- License: [License Type]

## Ongoing Updates
This ReadMe will be maintained as a living document, with updates and new information added as the project evolves. 

