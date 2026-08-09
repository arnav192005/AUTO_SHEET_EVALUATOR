import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InfoLayout from '../../components/InfoLayout';
import { 
  FileText, 
  Code, 
  Terminal, 
  ShieldCheck, 
  Lock, 
  Key, 
  Server, 
  Layers, 
  Copy, 
  Check, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

const Documentation = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const curlExample = `curl -X POST "http://localhost:8000/api/v1/evaluate" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@answer_sheet.pdf" \\
  -F "answer_key={\\"q1\\": \\"Roots of quadratic equation are 2 and 3\\", \\"max_marks\\": 5}"`;

  const pythonExample = `import requests

url = "http://localhost:8000/api/v1/evaluate"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
files = {"file": open("student_sheet.jpg", "rb")}
data = {
    "rubric": '{"q1": "Derive step 1: x = [-b ± sqrt(b^2-4ac)] / 2a", "max_score": 5}'
}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`;

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/ocr/parse',
      desc: 'Ingest student answer sheet image/PDF and extract raw handwritten text with confidence scores.'
    },
    {
      method: 'POST',
      path: '/api/v1/evaluate',
      desc: 'Run multi-stage LLM evaluation against rubric, generating step credit & feedback notes.'
    },
    {
      method: 'GET',
      path: '/api/v1/results/{batch_id}',
      desc: 'Retrieve finalized class marksheets, teacher overrides, and question difficulty breakdown.'
    },
    {
      method: 'POST',
      path: '/api/v1/export/csv',
      desc: 'Export graded results directly into standardized CSV/Excel formats for SIS integration.'
    }
  ];

  return (
    <InfoLayout title="Documentation & API Reference">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Quick Nav Bar to Legal Docs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <BookOpen size={16} /> Legal & System Specs:
          </span>
          <Link to="/privacy" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy →</Link>
          <Link to="/terms" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Terms of Service →</Link>
          <Link to="/security" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Security & Compliance →</Link>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
          {['overview', 'api', 'sdks', 'rubrics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab ? '#000000' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {tab === 'sdks' ? 'SDKs & Samples' : tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
                System Architecture & Overview
              </h2>
              <p style={{ lineHeight: '1.7', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                ScribScore provides a RESTful API and web application to automate handwritten exam paper grading using a 4-stage processing pipeline:
              </p>
              <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <li><strong style={{ color: '#FFFFFF' }}>Ingestion:</strong> Multi-page PDF/JPEG answer booklets are uploaded and split into single-student pages.</li>
                <li><strong style={{ color: '#FFFFFF' }}>Multimodal Vision OCR:</strong> Scanned handwriting is transcribed into structured markdown and mathematical notation (LaTeX).</li>
                <li><strong style={{ color: '#FFFFFF' }}>Rubric Match Engine:</strong> Semantic AI compares student steps against master rubrics, awarding partial marks and highlighting errors.</li>
                <li><strong style={{ color: '#FFFFFF' }}>Teacher Review Queue:</strong> Flagged low-confidence answers are served to educators for 1-click verification.</li>
              </ol>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                <Server size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }} />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Base URL</h3>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-primary)' }}>http://localhost:8000/api/v1</code>
              </div>
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                <Key size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }} />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Authentication</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Bearer Token via HTTP Request Header</p>
              </div>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === 'api' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1.5rem', fontWeight: 700 }}>
              REST API Endpoints
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {endpoints.map((ep, idx) => (
                <div key={idx} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.6rem', 
                      borderRadius: '6px', 
                      background: ep.method === 'POST' ? 'rgba(39, 201, 63, 0.15)' : 'rgba(0, 242, 254, 0.15)',
                      color: ep.method === 'POST' ? '#27c93f' : '#00F2FE',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {ep.method}
                    </span>
                    <code style={{ fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontWeight: 600 }}>{ep.path}</code>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>{ep.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SDKs & Code Samples Tab */}
        {activeTab === 'sdks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Terminal size={18} /> cURL Command Sample
                </h3>
                <button 
                  onClick={() => copyToClipboard(curlExample, 1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                >
                  {copiedIndex === 1 ? <Check size={14} /> : <Copy size={14} />} {copiedIndex === 1 ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-glass)', overflowX: 'auto', color: '#a0aec0', fontSize: '0.9rem', fontFamily: 'var(--font-mono)', margin: 0 }}>
                <code>{curlExample}</code>
              </pre>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code size={18} /> Python SDK Request
                </h3>
                <button 
                  onClick={() => copyToClipboard(pythonExample, 2)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                >
                  {copiedIndex === 2 ? <Check size={14} /> : <Copy size={14} />} {copiedIndex === 2 ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-glass)', overflowX: 'auto', color: '#a0aec0', fontSize: '0.9rem', fontFamily: 'var(--font-mono)', margin: 0 }}>
                <code>{pythonExample}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Rubrics Tab */}
        {activeTab === 'rubrics' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              Master Rubric Definition Format
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Rubrics allow educators to define partial credit rules, required mathematical steps, and deduction penalties.
            </p>
            <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-glass)', overflowX: 'auto', color: '#a0aec0', fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>
              <code>{`{
  "exam_id": "MATH-101-MIDTERM",
  "questions": [
    {
      "q_num": 1,
      "max_marks": 5,
      "model_answer": "x = 2 and x = 3",
      "steps": [
        {"desc": "Identifies quadratic formula or factoring method", "points": 2},
        {"desc": "Correct simplification step", "points": 2},
        {"desc": "Final roots stated clearly", "points": 1}
      ]
    }
  ]
}`}</code>
            </pre>
          </div>
        )}

        {/* Bottom Banner to Legal Docs */}
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '2rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Need Compliance & Legal Specs?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>Read our FERPA compliance, SOC-2 details, and Data Processing terms.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/privacy" className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>Privacy Policy</Link>
            <Link to="/terms" className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>Terms of Service</Link>
            <Link to="/security" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>Security Docs</Link>
          </div>
        </div>

      </div>
    </InfoLayout>
  );
};

export default Documentation;
