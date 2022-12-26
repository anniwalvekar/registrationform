const express = require('express');
const mongoose = require("mongoose"); 
const cors = require("cors");
const bcrypt = require ("bcryptjs");
const app = express();
app.use(express.json());
app.use(cors());


const jwt =require("jsonwebtoken");
const JWT_SECRET = "gafdyewbjdshueibfdkjp342673567@&^gfh$hjgd";

mongoose.set('strictQuery', false);
const mongoUrl="mongodb+srv://anita:anita@05@cluster0.wtqlbje.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect("mongodb://localhost:27017/loginform",{
    useNewUrlParser: true,
     
}).then(() =>{
    console.log("connected to database");
}).catch((e) =>console.log(e));

require("./userDetails");
const User = mongoose.model("UserInfo");

 app.post("/register", async(req, res) => {
    const {fname, lname, email, password}= req.body;

    const encryptedPassword = await bcrypt.hash(password,8);
    try{
        const oldUser =await User.findOne({email});

        if(oldUser){
           return res.json({error:"User already exists"});
        }
        await User.create({
            fname,
            lname, 
            email,
            password: encryptedPassword,
        });
        res.send({status: "ok"});
    }catch (error){
        res.send({status:"error"});
    }
});
app.post("/login-user", async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user){
        return res.json({ error: "User not found"});
    }
    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign({ email:user.email }, JWT_SECRET);
        if( res.status(201)){
            return res.json({ status:"ok", data:token});
        } else {
            return res.json({error: "error"});
        }
    }
    res.json({ status:"error", error:"Invalid password"});
});

app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;
        User.findOne({ email: useremail})
        .then((data) => {
            res.send({ status: "ok", data: data});
        })
        .catch((error) => {
            res.send({ status:"error", data: error})
        });
    }
    catch(error){}
});


app.listen(5000,()=>{
    console.log('server started')
});

