const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require("./mongodb");
const User = require("./user")
const PORT = 3001;

const app = express();

// Session creation
app.use(session({
    secret: 'sduh3788994ffcnbidcn',
    resave: false,
    saveUninitialized: true
})); 

// Body-parser middleware for form submission validation
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

// Dummy user data (replace with database)
const users = [
    { username: "Vishnu", password: '$2b$10$.nh0K2NC2eSzGO2qDf5FYeOOdyc/LnBJ5jPf3Oqk8clpjcANsYQE6' } // Hashed password: 'user'
];



// Root route


app.get('/', (req, res) => {
    // const username=req.session.username
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0
    res.setHeader("Expires", "0"); // Proxies
    if (req.session && req.session.authenticated) {
        res.redirect('/home');

    } else {
        res.render('login', { errorMessage: req.query.error });
    }
});
// Login route
    app.post('/login',async(req,res)=>{
    const{username,password}=req.body;
    // const user = users.find(user => user.username===username);
    // if(user && bcrypt.compareSync(password, user.password)){
    //     req.session.authenticated=true
    //     req.session.username=username
        
        
    //     res.redirect('/home');
        
    // }else{
    //     req.session.errorMessage= "Incorrect username or Password";
    //     res.render('login',{errorMessage:req.session.errorMessage})
    // }
        try {
            const user = await User.findOne({username});
            if(!user){
                return res.status(401).json({message:'Invalid username or password'})
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if (!isMatch){
                return res.starus(401).json({message:'Invalid usename or password'});
            }

            req.session.authenticated = true
        } catch (error) {
            
        }
});

// Home route

app.get('/home', isAuthenticated, (req, res) => {
    const username=req.session.username
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0
    res.setHeader("Expires", "0"); // Proxies
    
    res.render('home',{username:username}); 

});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
         
        
        res.redirect('/');
    });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.authenticated) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache"); // HTTP 1.0
        res.setHeader("Expires", "0"); // Proxies
        return next();
    } else {
        res.redirect('/?error=' + encodeURIComponent("You must be logged in to access the home page"));
    }
}


// Server port listener
app.listen(PORT, () => console.log(`Server running on port  http://localhost:${PORT} `));



