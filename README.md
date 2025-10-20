# Task 3 - Building an Interactive Web UI with React

This project constitutes the interactive web user interface for the Task Manager application, built using React, TypeScript, and the Ant Design component library. It serves as the client layer, consuming the RESTful APIs exposed by the Spring Boot backend.

## 1. Project Goal
The primary goal of this task is to create a modern, responsive single-page application (SPA) that provides a comprehensive interface for managing tasks. This includes Full CRUD (Create, Read, Update, Delete) functionality, along with features for Searching and Executing commands on the backend.

## 2. Project Setup & Dependencies

### 2.1 Project Initialization

The frontend project is initialized using the Create React App tool with the TypeScript template:

```bash
npx create-react-app kaiburr-ui --template typescript
cd kaiburr-ui
```
### 2.2 Dependencies  
The following key libraries are installed to manage UI components and API communication:

```bash
npm install antd axios
```

| Dependency | Purpose                                                               |
| ---------- | --------------------------------------------------------------------- |
| **antd**   | The comprehensive Ant Design component library for building the UI.   |
| **axios**  | A promise-based HTTP client used for making API calls to the backend. |

### 2.3 Style Integration  
The global stylesheet for Ant Design is imported in `src/index.tsx` to ensure all components are styled correctly:

```typescript
// src/index.tsx
import 'antd/dist/reset.css'; 
// ...
```

## 3. Frontend Architecture (Section 4.3)  
The project is structured to maintain separation of concerns, focusing on a clean API service layer and strong type safety.

### 3.1 API Service (src/api.ts)  
This file centralizes all network communication with the backend API.

```typescript
// src/api.ts
import axios from 'axios'; 
import { Task } from './types'; // Assuming types are imported

const apiClient = axios.create({ 
    // Target URL uses the Kubernetes NodePort exposed on the host machine
    baseURL: 'http://localhost:30080', 
}); 

// Example API function definition
export const getTasks = () => apiClient.get<Task[]>('/tasks'); 
// ... Define other CRUD functions (createTask, updateTask, deleteTask)
```

### 3.2 Type Definitions (src/types.ts)  
TypeScript interfaces for all key data structures, such as `Task` and `TaskExecution`, are defined here to ensure type safety throughout the application.

## 4. Implementation Details 
The core `TaskManager` component handles all state management and renders the UI using Ant Design components.

### 4.1 Listing Tasks (Read)  

- The `useEffect` hook is used to trigger the `getTasks` function upon component mount.  
- `useState` tracks the list of tasks, a loading boolean, and a potential error object.  
- During loading, an Ant Design `<Spin size="large" />` indicator is displayed.  
- On error, an `<Alert type="error" />` message provides user feedback.  
- The task data is displayed using the Ant Design `<Table>` component.

### 4.2 Creating and Editing Tasks (Create & Update)  
- Task creation and editing are handled within a shared Ant Design `<Modal>` component.  

- Data input uses the Ant Design `<Form>` component with `<Input>` and `<Input.TextArea>`.  

- The submit button is disabled (`loading={submitting}`) while the request is in progress to prevent duplicate submissions.  

`message.success()` or `message.error()` are used for final outcome feedback.

### 4.3 Deleting Tasks (Delete)  
- An "Actions" column is added to the `<Table>`.  

- The delete button is wrapped in an Ant Design `<Modal.confirm>` (or similar confirmation component) to require user confirmation before calling the `deleteTask` API function.

### 4.4 Searching and Executing Tasks  
- **Searching:** An `<Input.Search>` component is implemented above the table to filter tasks client-side or trigger a search API call based on the task name.  

- **Execution:** A "Run" button is added to the "Actions" column. Clicking this calls the task execution endpoint (`/tasks/execute/{id}`). The command output is displayed in a separate modal using a `<pre>` tag to preserve the original terminal-like formatting.

## 5 Web UI Output  
The final running application provides a responsive table view for task management, allowing users to view, create, edit, and delete tasks seamlessly. The placeholder data is displayed upon initial load, confirming successful frontend operation.

<img width="2880" height="1800" alt="image" src="https://github.com/user-attachments/assets/c72375a6-638e-4949-a077-30b66411a9cc" />



