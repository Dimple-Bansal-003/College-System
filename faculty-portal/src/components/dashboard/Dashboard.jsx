import React from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard.jsx";
import Calendar from "./Calendar.jsx";
import UpcomingExams from "./UpcomingExams.jsx";
import { useApp } from "../../contexts/AppContext.jsx";
import {
  getSampleExams,
  getSampleMarks,
  getSamplePapers,
} from "../../data/sampleData";
import { getPassRate } from "../../utils/gradeCalculator";
import {
  Calendar as CalendarIcon,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react";
function Dashboard() {
  const navigate = useNavigate();
  const { exams, studentMarks, questionPapers } = useApp(); // Use sample data if no real data exists
  const displayExams = exams.length > 0 ? exams : getSampleExams();
  const displayMarks =
    studentMarks.length > 0 ? studentMarks : getSampleMarks();
  const displayPapers =
    questionPapers.length > 0 ? questionPapers : getSamplePapers();
  const passRate = getPassRate(displayMarks);
  const stats = [
    {
      label: "Scheduled Exams",
      value: displayExams.length,
      icon: CalendarIcon,
      onClick: () => navigate("/scheduling"),
      gradient: "from-primary to-secondary",
    },
    {
      label: "Question Papers",
      value: displayPapers.length,
      icon: FileText,
      onClick: () => navigate("/question-papers"),
      gradient: "from-purple-600 to-purple-400",
    },
    {
      label: "Students Evaluated",
      value: displayMarks.length,
      icon: Users,
      onClick: () => navigate("/student-marks"),
      gradient: "from-green-600 to-green-400",
    },
    {
      label: "Pass Rate",
      value: `${passRate}%`,
      icon: TrendingUp,
      onClick: () => navigate("/evaluation"),
      gradient: "from-orange-600 to-orange-400",
    },
  ];
  return (
    <div className="space-y-6">
      {" "}
      {/* Stats Grid */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {" "}
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}{" "}
      </div>{" "}
      {/* Calendar and Upcoming Exams */}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {" "}
        <div className="lg:col-span-2">
          {" "}
          <Calendar exams={displayExams} />{" "}
        </div>{" "}
        <div>
          {" "}
          <UpcomingExams exams={displayExams} />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Dashboard;
