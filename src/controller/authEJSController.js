const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthEjsController {
  async CheckAuth(req, res, next) {
    try {
      if (req.user) {
        next();
      } else {
        return res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async home(req, res) {
    res.render("home", {
      title: "Home",
      page: "home",
      user: req.user || null,
    });
  }

  async register(req, res) {
    try {
      res.render("register", {
        title: "Registration Page",
        page: "register",
        user: null,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async registerCreate(req, res) {
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
      });

      const result = await user.save();
      // console.log("data", result);

      if (result) {
        console.log("Registered successfully");
        return res.redirect("/login");
      } else {
        console.log("Registration failed");
        return res.redirect("/register");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    try {
      res.render("login", {
        title: "Login page",
        page: "login",
        user: null,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loginCreate(req, res) {
    try {
      // GEt user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        console.log("All inputs are required");
        return res.redirect("/login");
      }

      // Validate if user is in the database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const tokendata = await jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "2h",
          },
        );

        if (tokendata) {
          res.cookie("token", tokendata);
          return res.redirect("/dashboard");
        } else {
          console.log("Login failed");
        }
      }

      console.log("Login failed");
      return res.redirect("/login");
    } catch (error) {
      console.log(error);
    }
  }

  async dashboard(req, res) {
    try {
      return res.render("dashboard", {
        title: "Dashboard page",
        page: "dashboard",
        user: req.user,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("token");
      return res.redirect("/login");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new AuthEjsController();
