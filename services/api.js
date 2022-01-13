import axios from 'axios';
const https = require('https');
const httpsAgent = new https.Agent({ 
    rejectUnauthorized: false
})

export const apiClientDemo = axios.create({
    baseURL: 'http://localhost:3004'
});

export const backendJona = axios.create({
    baseURL: 'http://intralixservices.southcentralus.cloudapp.azure.com:8087/api',
    httpsAgent:httpsAgent,
    withCredentials: true,
});

export const zoanasURL = axios.create({
    baseURL: 'http://intralixservices.southcentralus.cloudapp.azure.com:8005/api',
    withCredentials: true,
});
export const rulesURL = axios.create({
    baseURL: 'http://intralixservices.southcentralus.cloudapp.azure.com:8006/api',
    withCredentials: true,
});
export default backendJona;

