//axios to make  HTTP requests from a web browser
import axios from "axios";
// console.log('API Endpoint:', import.meta.env.REACT_APP_API_ENDPOINT);

//creates instance of axios with a predefined base URL
const Api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_ENDPOINT || "http://localhost:5000/api/v1",
});

export default Api;