import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, AlertCircle, Loader2 } from 'lucide-react';
import { AppApi } from '../api/client';
import './Upload.css'; // Reusing upload styles

const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];

const StudentUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [examId, setExamId] = useState('1');
  const [studentRoll, setStudentRoll] = useState('2024CS001');
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const validateFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage(null);
      return selectedFile;
    } else {
      setErrorMessage(`Unsupported file format. Only PDF, JPG, and PNG files are allowed.`);
      return null;
    }
  };

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
      const validFile = validateFile(e.dataTransfer.files[0]);
      if (validFile) setFile(validFile);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFile = validateFile(e.target.files[0]);
      if (validFile) setFile(validFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select your answer sheet file.");
      return;
    }
    if (!studentRoll.trim()) {
      setErrorMessage("Please enter your Student Roll Number.");
      return;
    }

    setUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('exam_id', examId);
    formData.append('student_roll', studentRoll);
    formData.append('files', file);

    try {
      await AppApi.uploadAnswerSheets(formData);
      setUploading(false);
      setFile(null);
      // Navigate to results page after successful submission
      navigate('/results');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setErrorMessage(error.message || "Failed to submit answer sheet. Please try again.");
    }
  };

  return (
    <div className="upload-container animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Submit Answer Sheet</h1>
          <p className="subtitle">Upload your scanned answer sheet to get your grade status.</p>
        </div>
      </header>

      {errorMessage && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', borderColor: 'var(--error-color)', color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submission Details */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0' }}>Submission Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Exam ID:</label>
            <input 
              type="number" 
              min="1"
              step="1"
              value={examId} 
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setExamId('');
                } else {
                  const num = parseInt(val, 10);
                  setExamId(isNaN(num) || num < 1 ? '1' : num.toString());
                }
              }}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your Roll Number:</label>
            <input 
              type="text" 
              value={studentRoll} 
              onChange={(e) => setStudentRoll(e.target.value)}
              placeholder="e.g. 2024CS001"
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
      </div>

      <div className="upload-content">
        {!file ? (
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
              <h3>Drag & Drop your answer sheet here</h3>
              <p className="text-muted">Accepted formats: PDF, JPG, PNG (1 file max)</p>
              
              <div className="divider"><span>OR</span></div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <input 
                  type="file" 
                  id="file-upload" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden-input" 
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="btn-secondary">
                  Browse File
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="file-list glass-panel animate-fade-in delay-1">
            <div className="file-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>Ready to Submit</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your sheet will be evaluated by the AI grading system.</span>
              </div>
              <button 
                className="btn-primary" 
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                ) : (
                  'Submit Answer Sheet'
                )}
              </button>
            </div>
            
            <div className="files-grid" style={{ marginTop: '1.5rem' }}>
              <div className="file-item animate-fade-in">
                <div className="file-info">
                  <div className="file-icon">
                    <File size={20} />
                  </div>
                  <div className="file-details">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button className="remove-btn" onClick={removeFile} disabled={uploading}>
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentUpload;
