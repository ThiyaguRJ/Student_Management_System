const router = require("express").Router();
const { Student, Class } = require("../models");
const { verifyToken, requireRole } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { Op } = require("sequelize");
const xlsx = require("xlsx");
const moment = require("moment");

router.use(verifyToken);

router.post(
  "/",
  requireRole("ADMIN"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const { rollNumber, name, gender, dob, classId, className } = req.body;
      let classRecord = null;

      if (classId) {
        classRecord = await Class.findByPk(classId);
      }

      if (!classRecord) {
        classRecord = await Class.create({
          id: classId || undefined, 
          name: className || `Class-${Date.now()}`,
        });
      }

      const student = await Student.create(
        {
          rollNumber,
          name,
          gender,
          dob,
          ClassId: classRecord.id, 
          photoUrl: req.file ? req.file.path : null,
        },
        {
          user: req.user.name,
        }
      );

      res.status(201).json(student);
    } catch (err) {
      console.error("❌ Error creating student:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = "", classId } = req.query;
    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (classId) {
      where.ClassId = classId;
    }

    const offset = (Number(page) - 1) * Number(pageSize);

    const { rows, count } = await Student.findAndCountAll({
      where,
      offset,
      limit: Number(pageSize),
      include: [Class],
    });

    res.json({
      data: rows,
      total: count,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (err) {
    console.error("❌ Error in GET /students:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) =>
  res.json(await Student.findByPk(req.params.id, { include: [Class] }))
);

router.put(
  "/:id",
  requireRole("ADMIN"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const student = await Student.findByPk(req.params.id);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const payload = { ...req.body };

      const user = req.body.user;
      if (req.file) {
        payload.photoUrl = req.file.path;
      }

      if (payload.dob) {
        const parsedDate = new Date(payload.dob);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }
        payload.dob = parsedDate;  
      }

      await student.update(payload, { user });

      return res.json(student);
    } catch (err) {
      console.error("❌ Update error:", err);
      res
        .status(500)
        .json({ message: "Error updating student", error: err.message });
    }
  }
);

router.delete("/:id", requireRole("ADMIN"), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    await student.destroy({ user: req.user.name });
    res.status(204).end();
  } catch (err) {
    console.error("❌ Update error:", err);
    res
      .status(500)
      .json({ message: "Error updating student", error: err.message });
  }
});

router.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const students = rows.map((r) => ({
      rollNumber: r["Roll No"],
      name: r["Name"],
      gender: r["Gender"]?.toLowerCase().startsWith("m")
        ? "M"
        : r["Gender"]?.toLowerCase().startsWith("f")
        ? "F"
        : null,
      dob: r["Date of Birth"]
        ? moment(r["Date of Birth"], ["DD/MM/YYYY", "YYYY-MM-DD"]).format(
            "YYYY-MM-DD"
          )
        : null,
      classId: r["Class"],
    }));

    const rollNumbers = students.map((s) => s.rollNumber);

    const existing = await Student.findAll({
      where: { rollNumber: { [Op.in]: rollNumbers } },
    });

    if (existing.length > 0) {
      const existingRolls = existing.map((e) => e.rollNumber);
      return res.status(400).json({
        message: `Data already exists for Roll Numbers: ${existingRolls.join(
          ", "
        )}`,
      });
    }

    await Student.bulkCreate(students, { user: req.user.name });

    res.json({
      message: "Students imported successfully",
      count: students.length,
    });
  } catch (err) {
    console.error("❌ Import Error:", err);
    res.status(500).json({ message: "Import failed" });
  }
});

module.exports = router;
