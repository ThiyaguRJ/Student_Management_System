const router = require("express").Router();
const { AuditLog, User } = require("../models");
const { verifyToken } = require("../middleware/auth");
const { Op } = require("sequelize");

router.get("/", verifyToken,  async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);

    const where = {};
    let userWhere = {};

    if (search) {
      where[Op.or] = [
        { action: { [Op.like]: `%${search}%` } },
        { entity: { [Op.like]: `%${search}%` } },
        { entityId: { [Op.like]: `%${search}%` } },
      ];

      userWhere = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { rows, count } = await AuditLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
          where: Object.keys(userWhere).length ? userWhere : undefined,
          required: false,
        },
      ],
      offset,
      limit: Number(pageSize),
      distinct: true,   
    });

    res.json({
      data: rows,
      total: count,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    console.error("❌ Error fetching audit logs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
