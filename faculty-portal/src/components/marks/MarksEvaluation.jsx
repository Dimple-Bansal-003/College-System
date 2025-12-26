import React from "react";
import Card from "../ui/Card.jsx";
import { useApp } from "../../contexts/AppContext.jsx";
import { getSampleMarks } from "../../data/sampleData";
import {
  getGradeDistribution,
  getPassRate,
  calculateClassAverage,
} from "../../utils/gradeCalculator";
import {
  Users,
  CheckCircle,
  XCircle,
  Percent,
  Info,
  BarChart3,
} from "lucide-react";
function MarksEvaluation() {
  const { studentMarks } = useApp();
  const displayMarks =
    studentMarks.length > 0 ? studentMarks : getSampleMarks();
  const showingSample = studentMarks.length === 0;
  const totalStudents = displayMarks.length;
  const passed = displayMarks.filter((m) => m.percentage >= 40).length;
  const failed = totalStudents - passed;
  const passRate = getPassRate(displayMarks);
  const gradeDistribution = getGradeDistribution(displayMarks);
  const classAverage = calculateClassAverage(displayMarks);
  const statCards = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "blue",
    },
    { label: "Passed", value: passed, icon: CheckCircle, color: "green" },
    { label: "Failed", value: failed, icon: XCircle, color: "red" },
    {
      label: "Pass Rate",
      value: `${passRate}%`,
      icon: Percent,
      color: "purple",
    },
  ];
  const grades = ["A+", "A", "B+", "B", "C", "D", "F"];
  return (
    <div className="space-y-6">
      {" "}
      {showingSample && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          {" "}
          <Info className="text-amber-600" size={20} />{" "}
          <p className="text-sm text-amber-700">
            {" "}
            Showing analysis of sample data. Add real student marks to see
            actual evaluation statistics.{" "}
          </p>{" "}
        </div>
      )}{" "}
      {/* Stats Cards */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {" "}
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} padding="p-6">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${color === "blue" ? "bg-blue-100" : color === "green" ? "bg-green-100" : color === "red" ? "bg-red-100" : "bg-purple-100"}`}
              >
                {" "}
                <Icon
                  className={
                    color === "blue"
                      ? "text-blue-600"
                      : color === "green"
                        ? "text-green-600"
                        : color === "red"
                          ? "text-red-600"
                          : "text-purple-600"
                  }
                  size={28}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <p
                  className={`text-3xl font-bold ${color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : color === "red" ? "text-red-600" : "text-purple-600"}`}
                >
                  {" "}
                  {value}{" "}
                </p>{" "}
                <p className="text-gray-500 text-sm">{label}</p>{" "}
              </div>{" "}
            </div>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {" "}
        {/* Average Marks Analysis */}{" "}
        <Card>
          {" "}
          <Card.Header>
            {" "}
            <Card.Title>Average Marks Analysis</Card.Title>{" "}
          </Card.Header>{" "}
          <Card.Content>
            {" "}
            <div className="space-y-6">
              {" "}
              <div>
                {" "}
                <div className="flex justify-between mb-2">
                  {" "}
                  <span className="text-gray-600">Class Average</span>{" "}
                  <span className="font-semibold">{classAverage}%</span>{" "}
                </div>{" "}
                <div className="w-full bg-gray-200 rounded-full h-4">
                  {" "}
                  <div
                    className="bg-blue-600 rounded-full h-4 transition-all"
                    style={{ width: `${classAverage}%` }}
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="flex justify-between mb-2">
                  {" "}
                  <span className="text-gray-600">Pass Rate</span>{" "}
                  <span className="font-semibold">{passRate}%</span>{" "}
                </div>{" "}
                <div className="w-full bg-gray-200 rounded-full h-4">
                  {" "}
                  <div
                    className="bg-green-600 rounded-full h-4 transition-all"
                    style={{ width: `${passRate}%` }}
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </Card.Content>{" "}
        </Card>{" "}
        {/* Grade Distribution */}{" "}
        <Card>
          {" "}
          <Card.Header>
            {" "}
            <Card.Title icon={BarChart3}>Grade Distribution</Card.Title>{" "}
          </Card.Header>{" "}
          <Card.Content>
            {" "}
            {Object.keys(gradeDistribution).length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {" "}
                {grades
                  .filter((g) => gradeDistribution[g])
                  .map((grade) => (
                    <div
                      key={grade}
                      className="bg-gray-50 rounded-lg p-4 text-center"
                    >
                      {" "}
                      <p
                        className={`text-2xl font-bold ${grade === "F" ? "text-red-600" : grade.startsWith("A") ? "text-green-600" : "text-blue-600"}`}
                      >
                        {" "}
                        {gradeDistribution[grade] || 0}{" "}
                      </p>{" "}
                      <p className="text-gray-500 text-sm">
                        Grade {grade}
                      </p>{" "}
                    </div>
                  ))}{" "}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No marks data available for analysis
              </p>
            )}{" "}
          </Card.Content>{" "}
        </Card>{" "}
      </div>{" "}
    </div>
  );
}
export default MarksEvaluation;
