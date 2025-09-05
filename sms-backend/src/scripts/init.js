const { sequelize, User, Class } = require('../models');
const bcrypt = require('bcryptjs');

(async () => {
  await sequelize.sync({ alter: true });
  const pass = await bcrypt.hash('Admin@123', 10);
  await User.findOrCreate({ where: { email: 'admin@sms.com' }, defaults: { name:'Admin', passwordHash:pass, role:'ADMIN' }});
  await User.findOrCreate({ where: { email: 'teacher@sms.com' }, defaults: { name:'Teacher', passwordHash: await bcrypt.hash('Teacher@123',10), role:'TEACHER' }});
  await Class.findOrCreate({ where: { name: '10-A' }});
  await Class.findOrCreate({ where: { name: '10-B' }});
  console.log('DB initialized');
  process.exit(0);
})();
