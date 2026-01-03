export const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B+'
  if (percentage >= 60) return 'B'
  if (percentage >= 50) return 'C'
  if (percentage >= 40) return 'D'
  return 'F'
}

export const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const generateCSV = (data, headers) => {
  const headerRow = headers.join(',')
  const rows = data.map(row => headers.map(h => row[h] ?? '').join(','))
  return [headerRow, ...rows].join('\n')
}

export const downloadFile = (content, filename, type = 'text/csv') => {
  const blob = new Blob([content], { type: `${type};charset=utf-8;` })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
