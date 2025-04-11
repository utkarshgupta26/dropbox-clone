import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './fileUpload';
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

const FileList = ({ onFileUpload }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const fetchFiles = async () => {
        if (isVisible) {
            // If files are visible, just hide them
            setIsVisible(false);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/files`);
            if (Array.isArray(response.data)) {
                setFiles(response.data);
            } else {
                setFiles(Object.entries(response.data).map(([id, file]) => ({
                    ...file,
                    id: id
                })));
            }
            setIsVisible(true);
        } catch (err) {
            console.error("Failed to fetch files:", err);
            setError('Failed to fetch files. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/files/${fileId}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            setError('Failed to download file. Please try again.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <FileUpload onFileUpload={onFileUpload} />
                <button 
                    onClick={fetchFiles}
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        backgroundColor: '#007bff',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Loading...' : isVisible ? 'Hide Files' : 'Show Files'}
                </button>
            </div>
            
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            
            {isVisible && files.length > 0 && (
                <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #dee2e6'
                            }}>
                                <th style={{ 
                                    padding: '12px 15px', 
                                    textAlign: 'left',
                                    fontWeight: '600'
                                }}>File Name</th>
                                <th style={{ 
                                    padding: '12px 15px', 
                                    textAlign: 'left',
                                    fontWeight: '600'
                                }}>Size</th>
                                <th style={{ 
                                    padding: '12px 15px', 
                                    textAlign: 'center',
                                    fontWeight: '600'
                                }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map(file => (
                                <tr key={file.id} style={{
                                    borderBottom: '1px solid #dee2e6',
                                    ':hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }}>
                                    <td style={{ padding: '12px 15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>📄</span>
                                            {file.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        {Math.round(file.size / 1024)} KB
                                    </td>
                                    <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => handleDownload(file.id, file.name)}
                                            style={{ 
                                                ...buttonStyle,
                                                width: '100px',
                                                padding: '6px 12px',
                                                height: '32px'
                                            }}
                                        >
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FileList;
