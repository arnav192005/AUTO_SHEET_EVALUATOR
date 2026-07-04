const BASE_URL = '/api/v1';

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API GET request failed: ${response.statusText}`);
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
      throw new Error(`API POST request failed: ${response.statusText}`);
    }
    return response.json();
  },

  async upload(endpoint, formData) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData, // fetch automatically sets Content-Type to multipart/form-data with boundaries
    });
    if (!response.ok) {
      throw new Error(`API Upload request failed: ${response.statusText}`);
    }
    return response.json();
  }
};

export const AppApi = {
  // Current functional endpoints (using schema-preview routes for dev)
  getTeachers: () => apiClient.get('/teachers'),
  getPreviewExam: () => apiClient.get('/schema-preview/exam'),
  getPreviewEvaluation: () => apiClient.get('/schema-preview/evaluation'),
  getPreviewProcessingJob: () => apiClient.get('/schema-preview/processing-job'),
  
  // Placeholders for future real routes
  getDashboardStats: () => apiClient.get('/exams/stats').catch(() => null),
  getRecentBatches: () => apiClient.get('/exams/recent').catch(() => null),
  uploadAnswerSheets: (formData) => apiClient.upload('/sheets/upload').catch(() => null),
};
