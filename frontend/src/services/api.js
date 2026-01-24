import axios from "axios";

const API_URL = "https://placement-tracker-backend-yt8n.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Try to refresh the token
                const response = await axios.post(
                    `${API_URL}/auth/token/refresh/`,
                    {
                        refresh: refreshToken,
                    },
                );

                const { access } = response.data;
                localStorage.setItem("access_token", access);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (err) {
                // Refresh failed, redirect to login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    },
);

// Students API
export const getStudents = () => api.get("/students/");
export const getStudent = (id) => api.get(`/students/${id}/`);
export const createStudent = (data) => api.post("/students/", data);
export const updateStudent = (id, data) => api.put(`/students/${id}/`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}/`);
export const getPlacedStudents = () => api.get("/students/placed_students/");
export const getUnplacedStudents = () =>
    api.get("/students/unplaced_students/");
export const getStudentPlacementHistory = (id) =>
    api.get(`/students/${id}/placement_history/`);
export const uploadStudentsCSV = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/students/upload_csv/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Companies API
export const getCompanies = () => api.get("/companies/");
export const getCompany = (id) => api.get(`/companies/${id}/`);
export const createCompany = (data) => api.post("/companies/", data);
export const updateCompany = (id, data) => api.put(`/companies/${id}/`, data);
export const deleteCompany = (id) => api.delete(`/companies/${id}/`);
export const getActiveCompanies = () => api.get("/companies/active_companies/");
export const getCompanyApplicants = (id) =>
    api.get(`/companies/${id}/applicants/`);

// Placement Stages API
export const getStages = () => api.get("/stages/");
export const getStage = (id) => api.get(`/stages/${id}/`);
export const createStage = (data) => api.post("/stages/", data);
export const updateStage = (id, data) => api.put(`/stages/${id}/`, data);
export const deleteStage = (id) => api.delete(`/stages/${id}/`);

// Placement Progress API
export const getPlacementProgress = () => api.get("/placement-progress/");
export const getPlacementProgressById = (id) =>
    api.get(`/placement-progress/${id}/`);
export const createPlacementProgress = (data) =>
    api.post("/placement-progress/", data);
export const updatePlacementProgress = (id, data) =>
    api.put(`/placement-progress/${id}/`, data);
export const deletePlacementProgress = (id) =>
    api.delete(`/placement-progress/${id}/`);
export const getPlacementStatistics = () =>
    api.get("/placement-progress/statistics/");
export const getRecentUpdates = () =>
    api.get("/placement-progress/recent_updates/");

// Stage Progress API
export const getStageProgress = () => api.get("/stage-progress/");
export const createStageProgress = (data) => api.post("/stage-progress/", data);
export const updateStageProgress = (id, data) =>
    api.put(`/stage-progress/${id}/`, data);

// Important Dates API
export const getImportantDates = () => api.get("/important-dates/");
export const getImportantDate = (id) => api.get(`/important-dates/${id}/`);
export const createImportantDate = (data) =>
    api.post("/important-dates/", data);
export const updateImportantDate = (id, data) =>
    api.put(`/important-dates/${id}/`, data);
export const deleteImportantDate = (id) =>
    api.delete(`/important-dates/${id}/`);
export const getUpcomingDates = () => api.get("/important-dates/upcoming/");

export default api;
