class HomeController {
  home(req, res) {

    const user = {
      name: "Saumyajit",
      email: "sj@gmail.com",
      course: "Node JS",
      city: "Kolkata"
    }

    res.render('index', {
      title: 'Home Page',
      data: user
    });
  }

  async about(req, res) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await response.json();

      res.render('about', {
          title: 'About page',
          users: users
      });

    } catch(err) {
      console.log(err);
      
      res.render('about', {
        title: 'About Page',
        users: users
      });
    }
  }

  card(req, res) {
  
        const cardUser = [
            {id:1, name: "Saumyajit", course: "NodeJS"},
            {id:2, name: "Swarnendu", course: "MEAN"},
            {id:3, name: "Abhishek", course: "ReactJS"},
            {id:4, name: "Kalyan", course: "MERN"},
            {id:5, name: "Suman", course: "Digital Marketing"},
            {id:6, name: "Indrajit", course: "NodeJS"},
            {id:7, name: "Abdul", course: "MERN"},
            {id:8, name: "Riya", course: "ReactJS"},
            {id:9, name: "Sagnik", course: "Java"},
            {id:10, name: "Amrita", course: "MERN"},
            {id:11, name: "Sagar", course: "ReactJS"},
            {id:12, name: "Amit", course: "Digital Marketing"},
            {id:13, name: "Naman", course: "Python"},
            {id:14, name: "Aditya", course: "MEAN"},
            {id:15, name: "Nicole", course: "Python"},
        ]

        res.render('card', {
            title: 'Card Page',
            data: cardUser
        });
    }

    add(req, res) {
      res.render('add', {
        title: 'Add Student Page',
      });
    }
    update(req, res) {
      res.render('update', {
        title: 'Update Student Page',
      });
    }
    list(req, res) {
      res.render('list', {
        title: 'List Student Page',
      });
    }
    view(req, res) {
      res.render('view', {
        title: 'View Student Page',
      });
    }
  }




module.exports = new HomeController();
