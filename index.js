const express = require('express') 
const path = require('path') 
const mongoose = require('mongoose'); ///connection between JS and mongodb
const ejsMate = require('ejs-mate'); ///allows basic boilerplate
const methodOverride = require('method-override') ///allows http verbs other than POST/GET in forms 
const Post = require('./models/post') //require mongoose model campground.js


mongoose.connect('mongodb://localhost:27017/pureWebDev', {
    useNewUrlParser:true,
    useUnifiedTopology:true
});///creates db yelp-camp(or connects to it if already made)

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:")); 
db.once("open", () => {
    console.log("Database Connected")
});///checks to see if connected and handles db connection error

const app = express(); ///starts express app 

//app.engine('ejs', ejsMate); ///allows basic boilerplate
app.set('view engine', 'ejs');  ///sets view engine to ejs 
app.set('views', path.join(__dirname, 'views')) ///so we can run app.js from outside of yelpcamp folder 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(express.urlencoded({extended:true})) ///allows us to get req.params 
app.use(methodOverride('_method')) ///allows requests other than get/post thru forms 


app.get('/post', (req,res) =>{
    res.render('1')
})
app.get('/2', (req,res) =>{
    res.render('2')
})
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

app.listen(3000, () =>{
    console.log('Serving on Port 3000')
})
