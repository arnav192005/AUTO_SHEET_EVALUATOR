import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import { AppApi } from '../api/client';
import './Upload.css';

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = async () => {
    setUploading(true);
    
    // Simulate real API call (will just catch error or return null currently)
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    try {
      const response = await AppApi.uploadAnswerSheets(formData);
      
      const uploadedFileUrl = files.length > 0 ? URL.createObjectURL(files[0]) : null;
      const uploadedFileType = files.length > 0 ? files[0].type : null;
      
      if (uploadedFileUrl) {
        sessionStorage.setItem('previewFileUrl', uploadedFileUrl);
        sessionStorage.setItem('previewFileType', uploadedFileType);
      }

      if (response && response.results && response.results.length > 0) {
        sessionStorage.setItem('evaluationData', JSON.stringify(response.results[0]));
      }
      
      setUploading(false);
      setFiles([]);
      alert("Batch uploaded successfully and sent for AI Evaluation!");
      navigate('/review', { state: { fileUrl: uploadedFileUrl, fileType: uploadedFileType } });
    } catch (error) {
      console.error('Upload failed', error);
      setUploading(false);
    }
  };

  return (
    <div className="upload-container animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Upload Answer Sheets</h1>
          <p className="subtitle">Upload scanned PDFs or images for AI evaluation.</p>
        </div>
      </header>

      <div className="upload-content">
        <div 
          className={`dropzone glass-panel ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="dropzone-content">
            <div className="upload-icon-wrapper">
              <UploadCloud size={48} className="upload-icon" />
            </div>
            <h3>Drag & Drop your files or folders here</h3>
            <p className="text-muted">Supports single files or bulk folder uploads (PDF, JPG, PNG)</p>
            
            <div className="divider"><span>OR</span></div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <input 
                type="file" 
                id="file-upload" 
                multiple 
                className="hidden-input" 
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload" className="btn-secondary">
                Browse Files
              </label>

              <input 
                type="file" 
                id="folder-upload" 
                webkitdirectory="true"
                directory="true"
                className="hidden-input" 
                onChange={handleFileSelect}
              />
              <label htmlFor="folder-upload" className="btn-secondary">
                Browse Folder (Bulk)
              </label>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="file-list glass-panel animate-fade-in delay-1">
            <div className="file-list-header">
              <h3>Ready to Upload ({files.length})</h3>
              <button 
                className="btn-primary" 
                onClick={simulateUpload}
                disabled={uploading}
              >
                {uploading ? 'Processing...' : 'Start Evaluation'}
              </button>
            </div>
            
            <div className="files-grid">
              {files.map((file, idx) => (
                <div key={idx} className="file-item animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="file-info">
                    <div className="file-icon">
                      <File size={20} />
                    </div>
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFile(idx)}>
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
