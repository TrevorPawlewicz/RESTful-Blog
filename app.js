var bodyParser       = require('body-parser');
var methodOverride   = require('method-override'); // HTML forms only use GET and POST req
var expressSanitizer = require('express-sanitizer'); //
var mongoose         = require('mongoose');
var express          = require('express');
var app              = express();

// APP Config -----------------------------------------------------------------
mongoose.connect('mongodb://localhost/restful_blog_app'); // for mongo database
app.set('view engine', 'ejs'); // direct ejs's to view folder
app.use(express.static('public')); // directs express to our public folder
app.use(bodyParser.urlencoded({extended: true})); // parses data into JS
app.use(expressSanitizer); // must go after body-parser
app.use(methodOverride('_method')); // for treating requests as PUT requests
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
// test-o
// Blog.create({
//     title: "Test Blog",
//     image: "http://www.olmblog.com/wp-content/plugins/wp-o-matic/cache/1a60f83fa6_caution-300x212.jpg",
//     body: "This is only a test..."
// });


// RESTful ROUTES -------------------------------------------------------------
//
app.get('/', function(req, res){
    res.redirect('/blogs');
});
// INDEX route ----------------------------------------------------------------
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogData){
        if (err) {
            console.log(err);
        } else {
            res.render('index', {blogs: blogData});
        }
    })
});

// NEW route ------------------------------------------------------------------
app.get('/blogs/new', function(req, res){
    res.render('new');
});

// CREATE route ---------------------------------------------------------------
app.post('/blogs', function(req, res){
    // from <textarea name="blog[body]"><%= blog.body %></textarea>
    req.body.blog.body = req.sanitize(req.body.blog.body); // remove all JS

    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    })
});

// SHOW route -----------------------------------------------------------------
app.get('/blogs/:id', function(req, res){
    //   findById is a mongoose method
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect('/blogs');
        } else {
            console.log(Blog);
            res.render('show', {blog: foundBlog});
        }
    });
});

// EDIT route -----------------------------------------------------------------
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect('/blogs');
        } else {
            //                 pass in our info
            res.render('edit', {blog: foundBlog});
        }
    });
});

// UPDATE route ---------------------------------------------------------------
app.put('/blogs/:id', function(req, res){
    // from <textarea name="blog[body]"><%= blog.body %></textarea>
    req.body.blog.body = req.sanitize(req.body.blog.body); // remove all JS

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// DESTROY route --------------------------------------------------------------
app.delete('/blogs/:id', function(req, res){
    //
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});
// RESTful ROUTES -------------------------------------------------------------


//-----------------------------------------------------------------------------
app.listen(3000, function(req, res){
    console.log("...the Blog server has started...");
}); //-------------------------------------------------------------------------
