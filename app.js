require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const DBConnect = require("./src/config/dbconnect");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

DBConnect();

const app = express();

const Port = process.env.PORT || 3007;

app.use(cors());

app.use(cookieParser());
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create a static folder
app.use(express.static("public"));

//static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));



// EJS routers:
const studentejsRoute = require("./src/router/studentejsRoute");
app.use(studentejsRoute);

const AuthEjsRouter = require("./src/router/authEJSRoute");
app.use(AuthEjsRouter);


// Student route
const studentroute = require("./src/router/api/student.api");
app.use("/api", studentroute);

// Auth route
const authRouter = require("./src/router/api/authRoute");
app.use("/api", authRouter);

// Index route:
const indexRoute = require("./src/router/api/indexRoute");
app.use('/api', indexRoute);

// Admin route
const adminRouter = require("./src/router/api/adminRoute");
app.use("/admin/api", adminRouter);

// Teacher route
const teacherRouter = require("./src/router/api/teacherRoute");
app.use("/teacher/api", teacherRouter);

// const homeRoute = require('./src/router/homeroute')
// app.use(homeRoute);

// const aboutRoute=require('./src/router/aboutroute')
// app.use(aboutRoute);

// const contactRoute=require('./src/router/contactroute')
// app.use(contactRoute);

// Setup EJS
app.set("view engine", "ejs");
app.set("views", "views");

app.listen(Port, () => {
  console.log(`Server is running on port: ${Port}`);
});
