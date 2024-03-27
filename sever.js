require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const model = require('./model')
const auth = require('./auth')


app.use(express.json());

// Connect to MongoDB
//test
mongoose.connect(process.env.BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define a route
app.get('/', async (req, resp) => {
    try {
        const password = req.body.password
        const email = req.body.email
        const checkemail = await model.findOne({ email })

        if (checkemail) {
            resp.status(405).json({ success: false, message: 'Email is already registered' })
        } else {
            if (password) {
                const userdata = new model({
                    //   name: req.body.name,
                    email: req.body.email,
                    //   contact: req.body.contact,
                    password: req.body.password
                    //   confirmpassword: req.body.repass,
                })
                const token = await userdata.generateAuthToken()
                resp.cookie("jwt", token, {
                    expires: new Date(Date.now() + 5259600000),
                    httpOnly: true,
                    sameSite: 'Strict'
                });
                const registered = await userdata.save()
                resp.status(200).json({ success: true, message: 'register successful' });
            } else {
                resp.status(402).json({ success: false, message: 'Password do not match' });
            }
        }
    } catch (error) {
        resp.status(401).json({ success: false, message: 'Please try again later' });
    }
});


app.get('/priyanshu', auth, (req, res) => {
    res.send('priyanshu');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
