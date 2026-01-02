import * as XLSX from 'xlsx';

export const generateUniqueId = (prefix = 'STU') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

export const generateUsername = (name, id) => {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  return `${cleanName.substring(0, 6)}${id.substring(id.length - 4)}`;
};

export const generatePassword = (length = 8) => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const getSemestersForYear = (yearNumber) => {
  const sem1 = (yearNumber - 1) * 2 + 1;
  const sem2 = (yearNumber - 1) * 2 + 2;
  return [sem1, sem2];
};

export const formatAcademicYear = (startYear) => `${startYear}-${startYear + 1}`;

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const isFailingMarks = (obtained, passing = 40) => obtained < passing;

export const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });