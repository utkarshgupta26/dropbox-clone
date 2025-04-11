import axios from 'axios';
import { config } from '../config';

const BASE_URL = `${config.API_BASE_URL}/api/files`;

export const fetchFiles = () => axios.get(BASE_URL);

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${config.API_BASE_URL}/api/files/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
