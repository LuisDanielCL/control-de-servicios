import axios from "axios";

export default axios.create({
  baseURL: "https://control-de-servicios-backend.herokuapp.com/api",
  headers: {
    "Content-type": "application/json"
  }
});