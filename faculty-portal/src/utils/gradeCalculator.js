export function calculateGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

export function calculatePercentage(obtained, total) {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
}

export function isPass(percentage) {
  return percentage >= 40;
}

export function getGradeColor(grade) {
  const colors = {
    'A+': 'text-green-600 bg-green-50',
    A: 'text-green-600 bg-green-50',
    'B+': 'text-blue-600 bg-blue-50',
    B: 'text-blue-600 bg-blue-50',
    C: 'text-yellow-600 bg-yellow-50',
    D: 'text-orange-600 bg-orange-50',
    F: 'text-red-600 bg-red-50',
  };
  return colors[grade] || 'text-gray-600 bg-gray-50';
}

export function getGradeDistribution(marks) {
  const distribution = {};
  marks.forEach((m) => {
    distribution[m.grade] = (distribution[m.grade] || 0) + 1;
  });
  return distribution;
}

export function calculateClassAverage(marks) {
  if (marks.length === 0) return 0;
  const total = marks.reduce((sum, m) => sum + (m.percentage || 0), 0);
  return Math.round(total / marks.length);
}

export function getPassRate(marks) {
  if (marks.length === 0) return 0;
  const passed = marks.filter((m) => m.percentage >= 40).length;
  return Math.round((passed / marks.length) * 100);
}