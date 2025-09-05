const router = require('express').Router();
const ExcelJS = require('exceljs');
const upload = require('../middleware/upload');
const { verifyToken, requireRole } = require('../middleware/auth');
const { Student, Class } = require('../models');

router.post('/import', verifyToken, requireRole('ADMIN'), upload.single('file'), async (req,res)=>{
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(req.file.path);
  const ws = wb.worksheets[0];
  const header = ws.getRow(1).values.slice(1);
  const idx = Object.fromEntries(header.map((h,i)=>[h,i+1]));
  const errors = []; let created = 0, skipped = 0;

  for (let r=2; r<=ws.rowCount; r++){
    const row = ws.getRow(r);
    const rollNumber = row.getCell(idx.RollNumber).value?.toString().trim();
    const name = row.getCell(idx.Name).value?.toString().trim();
    const gender = row.getCell(idx.Gender).value?.toString().trim();
    const dob = row.getCell(idx.DOB).value; 
    const className = row.getCell(idx.Class).value?.toString().trim();

    if(!rollNumber || !name || !gender || !className){ errors.push({row:r, reason:'Missing required'}); continue; }

    const [klass] = await Class.findOrCreate({ where: { name: className }});
    const exists = await Student.findOne({ where: { rollNumber }});
    if (exists){ skipped++; continue; }

    await Student.create({ rollNumber, name, gender, dob, ClassId: klass.id });
    created++;
  }
  res.json({ created, skipped, errors });
});

module.exports = router;
