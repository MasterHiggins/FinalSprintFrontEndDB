const express = require("express")
const app = express();
const session = require('express-session')
const PORT = process.env.PORT || 3000
global.DEBUG = true

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));

app.listen(PORT,(err)=>{
    if(err)console.log(err)
    console.log(`app on ${PORT}`)
})
//note to add event emiters .get's need to be async
app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/login',(req,res)=>{
    res.render('login')
})