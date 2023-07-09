const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization){
        token = req.session.authorization['accessToken'];
        jwt.verify(token, 'access', (err,user) => {
            if(err) throw err;
            if(user){
                console.log("HIIII");
                req.user = user;
                next()
            }
            else{
                res.status(403).json({message: "User not authenticated"})
            }
        })
    }
//Write the authenication mechanism here
});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
