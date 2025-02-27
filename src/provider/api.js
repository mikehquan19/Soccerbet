import axios from 'axios'

export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";

// the instance of the axios used for this app
export const soccerappClient = axios.create({baseURL: "http://127.0.0.1:8000/soccerapp/"})
export const freeClient = axios.create({baseURL: "http://127.0.0.1:8000/soccerapp/"})

// interceptor to automatically add bearer token if there is any 
// before the request is sent 
soccerappClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN); 
        if (token) {config.headers.Authorization = `Bearer ${token}`}
        return config; 
    }, 
    // if there is no tokens, throw an error
    (error) => {return Promise.reject(error);}
);