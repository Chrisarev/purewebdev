const express = require('express') 
const path = require('path') 
const mongoose = require('mongoose'); ///connection between JS and mongodb
const ejsMate = require('ejs-mate'); ///allows basic boilerplate
const methodOverride = require('method-override') ///allows http verbs other than POST/GET in forms 
const Post = require('./models/post') //require mongoose model campground.js
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

///creates db yelp-camp(or connects to it if already made)
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/pureWebDev';
mongoose.connect(dbUrl, {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:")); 
db.once("open", () => {
    console.log("Database Connected")
});///checks to see if connected and handles db connection error

const app = express(); ///starts express app 

///sets view engine to ejs 
app.set('view engine', 'ejs');  
///so we can run app.js from outside of yelpcamp folder 
app.set('views', path.join(__dirname, 'views')) 
app.use(express.static(path.join(__dirname, 'public'))); 

///allows us to get req.params
app.use(express.urlencoded({extended:true}))
///allows requests other than get/post thru forms  
app.use(methodOverride('_method')) 

app.get('/post/:id',(req,res) =>{
    const id = req.params.id; 
    res.render(`${id}`)
})

app.get('/create', (req,res) =>{
    res.render('create')
})

app.post('/create', async (req,res) =>{
    const post = new Post(req.body.post)
    await post.save()
    res.redirect('/')
})

app.get('/test', (req,res) =>{
    res.render('test')
})

app.get('/contact', (req,res) =>{
    res.render('contact')
})

app.get('/', async (req,res) =>{
    const posts = await Post.find().sort({ _id: -1 }).limit(10); ///gets 10 latest posts
    console.log(posts)
    res.render('home', {posts})
})

app.all('*', (req,res,next) => { ///runs for all unrecognized urls 
    next(new ExpressError('Page Not Found', 404))
    ///passes ExpressError into err param for app.use
})

///this runs if catchAsync catches error and calls next() OR if next(new ExpressError) gets called OR if validation error 
app.use((err,req,res,next) => { 
    const {status = 500} = err; ///gets status and message from ExpressError passed as err, else set defaults
    if(!err.message) err.message = 'Something went wrong!' ///if no error message, set default 
    res.status(status).render('error',{err})
    ///sets response status property to status passed in and renders error template 
})

///listen on heroku specified port or 3000 in dev environment 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () =>{
    console.log('Serving on Port 3000')
})
