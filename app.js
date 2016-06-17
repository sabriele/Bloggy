// DEPENDENCIES
var
	express          = require("express"),
	app              = express(),
	mongoose         = require("mongoose"),
	bodyParser       = require("body-parser"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer");

// APP CONFIG
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE MODEL CONFIG
var blogpostSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now }
});
var Blogpost = mongoose.model("Blogpost", blogpostSchema);

// Blogpost.create({ "title": "Test", "image": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-15/e35/12907144_1569180343393705_547276363_n.jpg?ig_cache_key=MTIxNzMyNDI3MTA5NzE1MjQxNg%3D%3D.2", "body": "This is a nice shoe for tests." });

// ROUTES
app.get("/", function(req, res) {
	res.redirect("/blogposts");
});

/* 1.INDEX */
app.get("/blogposts", function(req, res) {
	Blogpost.find({}, function(err, blogposts) {
		if (err) {
			console.log("Error.");
		} else {
			res.render("index", { blogposts: blogposts });
		}
	});
});

/* 2.NEW */
app.get("/blogposts/new", function(req, res) {
	res.render("new");
});

/* 3.CREATE */
app.post("/blogposts", function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blogpost.create(req.body.blogpost, function(err, successMessage) {
		if (err) {
			res.render("new");
		} else {
			res.redirect("/blogposts");
		}
	});
});

/* 4.SHOW */
app.get("/blogposts/:id", function(req, res) {
	Blogpost.findById(req.params.id, function(err, foundBlogpost) {
		if (err) {
			res.redirect("/blogposts");
		} else {
			res.render("show", { blogpost: foundBlogpost });
		}
	});
});

/* 5.EDIT */
app.get("/blogposts/:id/edit", function(req, res) {
	Blogpost.findById(req.params.id, function(err, foundBlogpost) {
		if (err) {
			res.redirect("/blogposts");
		} else {
			res.render("edit", { blogpost: foundBlogpost });
		}
	});
});

/* 6.UPDATE */
app.put("/blogposts/:id", function(req, res) {
	req.body.blogpost.body = req.sanitize(req.body.blogpost.body);
	Blogpost.findByIdAndUpdate(req.params.id, req.body.blogpost, function (err, updatedBlogpost) {
		if (err) {
			res.redirect("/blogposts/" + req.params.id + "/edit");
		} else {
			res.redirect("/blogposts/" + req.params.id);
		}
	});
});

/* 7.DELETE */
app.delete("/blogposts/:id", function(req, res) {
	Blogpost.findByIdAndRemove(req.params.id, function(err, deletedBlogpost) {
		if (err) {
			res.redirect("/blogposts/:id");
		} else {
			res.redirect("/blogposts");
		}
	});
});

// SERVER
var PORT_NUM         = process.env.PORT || 3000;
var SERVER_START_MSG = "*Server is up and running on port " + PORT_NUM + "!*";

app.listen(PORT_NUM, function() {
	console.log(SERVER_START_MSG);
});
