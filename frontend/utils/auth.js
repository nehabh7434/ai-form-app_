// Base URL of backend
const BASE_API_URL = "http://localhost:4000";

// Save token to localStorage & set axios default header
export function setAuthToken(token) {
    if (token) {
        localStorage.setItem("userToken", token);
    } else {
        localStorage.removeItem("userToken");
    }
}

export default BASE_API_URL;
