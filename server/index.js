const path = require("path");
const express = require("express");
const app = express(); // create express app

// https://levelup.gitconnected.com/how-to-render-react-app-using-express-server-in-node-js-a428ec4dfe2b
// https://github.com/myogeshchavan97/express-static-serve

// add middlewares
app.use(express.static(path.join(__dirname, "..", "dist")));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});