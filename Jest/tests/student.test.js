const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../server");
const Student = require("../src/models/studentModel");

describe("Student CRUD API", () => {
  // CREATE STUDENT
  it("should create a student", async () => {
    const res = await request(app).post("/api/student/create").send({
      name: "John Doe",
      city: "New York",
      age: "21",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.data.name).toBe("John Doe");
    expect(res.body.data.slug).toBe("john-doe");
  });

  // GET ALL STUDENTS
  it("should get all students", async () => {
    await Student.create({
      name: "Alice",
      slug: "alice",
      city: "Paris",
      age: "22",
    });

    const res = await request(app).get("/api/students");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.docs.length).toBe(1);
    expect(res.body.data.docs[0].name).toBe("Alice");
  });

  // GET STUDENT BY ID
  it("should get a student by ID", async () => {
    const student = await Student.create({
      name: "Eve",
      slug: "eve",
      city: "Rome",
      age: "20",
    });

    const res = await request(app).get(`/api/student/id/${student._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Eve");
  });

  // GET STUDENT BY SLUG
  it("should get a student by slug", async () => {
    await Student.create({
      name: "David",
      slug: "david",
      city: "London",
      age: "25",
    });

    const res = await request(app).get("/api/student/slug/david");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.slug).toBe("david");
  });

  // UPDATE STUDENT
  it("should update a student", async () => {
    const student = await Student.create({
      name: "Bob",
      slug: "bob",
      city: "Berlin",
      age: "23",
    });

    const res = await request(app)
      .put(`/api/student/update/${student._id}`)
      .send({
        name: "Bobby",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.name).toBe("Bobby");
  });

  // DELETE STUDENT
  it("should delete a student", async () => {
    const student = await Student.create({
      name: "Tom",
      slug: "tom",
      city: "London",
      age: "24",
    });

    const res = await request(app).delete(`/api/student/delete/${student._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Student deleted successfully");

    const check = await Student.findById(student._id);

    expect(check).toBeNull();
  });
});
