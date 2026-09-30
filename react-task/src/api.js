import axios from "axios";



const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const getPatients = (page = 1) => api.get(`/patients/?page=${page}`);

export const createPatient = (data) => api.post("/patients/", data);

export const updatePatient = (id, data) => api.patch(`/patients/${id}/`, data);

export const deletePatient = (id) => api.delete(`/patients/${id}/`);