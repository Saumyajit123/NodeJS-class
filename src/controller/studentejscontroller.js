const Student = require("../models/student.model");
const fs = require("fs");
const path = require("path");

class StudentEjsController {
  async list(req, res) {
    try {
      const studata = await Student.find();
      res.render("crud/list", {
        title: "Student List Page",
        data: studata,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async store(req, res) {
    try {
      res.render("crud/add", {
        title: "Add Student Page",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async create(req, res) {
    // console.log(req.body);
    try {
      const { name, email, phone, city, state, country } = req.body;

      const studentdata = new Student({
        name: name,
        email: email,
        phone: phone,
        city: city,
        state: state,
        country: country,
        image: req.file ? req.file.filename : "",
      });
      const data = await studentdata.save();
      res.redirect("/student");
    } catch (error) {
      console.log(error);
    }
  }

  async view(req, res) {
    try {
      const id = req.params.id;
      const studentdata = await Student.findById(id);

      if (!studentdata) {
        console.log("No student found");
      }

      res.render("crud/view", {
        title: "Student Details Page",
        student: studentdata,
      });
      // res.redirect("/student");
    } catch (error) {
      console.log(error);
    }
  }

  async edit(req, res) {
    try {
      const id = req.params.id;
      const studentdata = await Student.findById(id);

      if (!studentdata) {
        return res.send("No student Data found");
      }

      res.render("crud/update", {
        title: "Update Student page",
        student: studentdata,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;

      const studata = await Student.findById(id);

      if (!studata) {
        return res.send("Student not found");
      }

      let imageName = studata.image;

      if (req.file) {
        // Delete previous image
        if (studata.image) {
          const oldImagePath = path.join(
            __dirname,
            "../../uploads",
            studata.image,
          );

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Save new image name
        imageName = req.file.filename;
      }

      const { name, email, phone, city, state, country } = req.body;

      const updatedstudent = await Student.findByIdAndUpdate(
        id,
        {
          name: name,
          email: email,
          phone: phone,
          city: city,
          state: state,
          country: country,
          image: imageName,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      res.redirect("/student");
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      // Find student first
      const studata = await Student.findById(id);

      if (!studata) {
        return res.status(404).send("Student not found");
      }

      // Delete image if it exists
      if (studata.image) {
        const imagePath = path.join(
          __dirname,
          "../../../uploads",
          studata.image,
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Student image deleted");
        } else {
          console.log("Image not found");
        }
      }
      const deletedstudent = await Student.findByIdAndDelete(id);
      res.redirect("/student");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new StudentEjsController();
