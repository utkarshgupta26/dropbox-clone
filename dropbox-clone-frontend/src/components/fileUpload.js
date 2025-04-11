import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../config';

const buttonStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    width: '120px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'center',
    lineHeight: '1.5',
    height: '40px',
    boxSizing: 'border-box'
};

const FileUpload = ({ onFileUpload }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const allowedTypes = ['text/plain', 'image/jpeg', 'image/png', 'application/json'];
    const allowedExtensions = ['.txt', '.jpg', '.jpeg', '.png', '.json'];

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
            setError('Invalid file type. Allowed types: TXT, JPG, PNG, JSON');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${config.API_BASE_URL}/api/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (onFileUpload) {
                onFileUpload(response.data);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ display: 'inline-block' }}>
            <label 
                htmlFor="file-upload" 
                style={{
                    ...buttonStyle,
                    backgroundColor: '#28a745',
                    opacity: uploading ? 0.7 : 1,
                    pointerEvents: uploading ? 'none' : 'auto'
                }}
            >
                {uploading ? 'Uploading...' : 'Upload File'}
            </label>
            <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.jpg,.jpeg,.png,.json"
                style={{ display: 'none' }}
                disabled={uploading}
            />
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
};

export default FileUpload;
