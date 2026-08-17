class AboutController {
  about(req, res) {
    res.send("<h2 style='color: green; text-align: center;'>Welcome to About Page</h2>");
  }
}

module.exports = new AboutController();