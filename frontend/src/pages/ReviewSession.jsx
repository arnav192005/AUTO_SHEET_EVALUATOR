import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ZoomIn, ZoomOut, Check, X, AlertTriangle, BookOpen, Brain, Image as ImageIcon } from 'lucide-react';
import './ReviewSession.css';

const ReviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileUrl = location.state?.fileUrl || sessionStorage.getItem('previewFileUrl');
  const fileType = location.state?.fileType || sessionStorage.getItem('previewFileType');
  const maxScore = 10;
  
  const isFileUpload = !!fileUrl;

  const storedEvalData = sessionStorage.getItem('evaluationData');
  const parsedEvalData = storedEvalData ? JSON.parse(storedEvalData) : null;

  const [score, setScore] = useState(parsedEvalData ? parsedEvalData.score : (isFileUpload ? 10 : 7.5));
  const [zoom, setZoom] = useState(100);

  const studentAnswer = parsedEvalData ? parsedEvalData.studentAnswer : (isFileUpload 
    ? "2x² - x - 6 = 0\n2x² - 4x + 3x - 6 = 0\n2x(x - 2) + 3(x - 2) = 0\n(2x + 3)(x - 2) = 0\nx = -3/2, x = 2"
    : "Newton's second law of motion states that the rate of change of momentum of a body is directly proportional to the force applied, and this change in momentum takes place in the direction of the applied force. F = m*a where m is mass and a is acceleration.");
  
  const expectedAnswer = parsedEvalData ? parsedEvalData.expectedAnswer : (isFileUpload
    ? "To solve 2x² - x - 6 = 0: Split the middle term to get 2x² - 4x + 3x - 6 = 0. Factorize: 2x(x - 2) + 3(x - 2) = 0, giving (2x + 3)(x - 2) = 0. Roots: x = -3/2, x = 2."
    : "Newton's second law: Force equals mass times acceleration (F=ma). The net force on an object is equal to the rate of change of its linear momentum.");
  
  const llmRationale = parsedEvalData ? parsedEvalData.llmRationale : (isFileUpload
    ? "The student correctly used the middle-term splitting method for quadratic factorization. All algebraic steps are clear and logically sound, leading to the correct roots. Awarding full marks."
    : "The student correctly identified the core definition of the law and included the formula F = m*a. However, they slightly hallucinated 'rate of change of momentum is directly proportional' instead of 'equal to' in some contexts. Deducting a small amount for lack of clarity on 'net force'.");
    
  const aiConfidence = parsedEvalData ? parsedEvalData.aiConfidence : (isFileUpload ? 98 : 72);

  const handleApprove = () => {
    alert("Score approved and saved!");
    navigate('/dashboard');
  };

  const handleFlag = () => {
    alert("Issue flagged for manual intervention.");
    navigate('/dashboard');
  };

  return (
    <div className="review-container animate-fade-in">
      <header className="review-header">
        <div className="review-title">
          <button className="badge badge-neutral">Batch: BCH-090</button>
          <h1>Reviewing Sheet #402</h1>
          <span className="badge badge-warning">Needs Review</span>
        </div>
        <div className="review-actions">
          <button className="btn-secondary text-danger" onClick={handleFlag}>
            <X size={18} /> Flag Issue
          </button>
          <button className="btn-primary" onClick={handleApprove}>
            <Check size={18} /> Approve Score
          </button>
        </div>
      </header>

      <div className="review-workspace">
        {/* Left Pane - Image Viewer */}
        <div className="workspace-pane image-pane glass-panel">
          <div className="pane-header">
            <div className="pane-title">
              <ImageIcon size={18} /> Scanned Document
            </div>
            <div className="image-controls">
              <button className="icon-btn" onClick={() => setZoom(Math.max(50, zoom - 10))}><ZoomOut size={16} /></button>
              <span className="zoom-level">{zoom}%</span>
              <button className="icon-btn" onClick={() => setZoom(Math.min(200, zoom + 10))}><ZoomIn size={16} /></button>
            </div>
          </div>
          
          <div className="image-viewer">
            {fileUrl ? (
              <div className="mock-document" style={{ padding: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                {fileType === 'application/pdf' ? (
                  <embed src={fileUrl} type="application/pdf" style={{ width: '100%', height: '100%' }} />
                ) : (
                  <img src={fileUrl} alt="Uploaded sheet" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
              </div>
            ) : (
              <div className="mock-document">
                <div className="mock-handwriting">
                  <p>Q3. Explain Newton's Second Law.</p>
                  <p className="cursive">Newton's second law of motion states that the</p>
                  <p className="cursive">rate of change of momentum of a body is</p>
                  <p className="cursive">directly proportional to the force applied,</p>
                  <p className="cursive">and this change takes place in the direction</p>
                  <p className="cursive">of the applied force. F = m * a where</p>
                  <p className="cursive">m is mass and a is acceleration.</p>
                </div>
                <div className="bounding-box pulse-box"></div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - AI Evaluation */}
        <div className="workspace-pane data-pane">
          <div className="data-section glass-panel animate-fade-in delay-1">
            <div className="section-title">
              <BookOpen size={18} className="text-accent" /> Extracted Text (OCR)
            </div>
            <div className="text-content" style={{ whiteSpace: 'pre-line' }}>
              {studentAnswer}
            </div>
          </div>

          <div className="data-section glass-panel animate-fade-in delay-2">
            <div className="section-title">
              <AlertTriangle size={18} className="text-warning" /> Expected Answer (RAG Context)
            </div>
            <div className="text-content expected">
              {expectedAnswer}
            </div>
          </div>

          <div className="data-section glass-panel highlight-section animate-fade-in delay-3">
            <div className="section-title">
              <Brain size={18} className="text-purple" /> AI Evaluation
            </div>
            
            <div className="evaluation-content">
              <p className="rationale">"{llmRationale}"</p>
              
              <div className="scoring-widget">
                <div className="score-control">
                  <label>Adjust Score (Out of {maxScore})</label>
                  <div className="score-input-group">
                    <input 
                      type="number" 
                      value={score} 
                      onChange={(e) => setScore(e.target.value)}
                      step="0.5"
                      min="0"
                      max="10"
                      className="score-input"
                    />
                    <span className="max-score">/ {maxScore}</span>
                  </div>
                </div>
                
                <div className="confidence-meter">
                  <div className="meter-label">
                    <span>AI Confidence</span>
                    <span className={aiConfidence > 85 ? "text-success" : "text-warning"}>{aiConfidence}%</span>
                  </div>
                  <div className="meter-bar">
                    <div className={`meter-fill ${aiConfidence > 85 ? "success" : "warning"}`} style={{ width: `${aiConfidence}%`, background: aiConfidence > 85 ? 'var(--success-color)' : '' }}></div>
                  </div>
                  <p className="meter-help">
                    {aiConfidence > 85 
                      ? "High confidence. Auto-approval recommended." 
                      : "Confidence is below 85% threshold. Manual review required."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSession;
