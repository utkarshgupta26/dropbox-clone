import './App.css';
import React from 'react';
import FileList from './components/fileList';

function App() {
    const handleFileUpload = (newFile) => {
        console.log('File uploaded:', newFile);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>📁 My Dropbox Clone</h1>
            <FileList onFileUpload={handleFileUpload} />
        </div>
    );
}

export default App;
