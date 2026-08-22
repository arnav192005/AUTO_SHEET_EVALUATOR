const BASE_URL = '/api/v1';

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(errText || `API GET request failed: ${response.statusText}`);
    }
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(errText || `API POST request failed: ${response.statusText}`);
    }
    return response.json();
  },

  async upload(endpoint, formData) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData, // fetch automatically sets Content-Type to multipart/form-data with boundaries
    });
    if (!response.ok) {
      let errDetail = response.statusText;
      try {
        const json = await response.json();
        if (json.detail) errDetail = json.detail;
      } catch (e) {
        const text = await response.text().catch(() => '');
        if (text) errDetail = text;
      }
      throw new Error(errDetail);
    }
    return response.json();
  }
};

export const AppApi = {
  getTeachers: () => apiClient.get('/teachers'),
  getPreviewExam: () => apiClient.get('/schema-preview/exam'),
  getPreviewEvaluation: () => apiClient.get('/schema-preview/evaluation'),
  getPreviewProcessingJob: () => apiClient.get('/schema-preview/processing-job'),
  
  getDashboardStats: () => apiClient.get('/exams/stats').catch(() => null),
  getRecentBatches: () => apiClient.get('/exams/recent').catch(() => []),
  uploadAnswerSheets: (formData) => apiClient.upload('/sheets/upload', formData),
  getSheetReview: (sheetId) => apiClient.get(`/sheets/${sheetId}/review`),
  approveScore: (sheetId, score, teacherId) => apiClient.post(`/sheets/${sheetId}/approve`, { score, teacher_id: teacherId }),
  flagIssue: (sheetId, reason) => apiClient.post(`/sheets/${sheetId}/flag`, { reason }),
  getExamQuestions: (examId = 1) => apiClient.get(`/exams/${examId}/questions`).catch(() => []),
  addExamQuestion: (examId, data) => apiClient.post(`/exams/${examId}/questions`, data),
  getMyResults: () => apiClient.get('/exams/results').catch(() => []),
  createExam: (data) => apiClient.post('/exams', data),
};
