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
- Data Decryption: Securely process and decrypt patient data using Python and convert it to JSON format for ease of use.

## Dependencies
- Node.js: Ensure that you have Node.js installed to work with this project.
## Installation Instructions
### General Steps:
1. Clone the repository:
   ```bash
   git clone "https://github.com/Codiologoist/DigitalTwins.git"
2. Navigate to the project directory:
   ```bash
   cd DigitalTwins
3. Install the required dependencies:
   - Install dependencies for the client:
     ```bash
     cd client
     npm install
     ```
   - Install dependencies for the server:
     1. Navigate to the `server/decryption` directory:
        ```bash
        cd ../server/decryption
     2. Install Python (if not installed):
        If Python is not installed, download and install it from the [Python official website](https://www.python.org/downloads/).
     3. Install Python dependencies - You can either install dependencies directly on your local machine or use a virtual environment. Choose one of the two options below:
        - Option 1: Install on Local Machine:
          ```bash
          pip install -r requirements.txt
        - Option 2: Use a virtual environment 
          - Create a Python virtual environment:
            ```bash
            python3 -m venv venv
          - Activate the virtual environment:
            - On macOS/Linux:
              ```bash
              source venv/bin/activate
            - On Windows:
              ```bash
              venv\Scripts\activate
          - Install dependencies within the virtual environment:
            ```bash
            pip install -r requirements.txt
     4. Install the Node.js dependencies:
        ```bash
        npm install
4. Run the application:
   - Development mode - open two terminal windows (or tabs):
        - Terminal 1: Run the client
          ```bash
          cd client
          npm run dev
          ```
        - Terminal 2: Run the server
          - Navigate to the `server` directory:
            ```bash
            cd server
          - If you are not using a virtual environment (local machine setup) - Simply run:
            ```bash
            npm run dev
          - If you are using a virtual environment:
            - Activate the Python virtual environment:
              - On macOS/Linux:
                ```bash
                source venv/bin/activate
              - On Windows:
                ```bash
                venv\Scripts\activate
            - Then, start the server
              ```bash
              npm run dev
            - (Optional) Exit the virtual environment: After stopping the server, deactivate the virtual environment by running:
              ```bash
              deactivate
   - Production mode:
      ```bash
      npm start
5. Run tests (Server only):
   - Before running tests, make sure you have set your `.env` file correctly according to the instructions in the `.env.example` file.
   - To run tests on the server, use the following command:
     ```bash
     npm run test
     ```
     This command runs the server tests using a local MongoDB test database (`serverTestDB`) and the `newman-server` test suite. Ensure that your local MongoDB instance is running before executing the test.

## Data flow
1. Data Decryption: Incoming patient monitor data is decrypted and processed into JSON format using the Python service.
2. Backend API: The server exposes RESTful endpoints to:
   - Receive patient data.
   - Retrieve real-time and trend patient signal data.
3. Frontend (React): Consumes the APIs to display:
   - Real-time signals: Dynamically plotted on charts.
   - Trend view: Historical data visualization.

## Backend
The backend of this application is built using Node.js with TypeScript and integrates Python for data decryption.

### Backend Features:
Data Decryption: Python decrypts incoming patient monitor data and converts it into JSON files. These JSON files represent patient data types (e.g., ABP, HR, ECG, etc.) and are sent to the frontend upon request.
API Endpoints: Provides RESTful endpoints for:
Sending real-time patient data to the frontend.
Handling requests for historical trend data.

### Available Scripts

In the project directory, you can run:

#### `npm install`

Installs all the dependencies specified in the package.json file.

It ensures that the project has all the required packages to run correctly.

Run this command whenever you clone the project or update dependencies.

#### `npm run dev`

To start the server with Node.js:
You can access the following URL in your browser:
https://localhost:5000/api/v1

If configured correctly, you should see a JSON response in your browser that looks like this:
{
  "message": "Hello from Digital Twins server!"
}

## Frontend
This project uses React + TypeScript + Vite for the frontend, providing a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
## Collaborators
- Omid Khodaparast
- Marko Mojsov
- Yingchao Ji
- Shiyao Xin
- Tehreem Asif

## Further Development
- Reducing latency for real-time signal visualization.
- Adding alert/notification systems for abnormal patient data.

## Confidentiality
The file `binary_extraction.py` contains proprietary logic and is **not included** as part of this open-source project.

## Credits
This project was developed and maintained by Codiologist.

## License
- License: MIT License

## Ongoing Updates
This ReadMe will be maintained as a living document, with updates and new information added as the project evolves. 

