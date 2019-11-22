const mysql = require("mysql2");
const httpServer = require('http');
const fileSystemReader = require('fs');
const port = 3000;
const {exec} = require('child_process');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "mydb",
    password: "VisionMalaxy"
});

connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    } else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});



const requestHandler = (request, response) => {
    if (request.url.search("/play") !== -1) {
        connection.query(`SELECT path FROM main WHERE id = ${request.url.split("=")[1]}`, function (err, results, fields) {
            if (!err) response.end("Success");
            else response.end("Database error");
            exec(results[0].path);
        });

    } else if (request.url === "/exitApp") {
        connection.end(function (err) {
            if (err) {
                return console.log("Ошибка: " + err.message);
            } else {
                console.log("Подключение к базе закрыто");
            }
        });
        server.close()
        console.log("HTTP сервер остановлен");
        process.exit();

    } else if (request.url === "/getMusic") {
        connection.query("SELECT * FROM main",
            function (err, results, fields) {
                response.end(JSON.stringify(results));
            });
    } else if (request.url.search(".png") !== -1 || request.url.search(".ico") !== -1) {
        fileSystemReader.readFile('.' + request.url, function (err, data) {
            response.writeHead(200, {'Content-Type': 'image/jpg'});
            response.end(data, 'Base64');
        })
    } else if (request.url === "/") {
        fileSystemReader.readFile('./index.html', 'utf8', function (err, text) {
            response.end(text);
        });
    } else {
        fileSystemReader.readFile('.' + request.url, 'utf8', function (err, text) {
            response.end(text);
        });
    }
};

const server = httpServer.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('There are some errors: ', err)
    }
    console.log(`Сервер запущен на порту: ${port}`)
});