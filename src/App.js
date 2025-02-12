import React from 'react';
import './App.css';
import AssessmentControl from './components/AssessmentControl';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>动作评估系统</h1>
      </header>
      
      <main className="app-main">
        <AssessmentControl />
      </main>
    </div>
  );
};

export default App;
