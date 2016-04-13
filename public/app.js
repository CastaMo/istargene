var express = require('express');
var app = express();
var logger = require('morgan');
var passport = require("passport");
var route = require("./routes")(passport);



app.use(express.static('bin'));
app.set('views', './src/jade');
app.set('view engine', 'jade');


app.use(logger("dev"));

app.use(require('connect-livereload')({
    port: 35729
}));

app.use(route);

app.disable('etag');

app.listen(3000, function() {
    console.log('Server listening on port 3000');
});