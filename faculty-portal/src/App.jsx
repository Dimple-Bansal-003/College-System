import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ExamScheduling from './components/exams/ExamScheduling';
import MarksEntry from './components/marks/MarksEntry';
import MarksEvaluation from './components/marks/MarksEvaluation';
import QuestionPapers from './components/question-papers/QuestionPapers';
import StudentMarks from './components/marks/StudentMarks';
import Reports from './components/reports/Reports';
import ResultsPreview from './components/results/ResultsPreview';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scheduling" element={<ExamScheduling />} />
        <Route path="/marks-entry" element={<MarksEntry />} />
        <Route path="/evaluation" element={<MarksEvaluation />} />
        <Route path="/question-papers" element={<QuestionPapers />} />
        <Route path="/student-marks" element={<StudentMarks />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/results" element={<ResultsPreview />} />
      </Routes>
    </Layout>
  );
}

export default App;