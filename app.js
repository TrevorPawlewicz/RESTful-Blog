var bodyParser = require('body-parser');
var mongoose    = require('mongoose');
var express     = require('express');
var app         = express();
// APP Config -----------------------------------------------------------------
mongoose.connect('mongodb://localhost/restful_blog_app'); // for mongo database
app.set('view engine', 'ejs'); // direct ejs's to view folder
app.use(express.static('public')); // directs express to our public folder
app.use(bodyParser.urlencoded({extended: true})); // parses data into JS
//-----------------------------------------------------------------------------

// MONGOOSE Model config ------------------------------------------------------
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
// mongoose will convert Blog into "blogs" in its database
var Blog = mongoose.model('Blog', blogSchema);
//-----------------------------------------------------------------------------

// RESTful ROUTES -------------------------------------------------------------
//
app.get('/', function(req, res){
    res.render('/blogs');
});
//
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogData){
        if (err) {
            console.log("Error: " + err);
        } else {
            res.render('index.ejs', {blogs: blogData});
        }
    })
});






//-----------------------------------------------------------------------------
app.listen(3000, function(req, res){
    console.log("...the Blog server has started...");
}); //-------------------------------------------------------------------------
