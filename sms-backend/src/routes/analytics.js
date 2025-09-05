const router = require('express').Router();
const { sequelize, Student, Class } = require('../models');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req,res)=>{
  const total = await Student.count();
  const perClass = await Student.findAll({
    attributes: [[sequelize.fn('COUNT', sequelize.col('Student.id')), 'count']],
    include: [{ model: Class, attributes: ['name'] }],
    group: ['Class.id']
  });
  const genderCounts = await Student.findAll({
    attributes: ['gender', [sequelize.fn('COUNT', sequelize.col('gender')), 'count']],
    group: ['gender']
  });
  res.json({ total, perClass, genderCounts });
});

module.exports = router;
