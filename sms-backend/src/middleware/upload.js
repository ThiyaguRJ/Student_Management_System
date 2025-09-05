const multer = require('multer');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => cb(null, Date.now()+'-'+file.originalname)
});
module.exports = multer({ storage });
