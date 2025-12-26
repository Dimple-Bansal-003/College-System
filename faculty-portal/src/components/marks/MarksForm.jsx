import React, { useState, useCallback, useMemo } from 'react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import { useApp } from '../../contexts/AppContext.jsx';
import { useToast } from '../../contexts/ToastContex.jsxt';
import { COURSES, SEMESTERS } from '../../utils/constants';
import { calculateGrade, calculatePercentage } from '../../utils/gradeCalculator';
import { Plus, Save, RotateCcw, X, AlertTriangle } from 'lucide-react';

// Initial empty form state
const initialFormState = {
  student_id: '',
  student_name: '',
  course: '',
  semester: '',
};

function MarksForm({ dynamicFields, onAddField, onRemoveField, onReset }) {
  const [formData, setFormData] = useState(initialFormState);
  const [fieldMarks, setFieldMarks] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { addMarks, studentMarks } = useApp();
  const { showToast } = useToast();

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  // Handle marks input changes for dynamic fields
  const handleFieldMarksChange = useCallback((fieldId, value, maxMarks) => {
    const numValue = parseInt(value) || 0;

    // Validate that marks don't exceed maximum
    if (numValue > maxMarks) {
      showToast(`Marks cannot exceed maximum of ${maxMarks}`, 'error');
      return;
    }

    if (numValue < 0) {
      showToast('Marks cannot be negative', 'error');
      return;
    }

    setFieldMarks((prev) => ({ ...prev, [fieldId]: numValue }));
  }, [showToast]);

  // Calculate totals, percentage, and grade
  const calculations = useMemo(() => {
    let totalMarks = 0;
    let totalMax = 0;

    dynamicFields.forEach((field) => {
      totalMarks += fieldMarks[field.id] || 0;
      totalMax += field.maxMarks;
    });

    const percentage = calculatePercentage(totalMarks, totalMax);
    const grade = dynamicFields.length > 0 ? calculateGrade(percentage) : '-';
    const isPassing = percentage >= 40;

    return { totalMarks, totalMax, percentage, grade, isPassing };
  }, [dynamicFields, fieldMarks]);

  // Validate form before submission
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.student_id.trim()) {
      newErrors.student_id = 'Student ID is required';
    } else if (!/^[A-Za-z0-9]+$/.test(formData.student_id)) {
      newErrors.student_id = 'Student ID can only contain letters and numbers';
    }

    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Student name is required';
    } else if (formData.student_name.trim().length < 2) {
      newErrors.student_name = 'Name must be at least 2 characters';
    }

    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }

    if (!formData.semester) {
      newErrors.semester = 'Please select a semester';
    }

    if (dynamicFields.length === 0) {
      newErrors.fields = 'Please add at least one assessment field';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, dynamicFields]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check record limit
    if (studentMarks.length >= 999) {
      showToast('Maximum record limit reached (999). Please delete some records first.', 'error');
      return;
    }

    // Validate form
    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Build the marks data object
      const marksData = {
        ...formData,
        student_id: formData.student_id.trim().toUpperCase(),
        student_name: formData.student_name.trim(),
        total_marks: calculations.totalMarks,
        total_max: calculations.totalMax,
        percentage: calculations.percentage,
        grade: calculations.grade,
        created_at: new Date().toISOString(),
      };

      // Add field-specific marks
      dynamicFields.forEach((field, index) => {
        marksData[`field${index + 1}_name`] = field.name;
        marksData[`field${index + 1}_marks`] = fieldMarks[field.id] || 0;
        marksData[`field${index + 1}_max`] = field.maxMarks;
      });

      // Save marks
      addMarks(marksData);
      showToast(
        `Marks saved successfully for ${formData.student_name} (${calculations.grade})`,
        'success'
      );

      // Reset form but keep the assessment fields for next entry
      setFormData(initialFormState);
      setFieldMarks({});
      setErrors({});
    } catch (error) {
      console.error('Error saving marks:', error);
      showToast('Failed to save marks. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle full form reset
  const handleReset = () => {
    setFormData(initialFormState);
    setFieldMarks({});
    setErrors({});
    onReset();
    showToast('Form cleared');
  };

  // Get status color based on percentage
  const getStatusColor = () => {
    if (dynamicFields.length === 0 || calculations.totalMarks === 0) return 'text-gray-400';
    return calculations.isPassing ? 'text-green-600' : 'text-red-600';
  };

  // Get grade color
  const getGradeColor = () => {
    const grade = calculations.grade;
    if (grade === '-') return 'text-gray-400';
    if (grade === 'A+' || grade === 'A') return 'text-green-600';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600';
    if (grade === 'C') return 'text-yellow-600';
    if (grade === 'D') return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Information Section */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Student Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Student ID"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            placeholder="e.g., STU2024001"
            error={errors.student_id}
            required
          />
          <Input
            label="Student Name"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            placeholder="Enter full name"
            error={errors.student_name}
            required
          />
          <Select
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            options={COURSES}
            placeholder="Select Course"
            error={errors.course}
            required
          />
          <Select
            label="Semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            options={SEMESTERS}
            placeholder="Select Semester"
            error={errors.semester}
            required
          />
        </div>
      </div>

      {/* Assessment Fields Section */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Assessment Fields
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Add assessment components (e.g., Internal - 50, Assignment - 25, Project - 25)
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={onAddField}
            disabled={dynamicFields.length >= 10}
          >
            <Plus size={16} />
            Add Field
            {dynamicFields.length > 0 && (
              <span className="ml-1 text-xs opacity-75">({dynamicFields.length}/10)</span>
            )}
          </Button>
        </div>

        {/* Error message for no fields */}
        {errors.fields && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={18} />
            <p className="text-sm text-red-600">{errors.fields}</p>
          </div>
        )}

        {/* Dynamic Fields Grid */}
        {dynamicFields.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {dynamicFields.map((field) => (
              <div
                key={field.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 relative group hover:border-blue-200 transition-colors"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveField(field.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 focus:opacity-100"
                  title="Remove field"
                >
                  <X size={14} />
                </button>

                {/* Field label */}
                <label
                  htmlFor={`marks-${field.id}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.name}
                  <span className="text-gray-400 font-normal ml-1">(Max: {field.maxMarks})</span>
                </label>

                {/* Marks input */}
                <input
                  type="number"
                  id={`marks-${field.id}`}
                  className="input-field"
                  min="0"
                  max={field.maxMarks}
                  value={fieldMarks[field.id] || ''}
                  onChange={(e) => handleFieldMarksChange(field.id, e.target.value, field.maxMarks)}
                  placeholder={`0 - ${field.maxMarks}`}
                />

                {/* Progress indicator */}
                {fieldMarks[field.id] !== undefined && fieldMarks[field.id] > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          (fieldMarks[field.id] / field.maxMarks) >= 0.4
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min((fieldMarks[field.id] / field.maxMarks) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <Plus className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="font-medium">No assessment fields added yet</p>
            <p className="text-sm mt-1">
              Click "Add Field" above to create assessment components
            </p>
          </div>
        )}

        {/* Results Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border-2 border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Total Marks</p>
            <p className="text-3xl font-bold text-blue-600">{calculations.totalMarks}</p>
            <p className="text-xs text-gray-400">out of {calculations.totalMax || 0}</p>
          </div>

          <div className="text-center border-l border-gray-200">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Percentage</p>
            <p className="text-3xl font-bold text-purple-600">{calculations.percentage}%</p>
            <p className="text-xs text-gray-400">
              {calculations.percentage >= 40 ? 'Passing' : 'Below passing'}
            </p>
          </div>

          <div className="text-center border-l border-gray-200">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Grade</p>
            <p className={`text-3xl font-bold ${getGradeColor()}`}>{calculations.grade}</p>
            <p className="text-xs text-gray-400">
              {calculations.grade !== '-' ? 'Calculated' : 'Add marks'}
            </p>
          </div>

          <div className="text-center border-l border-gray-200">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Status</p>
            <p className={`text-xl font-bold ${getStatusColor()}`}>
              {dynamicFields.length === 0 || calculations.totalMarks === 0
                ? '-'
                : calculations.isPassing
                ? '✓ PASS'
                : '✗ FAIL'}
            </p>
            <p className="text-xs text-gray-400">
              {calculations.isPassing ? 'Congratulations' : 'Min 40% required'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={handleReset}>
          <RotateCcw size={16} />
          Clear Form
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={dynamicFields.length === 0 || isLoading}
        >
          <Save size={16} />
          Save Marks
        </Button>
      </div>
    </form>
  );
}

export default MarksForm;