const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Class = sequelize.define('Class', {
  name: DataTypes.STRING,
});

module.exports = Class;
