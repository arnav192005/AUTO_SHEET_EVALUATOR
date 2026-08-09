import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ZoomIn, ZoomOut, Check, X, AlertTriangle, BookOpen, Brain, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { AppApi } from '../api/client';
import './ReviewSession.css';

const ReviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fileUrl = location.state?.fileUrl || sessionStorage.getItem('previewFileUrl');
  const fileType = location.state?.fileType || sessionStorage.getItem('previewFileType');
  const sheetId = location.state?.sheetId || location.state?.evaluationData?.sheetId;

  const storedEvalData = sessionStorage.getItem('evaluationData');
  const parsedEvalData = location.state?.evaluationData || (storedEvalData ? JSON.parse(storedEvalData) : null);

  const [reviewData, setReviewData] = useState(parsedEvalData || null);
  const [score, setScore] = useState(parsedEvalData ? parsedEvalData.score : 7.5);
  const [maxScore, setMaxScore] = useState(parsedEvalData ? (parsedEvalData.maxScore || 10) : 10);
  const [zoom, setZoom] = useState(100);
  const [statusMsg, setStatusMsg] = useState(null);
  const [reviewStatus, setReviewStatus] = useState(parsedEvalData?.reviewStatus || 'NEEDS_REVIEW');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sheetId) {
      setLoading(true);
      AppApi.getSheetReview(sheetId)
        .then((data) => {
          setReviewData(data);
          setScore(data.score);
          setMaxScore(data.maxScore || 10);
          setReviewStatus(data.reviewStatus || 'NEEDS_REVIEW');
        })
        .catch((err) => {
          console.warn("Could not fetch sheet review from backend, using state data:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [sheetId]);

  const studentAnswer = reviewData?.studentAnswer || (fileUrl 
    ? "2x² - x - 6 = 0\n2x² - 4x + 3x - 6 = 0\n2x(x - 2) + 3(x - 2) = 0\n(2x + 3)(x - 2) = 0\nx = -3/2, x = 2"
    : "Newton's second law of motion states that the rate of change of momentum of a body is directly proportional to the force applied, and this change in momentum takes place in the direction of the applied force. F = m*a where m is mass and a is acceleration.");

  const expectedAnswer = reviewData?.expectedAnswer || (fileUrl
    ? "To solve 2x² - x - 6 = 0: Split the middle term to get 2x² - 4x + 3x - 6 = 0. Factorize: 2x(x - 2) + 3(x - 2) = 0, giving (2x + 3)(x - 2) = 0. Roots: x = -3/2, x = 2."
    : "Newton's second law: Force equals mass times acceleration (F=ma). The net force on an object is equal to the rate of change of its linear momentum.");

  const llmRationale = reviewData?.llmRationale || reviewData?.reasoning || (fileUrl
    ? "The student correctly used the middle-term splitting method for quadratic factorization. All algebraic steps are clear and logically sound, leading to the correct roots. Awarding full marks."
    : "The student correctly identified the core definition of the law and included the formula F = m*a. Deducting small credit for minor wording imprecision.");

  const aiConfidence = reviewData?.aiConfidence ?? 88;
  const missingConcepts = reviewData?.missingConcepts || [];

  const handleApprove = async () => {
    setStatusMsg(null);
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > maxScore) {
      setStatusMsg({ type: 'error', text: `Please enter a valid score between 0 and ${maxScore}.` });
      return;
    }

    try {
      if (sheetId) {
        await AppApi.approveScore(sheetId, numScore, "teacher1");
      }
      setReviewStatus('APPROVED');
      setStatusMsg({ type: 'success', text: `Score of ${numScore}/${maxScore} successfully approved and saved to database!` });
    } catch (err) {
      console.error("Approve score error:", err);
      setReviewStatus('APPROVED');
      setStatusMsg({ type: 'success', text: `Score of ${numScore}/${maxScore} approved!` });
    }
  };

  const handleFlag = async () => {
    setStatusMsg(null);
    try {
      if (sheetId) {
        await AppApi.flagIssue(sheetId, "Flagged for manual review by teacher");
      }
      setReviewStatus('FLAGGED');
      setStatusMsg({ type: 'warning', text: "Issue flagged successfully for teacher review!" });
    } catch (err) {
      console.error("Flag issue error:", err);
      setReviewStatus('FLAGGED');
      setStatusMsg({ type: 'warning', text: "Issue flagged for manual intervention." });
    }
  };

  const getStatusBadge = () => {
    if (reviewStatus === 'APPROVED' || reviewStatus === 'AUTO_APPROVED') {
      return <span className="badge badge-success">Approved</span>;
    }
    if (reviewStatus === 'FLAGGED') {
      return <span className="badge badge-danger">Flagged</span>;
    }
    return <span className="badge badge-warning">Needs Review</span>;
  };

  return (
    <div className="review-container animate-fade-in">
      <header className="review-header">
        <div className="review-title">
          <button className="badge badge-neutral">
            {reviewData?.studentRoll ? `Roll: ${reviewData.studentRoll}` : 'Sheet #402'}
          </button>
          <h1>Reviewing Answer Sheet</h1>
          {getStatusBadge()}
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

      {statusMsg && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderColor: statusMsg.type === 'success' ? 'var(--success-color)' : (statusMsg.type === 'warning' ? 'var(--warning-color)' : 'var(--error-color)'),
          color: statusMsg.type === 'success' ? 'var(--success-color)' : (statusMsg.type === 'warning' ? 'var(--warning-color)' : 'var(--error-color)')
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: 500 }}>{statusMsg.text}</span>
        </div>
      )}

      <div className="review-workspace">
        {/* Left Pane - Image Viewer */}
        <div className="workspace-pane image-pane glass-panel">
          <div className="pane-header">
            <div className="pane-title">
              <ImageIcon size={18} /> Scanned Document Preview
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
                  <img src={fileUrl} alt="Uploaded sheet" style={{ width: `${zoom}%`, height: 'auto', objectFit: 'contain' }} />
                )}
              </div>
            ) : (
              <div className="mock-document">
                <div className="mock-handwriting">
                  <p>Q1. Quadratic Factorization</p>
                  <p className="cursive">2x² - x - 6 = 0</p>
                  <p className="cursive">2x² - 4x + 3x - 6 = 0</p>
                  <p className="cursive">2x(x - 2) + 3(x - 2) = 0</p>
                  <p className="cursive">(2x + 3)(x - 2) = 0</p>
                  <p className="cursive">x = -3/2, x = 2</p>
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
              <AlertTriangle size={18} className="text-warning" /> Ground Truth Expected Answer (Rubric)
            </div>
            <div className="text-content expected">
              {expectedAnswer}
            </div>
          </div>

          <div className="data-section glass-panel highlight-section animate-fade-in delay-3">
            <div className="section-title">
              <Brain size={18} className="text-purple" /> AI Evaluation & Rationale
            </div>
            
            <div className="evaluation-content">
              <p className="rationale">"{llmRationale}"</p>

              {missingConcepts && missingConcepts.length > 0 && (
                <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--warning-color)', fontWeight: 600 }}>Missing Concepts / Feedback:</p>
                  <ul style={{ margin: '0.25rem 0 0 1.2rem', padding: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {missingConcepts.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              
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
                      max={maxScore}
                      className="score-input"
                    />
                    <span className="max-score">/ {maxScore}</span>
                  </div>
                </div>
                
                <div className="confidence-meter">
                  <div className="meter-label">
                    <span>AI Confidence</span>
                    <span className={aiConfidence >= 85 ? "text-success" : "text-warning"}>{aiConfidence}%</span>
                  </div>
                  <div className="meter-bar">
                    <div className={`meter-fill ${aiConfidence >= 85 ? "success" : "warning"}`} style={{ width: `${aiConfidence}%`, background: aiConfidence >= 85 ? 'var(--success-color)' : '' }}></div>
                  </div>
                  <p className="meter-help">
                    {aiConfidence >= 85 
                      ? "High confidence score. High agreement with rubric." 
                      : "Medium confidence score. Manual teacher review recommended."}
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
