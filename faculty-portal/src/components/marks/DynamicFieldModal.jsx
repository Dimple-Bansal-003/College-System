import React, { useState } from "react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
function DynamicFieldModal({ isOpen, onClose, onAdd, currentFieldCount }) {
  const [fieldName, setFieldName] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const { showToast } = useToast();
  const handleSubmit = () => {
    if (!fieldName.trim()) {
      showToast("Please enter a field name", "error");
      return;
    }
    const marks = parseInt(maxMarks);
    if (!marks || marks <= 0) {
      showToast("Maximum marks must be at least 1", "error");
      return;
    }
    if (currentFieldCount >= 10) {
      showToast("Maximum 10 assessment fields allowed", "error");
      return;
    }
    onAdd({ name: fieldName.trim(), maxMarks: marks });
    showToast(`${fieldName} (Max: ${marks}) field added successfully`);
    handleClose();
  };
  const handleClose = () => {
    setFieldName("");
    setMaxMarks("");
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Assessment Field">
      {" "}
      <div className="space-y-4">
        {" "}
        <Input
          label="Field Name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          placeholder="e.g., Internal, Assignment, Project, Viva"
        />{" "}
        <div>
          {" "}
          <Input
            label="Maximum Marks"
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            min="1"
            max="500"
            placeholder="e.g., 50, 25, 100"
          />{" "}
          <p className="text-xs text-gray-500 mt-1">
            {" "}
            Set the maximum marks for this assessment field{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex gap-3 pt-4">
          {" "}
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            {" "}
            Cancel{" "}
          </Button>{" "}
          <Button onClick={handleSubmit} className="flex-1">
            {" "}
            Add Field{" "}
          </Button>{" "}
        </div>{" "}
      </div>{" "}
    </Modal>
  );
}
export default DynamicFieldModal;
