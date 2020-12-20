// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || "0.0.0.0";
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

// var cors_proxy = require("cors-anywhere");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use("/stock", require(__dirname + "/routes/stock"));

app.use("/", (req, res) => {
  res.send("hello");
});
// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });

app.listen(port, () => {
  console.log(`app start on ${port}`);
});
