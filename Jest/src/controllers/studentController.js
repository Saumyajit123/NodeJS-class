const Student = require("../models/studentModel");
const slugify = require("slugify");

class StudentController {
  // CREATE STUDENT
  async createStudent(req, res) {
    try {
      const { name, city, age } = req.body;

      const student = new Student({
        name,
        slug: slugify(name, { lower: true, strict: true }),
        city,
        age,
      });

      if (req.file) {
        student.image = req.file.path;
      }

      const data = await student.save();

      return res.status(201).json({
        status: true,
        message: "Student created successfully",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  // GET ALL STUDENTS
  async getAllStudent(req, res) {
    try {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 10, 1);
      const skip = (page - 1) * limit;

      const [students, totalRecords] = await Promise.all([
        Student.aggregate([
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              __v: 0,
            },
          },
        ]),
        Student.countDocuments(),
      ]);

      return res.status(200).json({
        status: true,
        message: "Students retrieved successfully",
        data: {
          docs: students,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords,
            limit,
          },
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  // GET STUDENT BY SLUG
  async getSlugStudent(req, res) {
    try {
      const student = await Student.findOne({
        slug: req.params.slug,
      });

      if (!student) {
        return res.status(404).json({
          status: false,
          message: "Student not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  // GET STUDENT BY ID
  async getStudentById(req, res) {
    try {
      const student = await Student.findById(req.params.id);

      if (!student) {
        return res.status(404).json({
          status: false,
          message: "Student not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  // UPDATE STUDENT
  async updateStudent(req, res) {
    try {
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedStudent) {
        return res.status(404).json({
          status: false,
          message: "Student not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Student updated successfully",
        data: updatedStudent,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  // DELETE STUDENT
  async deleteStudent(req, res) {
    try {
      const deletedStudent = await Student.findByIdAndDelete(req.params.id);

      if (!deletedStudent) {
        return res.status(404).json({
          status: false,
          message: "Student not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Student deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  // SEARCH STUDENTS
  async search(req, res) {
    try {
      const search = req.body.search || "";

      const students = await Student.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
        ],
      });

      return res.status(200).json({
        status: true,
        message: "Students retrieved successfully",
        data: students,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  // FILTER STUDENTS
  async filter(req, res) {
    try {
      const filters = {};

      if (req.query.age) filters.age = req.query.age;
      if (req.query.name) filters.name = req.query.name;
      if (req.query.city) filters.city = req.query.city;

      const students = await Student.find(filters);

      return res.status(200).json({
        status: true,
        message: "Students filtered successfully",
        data: students,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new StudentController();
