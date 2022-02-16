const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(
  "mongodb+srv://user123:user123@cluster.s7w00.mongodb.net/UserRegistration?retryWrites=true&w=majority"
);

const userSchema = {
    name: String,
    emailId: String,
    password: String,
    city: String,
    dob: String,
}

const User = mongoose.model('User', userSchema);

app.post('/register', (req, res) => {

    let current = new Date();
    let date = current.getDate();
    let month = current.getMonth() + 1;
    let year = current.getFullYear();

    let userdob = req.body.dob.split('-');
    
    let diffyear = year - userdob[0];
    let diffmonth = month - userdob[1];
    let diffdate = date - userdob[2];

    let condition;

    if (diffyear > 14) {
        condition = true;
    } else if (diffyear == 14) {
        if (diffmonth > 0) {
            condition = true;
        } else if (diffmonth == 0) {
            if (diffdate >= 0) {
                condition = true;
            } else {
                condition = false;
            }
        } else {
            condition = false;
        }
    } else {
        condition = false;
    }

    if (!condition) {
        res.send({message:'Age should be above 14 years'});
    } else {    
        const user = new User ({
            name: req.body.name,
            emailId: req.body.email,
            password: req.body.password,
            city: req.body.city,
            dob: req.body.dob
        });
        
        user.save();
        res.send({message:'User has been registered successfully'});
    }

});

app.get('/userData', (req, res) => {
    User.find({}, (err, data) => {
        if (err) {
            res.send({message:`Couldn't connect to database`});
        } else {
            res.send(data);
        }
    });
});

const port  = 8080;

app.listen(port, () => console.log(`Listening on port ${port}...`));