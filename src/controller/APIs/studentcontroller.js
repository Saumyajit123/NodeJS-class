const Student = require("../../models/student.model");
const StatusCode = require("../../utils/statusCode");
const fs = require("fs");
const path = require("path");

class StudentController {
  // FOR CREATING DATA:
  async createstudent(req, res) {
    // console.log(req.body);

    try {
      const { name, email, phone, city, state, country } = req.body;
      const existingStudent = await Student.findOne({
        $or: [{ email: email }, { phone: phone }],
      });

      // ALL FIELDS REQUIERED CONDITION:
      if (!name || !email || !phone || !city || !state || !country) {
        return res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          message: "All fields are required",
        });
      }

      // FOR EXISTING IMAGE / DATA CONDITION:
      if (existingStudent) {
        if (req.file) {
          const imagePath = path.resolve(req.file.path);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return res.status(StatusCode.CONFLICT).json({
          status: false,
          message: "Student already exists",
        });
      }

      const studentData = new Student({
        name: name,
        email: email,
        phone: phone,
        city: city,
        state: state,
        country: country,
        image: req.file ? req.file.filename : "",
      });

      const data = await studentData.save();

      if (data) {
        return res.status(StatusCode.CREATED).json({
          status: true,
          message: "Student created successfully",
          data: data,
        });
      } else {
        return res.status(StatusCode.BAD_REQUEST).json({
          status: false,
          message: "Student not created",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // FOR POST DATA:
  async getallStudents(req, res) {
    try {
      const studata = await Student.find();

      if (!studata || studata.length == 0) {
        return res.status(StatusCode.NOT_FOUND).json({
          status: false,
          message: "No student found",
          data: null,
        });
      }

      return res.status(StatusCode.OK).json({
        status: true,
        total: studata.length,
        message: "All students found",
        data: studata,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // FOR GET ONE PARTICULAR DATA:
  async getStudentById(req, res) {
    try {
      const id = req.params.id;
      const studata = await Student.findById(id);

      if (!studata) {
        return res.status(StatusCode.NOT_FOUND).json({
          status: false,
          message: "No student found",
          data: null,
        });
      }

      return res.status(StatusCode.OK).json({
        status: true,
        data: studata,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // UPDATE DATA:
  async updateStudent(req, res) {
    try {
      const id = req.params.id;
      const { name, email, phone, city, state, country } = req.body;

      const studata = await Student.findById(id);

      if (!studata) {
        return res.status(StatusCode.NOT_FOUND).json({
          status: false,
          message: "No student found",
          data: null,
        });
      }

      // Keep the image by default:
      let image = studata.image;

      // If a new student is uploaded:
      if (req.file) {

        // Delete the old image:
        if (studata.image) {
          const oldImgPath = path.join(
            __dirname,
            "../../../uploads",
            studata.image,
          );

          if (fs.existsSync(oldImgPath)) {
            fs.unlinkSync(oldImgPath);
            console.log("Old image deleted");
          } else {
            console.log("File not found:", oldImgPath);
          }
        }

        // Save the new image name:
        image = req.file.filename;
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { name, email, phone, city, state, country, image },
        { new: true },
      );

      // console.log(updatedStudent);

      return res.status(StatusCode.OK).json({
        status: true,
        message: "Student data updated successfully",
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // DELETE DATA:
  async deleteStudent(req, res) {
    try {
      const id = req.params.id;
      const studata = await Student.findById(id);

      if (!studata) {
        return res.status(StatusCode.NOT_FOUND).json({
          status: false,
          message: "No student found",
        });
      }

      console.log(studata.image);

      // Delete student image from uploads folder:
      if (studata.image) {
        const imagePath = path.join(
          __dirname,
          "../../../uploads",
          studata.image,
        );
        console.log(imagePath);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete student from database:
      const deletedstudent = await Student.findByIdAndDelete(id);

      return res.status(StatusCode.OK).json({
        status: true,
        message: "Student deleted successfully",
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // SEARCHING DATA:
  async searchStudent(req, res) {
    try {
      const { name } = req.params;

      const studata = await Student.find({
        name: { $regex: name, $options: "i" },
      });

      if (!studata) {
        return res.status(StatusCode.NOT_FOUND).json({
          status: false,
          message: "No student found",
          data: null,
        });
      }

      return res.status(StatusCode.OK).json({
        status: true,
        data: studata,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  // FILTERING DATA:
  async filterStudent(req, res) {
    try {
      const { name, email, phone, city, state, country } = req.query;

      let filter = {};

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      if (email) {
        filter.email = { $regex: email, $options: "i" };
      }

      if (phone) {
        filter.phone = { $regex: phone, $options: "i" };
      }

      if (city) {
        filter.city = { $regex: city, $options: "i" };
      }

      if (state) {
        filter.state = { $regex: state, $options: "i" };
      }

      if (country) {
        filter.country = { $regex: country, $options: "i" };
      }

      const studata = await Student.find(filter);

      if (!studata) {
        return res.status(StatusCode.NOT_FOUND).json({
          status: false,
          message: "No student found",
          data: null,
        });
      }

      return res.status(StatusCode.OK).json({
        status: true,
        count: studata.length,
        data: studata,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new StudentController();
