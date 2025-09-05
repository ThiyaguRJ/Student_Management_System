const jwt = require('jsonwebtoken');
exports.verifyToken = (req,res,next)=> {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token) return res.status(401).json({message:'No token'});
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({message:'Invalid token'}); }
};
exports.requireRole = (...roles)=> (req,res,next)=>{
  if(!req.user || !roles.includes(req.user.role)) return res.status(403).json({message:'Access denied: Only ADMINs can perform this action'});
  next();
};
