import React, { useState } from "react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { useApp } from "../../contexts/AppContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { COURSES, SEMESTERS, PAPER_STATUSES } from "../../utils/constants.jsx";
import { validateFile, formatFileSize } from "../../utils/fileUtils.jsx";
import { Upload, FileText } from "lucide-react";
function PaperUploadForm() {
  const [formData, setFormData] = useState({
    paper_name: "",
    course: "",
    semester: "",
    status: "Draft",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addPaper, questionPapers } = useApp();
  const { showToast } = useToast();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validation = validateFile(file);
    if (!validation.isValid) {
      showToast(validation.errors[0], "error");
      return;
    }
    setSelectedFile(file);
  };
  const clearFile = () => {
    setSelectedFile(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questionPapers.length >= 999) {
      showToast("Maximum record limit reached (999)", "error");
      return;
    }
    setIsLoading(true);
    try {
      addPaper({
        ...formData,
        upload_date: new Date().toLocaleDateString(),
        file_name: selectedFile?.name || "",
        file_size: selectedFile ? formatFileSize(selectedFile.size) : "",
      });
      showToast("Question paper uploaded successfully");
      setFormData({
        paper_name: "",
        course: "",
        semester: "",
        status: "Draft",
      });
      setSelectedFile(null);
    } catch (error) {
      showToast("Failed to upload question paper", "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {" "}
        <Input
          label="Paper Title"
          name="paper_name"
          value={formData.paper_name}
          onChange={handleChange}
          placeholder="e.g., CS101 Mid-Term 2024"
          required
        />{" "}
        <Select
          label="Course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          options={COURSES}
          placeholder="Select Course"
          required
        />{" "}
        <Select
          label="Semester"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          options={SEMESTERS}
          placeholder="Select Semester"
          required
        />{" "}
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={PAPER_STATUSES}
          required
        />{" "}
      </div>{" "}
      {/* File Upload */}{" "}
      <div>
        {" "}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Paper File
        </label>{" "}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => document.getElementById("paper-file").click()}
        >
          {" "}
          <input
            type="file"
            id="paper-file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
          />{" "}
          {selectedFile ? (
            <div>
              {" "}
              <FileText
                className="mx-auto text-green-500 mb-2"
                size={40}
              />{" "}
              <p className="text-gray-800 font-medium">{selectedFile.name}</p>{" "}
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="mt-2 text-red-500 text-sm hover:underline"
              >
                {" "}
                Remove file{" "}
              </button>{" "}
            </div>
          ) : (
            <div>
              {" "}
              <Upload className="mx-auto text-gray-400 mb-2" size={40} />{" "}
              <p className="text-gray-600 mb-1">
                {" "}
                Drag and drop your file here, or click to browse{" "}
              </p>{" "}
              <p className="text-xs text-gray-400">
                Supports PDF, DOC, DOCX, TXT (Max 10MB)
              </p>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex justify-end gap-3">
        {" "}
        <Button type="reset" variant="secondary" onClick={clearFile}>
          {" "}
          Clear{" "}
        </Button>{" "}
        <Button type="submit" isLoading={isLoading}>
          {" "}
          <Upload size={16} /> Upload Paper{" "}
        </Button>{" "}
      </div>{" "}
    </form>
  );
}
export default PaperUploadForm;
