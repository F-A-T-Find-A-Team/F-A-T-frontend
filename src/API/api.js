import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.1.50',
    timeout: 5000,
    withCredentials: true,
})