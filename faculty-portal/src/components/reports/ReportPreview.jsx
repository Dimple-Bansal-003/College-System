import React from "react";
import {
  getGradeDistribution,
  getPassRate,
  calculateClassAverage,
} from "../../utils/gradeCalculator.jsx";
import { FileText } from "lucide-react";
function ReportPreview({ reportType, exams, marks }) {
  if (!reportType) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        {" "}
        <FileText className="mx-auto text-gray-300 mb-4" size={64} />{" "}
        <p className="text-gray-500">
          Select a report type above to preview
        </p>{" "}
      </div>
    );
  }
  const renderMarksReport = () => (
    <div className="text-left">
      {" "}
      <h4 className="text-xl font-bold mb-4 text-center">
        Student Marks Report
      </h4>{" "}
      <p className="text-sm text-gray-500 text-center mb-6">
        {" "}
        Generated on {new Date().toLocaleDateString()}{" "}
      </p>{" "}
      {marks.length > 0 ? (
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full">
            {" "}
            <thead>
              {" "}
              <tr className="border-b-2 border-gray-300">
                {" "}
                <th className="p-2 text-left">Student</th>{" "}
                <th className="p-2 text-center">Total</th>{" "}
                <th className="p-2 text-center">%</th>{" "}
                <th className="p-2 text-center">Grade</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {marks.map((m, index) => (
                <tr key={index} className="border-b border-gray-200">
                  {" "}
                  <td className="p-2">
                    {" "}
                    {m.student_name} ({m.student_id}){" "}
                  </td>{" "}
                  <td className="p-2 text-center font-semibold">
                    {m.total_marks}
                  </td>{" "}
                  <td className="p-2 text-center">{m.percentage}%</td>{" "}
                  <td className="p-2 text-center">{m.grade}</td>{" "}
                </tr>
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No marks data available</p>
      )}{" "}
    </div>
  );
  const renderExamReport = () => (
    <div className="text-left">
      {" "}
      <h4 className="text-xl font-bold mb-4 text-center">
        Exam Schedule Report
      </h4>{" "}
      <p className="text-sm text-gray-500 text-center mb-6">
        {" "}
        Generated on {new Date().toLocaleDateString()}{" "}
      </p>{" "}
      {exams.length > 0 ? (
        <div className="space-y-3">
          {" "}
          {exams.map((exam, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              {" "}
              <p className="font-semibold">{exam.exam_name}</p>{" "}
              <p className="text-sm text-gray-600">
                {" "}
                {exam.course} | {exam.semester}{" "}
              </p>{" "}
              <p className="text-sm text-gray-500">
                {" "}
                📅 {exam.exam_date} at {exam.exam_time} | 📍 {exam.room}{" "}
              </p>{" "}
            </div>
          ))}{" "}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No exams scheduled</p>
      )}{" "}
    </div>
  );
  const renderGradeReport = () => {
    const gradeDistribution = getGradeDistribution(marks);
    const passRate = getPassRate(marks);
    const classAverage = calculateClassAverage(marks);
    const grades = ["A+", "A", "B+", "B", "C", "D", "F"];
    return (
      <div className="text-left">
        {" "}
        <h4 className="text-xl font-bold mb-4 text-center">
          Grade Distribution Report
        </h4>{" "}
        <p className="text-sm text-gray-500 text-center mb-6">
          {" "}
          Generated on {new Date().toLocaleDateString()}{" "}
        </p>{" "}
        {marks.length > 0 ? (
          <>
            {" "}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {" "}
              {grades.map((grade) => (
                <div
                  key={grade}
                  className="bg-white p-4 rounded-lg border border-gray-200 text-center"
                >
                  {" "}
                  <p
                    className={`text-2xl font-bold ${grade === "F" ? "text-red-600" : grade.startsWith("A") ? "text-green-600" : "text-blue-600"}`}
                  >
                    {" "}
                    {gradeDistribution[grade] || 0}{" "}
                  </p>{" "}
                  <p className="text-gray-500">Grade {grade}</p>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-2">
              {" "}
              <p>
                {" "}
                <strong>Total Students:</strong> {marks.length}{" "}
              </p>{" "}
              <p>
                {" "}
                <strong>Pass Rate:</strong> {passRate}%{" "}
              </p>{" "}
              <p>
                {" "}
                <strong>Average Score:</strong> {classAverage}%{" "}
              </p>{" "}
            </div>{" "}
          </>
        ) : (
          <p className="text-gray-500 text-center">
            No marks data available for analysis
          </p>
        )}{" "}
      </div>
    );
  };
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      {" "}
      {reportType === "marks" && renderMarksReport()}{" "}
      {reportType === "exam" && renderExamReport()}{" "}
      {reportType === "grade" && renderGradeReport()}{" "}
    </div>
  );
}
export default ReportPreview;
