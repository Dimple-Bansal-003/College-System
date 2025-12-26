import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const initialState = {
  exams: [],
  studentMarks: [],
  questionPapers: [],
  isLoading: false,
  deleteConfirmId: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_DELETE_CONFIRM':
      return { ...state, deleteConfirmId: action.payload };

    case 'ADD_EXAM':
      return { ...state, exams: [...state.exams, action.payload] };

    case 'DELETE_EXAM':
      return {
        ...state,
        exams: state.exams.filter((e) => e.id !== action.payload),
        deleteConfirmId: null,
      };

    case 'ADD_MARKS':
      return { ...state, studentMarks: [...state.studentMarks, action.payload] };

    case 'DELETE_MARKS':
      return {
        ...state,
        studentMarks: state.studentMarks.filter((m) => m.id !== action.payload),
        deleteConfirmId: null,
      };

    case 'ADD_PAPER':
      return { ...state, questionPapers: [...state.questionPapers, action.payload] };

    case 'DELETE_PAPER':
      return {
        ...state,
        questionPapers: state.questionPapers.filter((p) => p.id !== action.payload),
        deleteConfirmId: null,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setDeleteConfirm = useCallback((id) => {
    dispatch({ type: 'SET_DELETE_CONFIRM', payload: id });
  }, []);

  const addExam = useCallback((exam) => {
    const newExam = { ...exam, id: Date.now().toString() };
    dispatch({ type: 'ADD_EXAM', payload: newExam });
    return newExam;
  }, []);

  const deleteExam = useCallback((id) => {
    dispatch({ type: 'DELETE_EXAM', payload: id });
  }, []);

  const addMarks = useCallback((marks) => {
    const newMarks = { ...marks, id: Date.now().toString() };
    dispatch({ type: 'ADD_MARKS', payload: newMarks });
    return newMarks;
  }, []);

  const deleteMarks = useCallback((id) => {
    dispatch({ type: 'DELETE_MARKS', payload: id });
  }, []);

  const addPaper = useCallback((paper) => {
    const newPaper = { ...paper, id: Date.now().toString() };
    dispatch({ type: 'ADD_PAPER', payload: newPaper });
    return newPaper;
  }, []);

  const deletePaper = useCallback((id) => {
    dispatch({ type: 'DELETE_PAPER', payload: id });
  }, []);

  const value = {
    ...state,
    setLoading,
    setDeleteConfirm,
    addExam,
    deleteExam,
    addMarks,
    deleteMarks,
    addPaper,
    deletePaper,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
