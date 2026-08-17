class ContactController {
  contact(req, res) {
    res.send("<h2 style='color: blue; text-align: center;'>Welcome to Contact Page</h2>");
  }
}

module.exports = new ContactController();