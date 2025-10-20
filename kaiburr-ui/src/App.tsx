// src/App.tsx
import React from 'react';
import TaskManager from './TaskManager'; // Import your component
import 'antd/dist/reset.css'; // Ensure CSS is imported here or in index.tsx

const App: React.FC = () => {
  return (
    <div className="App">
      <TaskManager />
    </div>
  );
};

export default App;