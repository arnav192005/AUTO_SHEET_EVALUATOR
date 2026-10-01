const BASE_URL = '/api/v1';

// ── Auth storage ─────────────────────────────────────────────────────────────
// The token is signed by the backend; the role stored here is only used for
// showing the right UI. The server re-checks the role on every request.

export const getAuth = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    if (!auth || !auth.token || !auth.expires || Date.now() > auth.expires) return null;
    return auth;
  } catch {
    return null;
  }
};

export const setAuth = (auth) => localStorage.setItem('auth', JSON.stringify(auth));

export const clearAuth = () => localStorage.removeItem('auth');

const authHeaders = () => {
  const auth = getAuth();
  return auth ? { Authorization: `Bearer ${auth.token}` } : {};
};

/** URL for <img>/<iframe> sources, which can't send an Authorization header. */
export const authFileUrl = (url) => {
  if (!url) return '';
  const auth = getAuth();
  if (!auth) return url;
  return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(auth.token)}`;
};

// ── Errors ───────────────────────────────────────────────────────────────────

const formatDetail = (detail) => {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    // FastAPI validation errors: [{loc: ['body', 'field'], msg: '...'}]
    return detail
      .map((d) => {
        const field = Array.isArray(d.loc) ? d.loc.filter((p) => p !== 'body').join('.') : '';
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join('; ');
  }
  return JSON.stringify(detail);
};

const handleError = async (response, fallback) => {
  if (response.status === 401) {
    clearAuth();
    if (!window.location.hash.startsWith('#/login')) window.location.hash = '#/login';
  }
  let message = fallback;
  try {
    const text = await response.text();
    try {
      message = formatDetail(JSON.parse(text).detail) || message;
    } catch {
      if (text) message = text;
    }
  } catch {
    /* body unreadable, keep fallback */
  }
  const error = new Error(message);
  error.status = response.status;
  throw error;
};

const request = async (method, endpoint, { json, body } = {}) => {
  const headers = { ...authHeaders() };
  if (json !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
  });
  if (!response.ok) await handleError(response, `${method} request failed: ${response.statusText}`);
  return response;
};

export const apiClient = {
  get: async (endpoint) => (await request('GET', endpoint)).json(),
  delete: async (endpoint) => (await request('DELETE', endpoint)).json(),
  post: async (endpoint, data) => (await request('POST', endpoint, { json: data })).json(),
  upload: async (endpoint, formData) => (await request('POST', endpoint, { body: formData })).json(),
  blob: async (endpoint) => (await request('GET', endpoint)).blob(),
};

export const AppApi = {
  // Auth
  login: (email, password, role) => apiClient.post('/auth/login', { email, password, role }),
  register: (data) => apiClient.post('/auth/register', data),
  health: () => fetch(`${BASE_URL}/health`).then((r) => r.ok).catch(() => false),

  getTeachers: () => apiClient.get('/teachers'),

  getDashboardStats: () => apiClient.get('/exams/stats').catch(() => null),
  getRecentBatches: () => apiClient.get('/exams/recent').catch(() => []),
  getExams: () => apiClient.get('/exams').catch(() => []),
  uploadAnswerSheets: (formData) => apiClient.upload('/sheets/upload', formData),
  getSheetReview: (sheetId) => apiClient.get(`/sheets/${sheetId}/review`),
  approveScore: (sheetId, score, questionNumber) =>
    apiClient.post(`/sheets/${sheetId}/approve`, { score, question_number: questionNumber }),
  flagIssue: (sheetId, reason, questionNumber) =>
    apiClient.post(`/sheets/${sheetId}/flag`, { reason, question_number: questionNumber }),

  getExamQuestions: (examId) => apiClient.get(`/exams/${examId}/questions`).catch(() => []),
  addExamQuestion: (examId, data) => apiClient.post(`/exams/${examId}/questions`, data),
  getMyResults: () => apiClient.get('/exams/results').catch(() => []),
  createExam: (data) => apiClient.post('/exams', data),
  uploadReferenceDocument: (examId, formData) => apiClient.upload(`/exams/${examId}/reference`, formData),
  syncToLms: (examId, provider, courseId) =>
    apiClient.post(`/exams/${examId}/lms-sync`, { provider, course_id: courseId }),
  // questionNumber omitted => every question on the sheet
  requestReevaluation: (sheetId, reason, questionNumber) =>
    apiClient.post(`/sheets/${sheetId}/reevaluate`, { reason, question_number: questionNumber ?? null }),
  getReevaluations: () => apiClient.get('/sheets/reevaluations').catch(() => []),
  dismissReevaluation: (evalId) => apiClient.delete(`/sheets/reevaluations/${evalId}`),
  exportExamResults: (examId) => apiClient.blob(`/exams/${examId}/export`),
  getGradedSheets: (status = 'ALL') => apiClient.get(`/sheets/list?status=${encodeURIComponent(status)}`).catch(() => []),
  getScoreAnalytics: () => apiClient.get('/exams/analytics').catch(() => null),
  clearAllData: () => apiClient.delete('/exams/data/clear'),
};
