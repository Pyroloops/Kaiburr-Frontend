// src/api.ts

import axios, { AxiosResponse } from 'axios';

// 1. Task Interface
export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

// 2. Define the centralized axios client
const apiClient = axios.create({
    // This MUST match the URL where your backend is running
    baseURL: 'http://localhost:30080/tasks', 
    headers: { 'Content-Type': 'application/json' }
});

// 3. CRUD API Functions

/** READ: GET /tasks */
export const getTasks = async (): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get<Task[]>('/');
    return response.data;
};

/** CREATE: POST /tasks */
export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.post<Task>('/', task);
    return response.data;
};

/** UPDATE: PUT /tasks/{id} */
export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.put<Task>(`/${id}`, task);
    return response.data;
};

/** DELETE: DELETE /tasks/{id} */
export const deleteTask = async (id: number): Promise<void> => {
    await apiClient.delete<void>(`/${id}`);
};