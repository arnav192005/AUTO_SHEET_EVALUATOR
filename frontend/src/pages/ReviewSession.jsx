import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ZoomIn, ZoomOut, Check, X, AlertTriangle, BookOpen, Brain, Image as ImageIcon } from 'lucide-react';
import './ReviewSession.css';

const ReviewSession = () => {
  const [score, setScore] = useState(7.5);
  const [zoom, setZoom] = useState(100);
  const navigate = useNavigate();
  const maxScore = 10;
  
  const studentAnswer = "Newton's second law of motion states that the rate of change of momentum of a body is directly proportional to the force applied, and this change in momentum takes place in the direction of the applied force. F = m*a where m is mass and a is acceleration.";
  const expectedAnswer = "Newton's second law: Force equals mass times acceleration (F=ma). The net force on an object is equal to the rate of change of its linear momentum.";
  const llmRationale = "The student correctly identified the core definition of the law and included the formula F = m*a. However, they slightly hallucinated 'rate of change of momentum is directly proportional' instead of 'equal to' in some contexts, but it is generally accepted in classical definitions. Deducting a small amount for lack of clarity on 'net force'.";

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
          </div>
        </div>

        {/* Right Pane - AI Evaluation */}
        <div className="workspace-pane data-pane">
          <div className="data-section glass-panel animate-fade-in delay-1">
            <div className="section-title">
              <BookOpen size={18} className="text-accent" /> Extracted Text (OCR)
            </div>
            <div className="text-content">
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
                    <span className="text-warning">72%</span>
                  </div>
                  <div className="meter-bar">
                    <div className="meter-fill warning" style={{ width: '72%' }}></div>
                  </div>
                  <p className="meter-help">Confidence is below 85% threshold. Manual review required.</p>
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
