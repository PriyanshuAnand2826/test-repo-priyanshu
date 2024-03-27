const jwt = require("jsonwebtoken")
const model = require("./model")


const auth = async (req, resp, next) => {
    try {
        const token = req.body.jwt;
        console.log(req.body);
        const verify = jwt.verify(token, process.env.secretkey)
        const user = await model.findOne({ _id: verify._id })

        console.log("user details", user);
        next();

    } catch (error) {
        resp.status(401).send("you are not validate user ")
    }
}

module.exports = auth
