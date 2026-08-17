const fs = require('fs');

const http = require('http');

// Write File:
// fs.writeFile('module.txt', "Welcome to NodeJs..", (err) => {
//     if(err) {
//         throw err;
//     }
//     console.log("Server is running successfully");
// });

// Read File:
// fs.readFile('module.txt', 'utf-8', (err, data) => {
//     if(err) {
//         throw err;
//     }
//     console.log(data);
// });

// Update File:
// fs.appendFile('module.txt', "this is nodejs module", (err) => {
//     if(err) {
//         throw err;
//     }
//     console.log("File updated");
// });

// Rename File:
// fs.rename('module.txt', 'module1.txt', (err) => {
//     if(err) {
//         throw err;
//     }
//     console.log("File name changed");
// });


// Delete File:
// fs.unlink('module1.txt', (err) => {
//     if(err) {
//         throw err;
//     }

//     console.log("File deleted");
// });

const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type': 'text/html'});  // set the content type to HTML
    res.write('<h1>This is HTTP module</h1>');               
    res.end();                                        // end the response
});

server.listen(3002, () => {
    console.log("Server is running successfully");
});