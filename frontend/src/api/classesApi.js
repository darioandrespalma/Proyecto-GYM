import apiClient from './apiClient';

// --- API para Administradores ---
export const getClasses = async () => {
    try {
        const response = await apiClient.get('/api/v1/admin/classes/');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin classes:', error);
        throw error;
    }
};

export const createClass = async (classData) => {
    try {
        const response = await apiClient.post('/api/v1/admin/classes/', classData);
        return response.data;
    } catch (error) {
        console.error('Error creating class:', error);
        throw error;
    }
};

// --- API para Miembros ---
export const getAvailableClasses = async () => {
    try {
        const response = await apiClient.get('/api/v1/member/available-classes');
        return response.data;
    } catch (error) {
        console.error('Error fetching available classes:', error);
        throw error;
    }
};

export const bookClass = async (classId) => {
    try {
        const response = await apiClient.post(`/api/v1/member/schedule/book/${classId}`);
        return response.data;
    } catch (error) {
        console.error('Error booking class:', error);
        throw error;
    }
};

export const cancelBooking = async (classId) => {
    try {
        const response = await apiClient.delete(`/api/v1/member/schedule/cancel/${classId}`);
        return response.data;
    } catch (error) {
        console.error('Error canceling booking:', error);
        throw error;
    }
};

// --- API para Entrenadores ---
export const getTrainerClasses = async () => {
    try {
        const response = await apiClient.get('/api/v1/trainer/my-classes');
        return response.data;
    } catch (error) {
        console.error('Error fetching trainer classes:', error);
        return [];
    }
};

export const getClassMembers = async (classId) => {
    try {
        const response = await apiClient.get(`/api/v1/trainer/class/${classId}/members`);
        return response.data;
    } catch (error) {
        console.error('Error fetching class members:', error);
        throw error;
    }
};

export const getTrainerDashboard = async () => {
    try {
        const response = await apiClient.get('/api/v1/trainer/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching trainer dashboard:', error);
        return null;
    }
};



// --- API para Tomar Asistencia ---
export const takeAttendance = async (classId, memberIds) => {
    try {
        const response = await apiClient.post(`/api/v1/trainer/class/${classId}/attendance`, {
            member_ids: memberIds
        });
        return response.data;
    } catch (error) {
        console.error('Error taking attendance:', error);
        throw error;
    }
};