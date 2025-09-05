const router = require('express').Router();
const ExcelJS = require('exceljs');
const { Student, Class } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/export', verifyToken, async (req,res)=>{
  const students = await Student.findAll({ include:[Class] });
  const wb = new ExcelJS.Workbook(); const ws = wb.addWorksheet('Students');
  ws.addRow(['RollNumber','Name','Gender','DOB','Class']);
  students.forEach(s => ws.addRow([s.rollNumber, s.name, s.gender, s.dob, s.Class?.name]));
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="students.xlsx"');
  await wb.xlsx.write(res); res.end();
});

module.exports = router;
