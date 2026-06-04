import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends order metadata and review text to the FastAPI prediction endpoint.
 */
export const predictReturnAndTrust = async (formData) => {
  try {
    const response = await api.post('/predict', formData);
    return response.data;
  } catch (error) {
    console.error("API Predict call failed:", error);
    if (error.response && error.response.data) {
      // If error payload is custom formatted from FastAPI HTTPException
      const detail = error.response.data.detail;
      if (typeof detail === 'object') {
        throw new Error(detail.error || JSON.stringify(detail));
      }
      throw new Error(detail || "Prediction request rejected by backend.");
    }
    throw new Error(error.message || "Could not reach prediction service.");
  }
};

/**
 * Gets backend model status and verifies connection.
 */
export const fetchBackendHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error("API Health Check failed:", error);
    throw new Error("Backend server is offline or unreachable.");
  }
};

/**
 * Fetches required return risk model input feature order.
 */
export const fetchModelFeatures = async () => {
  try {
    const response = await api.get('/model-features');
    return response.data;
  } catch (error) {
    console.error("API Model Features fetch failed:", error);
    throw new Error("Could not retrieve model features.");
  }
};

/**
 * Fetches previous predictions history.
 */
export const fetchPredictionHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    console.error("API fetch history failed:", error);
    throw new Error("Could not retrieve prediction history.");
  }
};

/**
 * Fetches dashboard statistics summary.
 */
export const fetchDashboardSummary = async () => {
  try {
    const response = await api.get('/dashboard-summary');
    return response.data;
  } catch (error) {
    console.error("API fetch dashboard summary failed:", error);
    throw new Error("Could not retrieve dashboard summary metrics.");
  }
};
