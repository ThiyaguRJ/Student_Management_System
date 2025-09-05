const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Class = require("./Class");

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  passwordHash: DataTypes.STRING,
  role: { type: DataTypes.ENUM("ADMIN", "TEACHER"), defaultValue: "TEACHER" },
});

const Student = sequelize.define("Student", {
  rollNumber: { type: DataTypes.STRING, unique: true },
  name: DataTypes.STRING,
  gender: { type: DataTypes.ENUM("M", "F", "O") },
  dob: DataTypes.DATEONLY,
  photoUrl: DataTypes.STRING,
  ClassId: DataTypes.STRING,
});

const AuditLog = sequelize.define("AuditLog", {
  action: DataTypes.ENUM("CREATE", "UPDATE", "DELETE"),
  entity: DataTypes.STRING,
  entityId: DataTypes.INTEGER,
  before: DataTypes.JSON,
  after: DataTypes.JSON,
  user: DataTypes.STRING,
});

Class.hasMany(Student);
Student.belongsTo(Class);
User.hasMany(AuditLog);
AuditLog.belongsTo(User);

module.exports = { sequelize, User, Class, Student, AuditLog };
