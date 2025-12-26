import React, { useState } from "react";
import MarksForm from "./MarksForm.jsx";
import DynamicFieldModal from "./DynamicFieldModal.jsx";
import Card from "../ui/Card.jsx";
import { Edit3, Info } from "lucide-react";
function MarksEntry() {
  const [dynamicFields, setDynamicFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addField = (field) => {
    if (dynamicFields.length >= 10) return;
    const newField = {
      id: `field${dynamicFields.length + 1}`,
      name: field.name,
      maxMarks: field.maxMarks,
    };
    setDynamicFields((prev) => [...prev, newField]);
  };
  const removeField = (fieldId) => {
    setDynamicFields((prev) => {
      const filtered = prev.filter((f) => f.id !== fieldId);
      return filtered.map((f, i) => ({ ...f, id: `field${i + 1}` }));
    });
  };
  const resetFields = () => {
    setDynamicFields([]);
  };
  return (
    <div className="space-y-6">
      {" "}
      <Card>
        {" "}
        <Card.Header>
          {" "}
          <Card.Title icon={Edit3}>Enter Student Marks</Card.Title>{" "}
        </Card.Header>{" "}
        <Card.Content>
          {" "}
          {/* Info Banner */}{" "}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            {" "}
            <Info
              className="text-blue-600 flex-shrink-0 mt-0.5"
              size={20}
            />{" "}
            <div>
              {" "}
              <p className="text-sm text-blue-800 font-medium">
                Flexible Marks Distribution
              </p>{" "}
              <p className="text-xs text-blue-600 mt-1">
                {" "}
                Click "Add Assessment Field" to create custom assessment
                components (e.g., Internal - 50, Assignment - 25, Viva -
                25).{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <MarksForm
            dynamicFields={dynamicFields}
            onAddField={() => setIsModalOpen(true)}
            onRemoveField={removeField}
            onReset={resetFields}
          />{" "}
        </Card.Content>{" "}
      </Card>{" "}
      {/* Add Field Modal */}{" "}
      <DynamicFieldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addField}
        currentFieldCount={dynamicFields.length}
      />{" "}
    </div>
  );
}
export default MarksEntry;
