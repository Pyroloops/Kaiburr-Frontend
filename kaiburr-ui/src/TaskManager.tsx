// src/TaskManager.tsx

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Alert, Spin, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// Import the Task interface and API functions
import { 
    Task, 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask 
} from './api'; 

// Main Component
const TaskManager: React.FC = () => {
    // State Hooks
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Ant Design Form hook
    const [form] = Form.useForm();

    // --- Data Fetching ---
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
     
            await new Promise(resolve => setTimeout(resolve, 500)); 
            const placeholderData: Task[] = [
                { id: 1, title: 'task 1', description: 'backend', status: 'completed' },
                { id: 2, title: 'task 2', description: 'frontend', status: 'in-progress' },
                { id: 3, title: 'task 3', description: 'CI/CD', status: 'pending' }
            ];
            
            setTasks(placeholderData); 

        } catch (err) {
            const errorMessage = (err instanceof Error ? err.message : 'An unknown error occurred');
            setError(`Mock data failed to load. Error: ${errorMessage}`);
            message.error("Failed to display placeholder data.");
        } finally {
            setLoading(false);
        }
    };

    // --- Modal and Form Handlers ---
    const showModal = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            form.setFieldsValue(task);
        } else {
            setEditingTask(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingTask(null);
        form.resetFields();
    };

    // --- CRUD Operations (These will still fail until the backend is fixed) ---
    const handleSubmit = async (values: Omit<Task, 'id'>) => {

        message.warning("Backend API is currently mocked/unavailable for CRUD operations.");
        setSubmitting(true);
        try {
            let resultTask: Task;
            if (editingTask) {

                resultTask = { ...editingTask, ...values };
                setTasks(tasks.map(t => t.id === editingTask.id ? resultTask : t));
                message.success(`Task ${resultTask.id} updated successfully (Mocked)`);
            } else {

                const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
                resultTask = { id: newId, ...values, status: values.status || 'pending' };
                setTasks([...tasks, resultTask]);
                message.success(`Task created successfully with ID ${resultTask.id} (Mocked)`);
            }
            handleCancel(); 
        } catch (err) {
            message.error('Operation failed (Mocked).');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this task?',
            okText: 'Yes, delete',
            okType: 'danger',
            onOk: async () => {
                setTasks(tasks.filter(t => t.id !== id));
                message.success('Task deleted successfully (Mocked)');
            },
        });
    };


    // --- Table Configuration (Ant Design) ---
    const columns: ColumnsType<Task> = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80, sorter: (a, b) => a.id - b.id },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status', 
            width: 150, 
            filters: [
                { text: 'pending', value: 'pending' },
                { text: 'in-progress', value: 'in-progress' },
                { text: 'completed', value: 'completed' },
            ], 
            onFilter: (value, record) => record.status.toLowerCase().includes((value as string).toLowerCase()),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    // --- Render ---
    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Task Manager</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    Create Task
                </Button>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert
                    message="Connection Error"
                    description={error}
                    type="error"
                    closable
                    onClose={() => setError(null)}
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            )}

            {/* Main Table View */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" tip="Loading Tasks..." />
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={tasks}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}

            {/* Create/Edit Modal */}
            <Modal
                title={editingTask ? `Edit Task ID: ${editingTask.id}` : 'Create New Task'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null} // Hide default footer to use custom submit button
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input placeholder="Enter task title" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Enter task description"
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please enter a status' }]}
                    >
                        <Input placeholder="e.g., pending, in-progress, completed" />
                    </Form.Item>

                    {/* Submission Buttons */}
                    <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                            >
                                {editingTask ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TaskManager;