const jwt = require("jsonwebtoken");

const AuthCheck = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            req.user = null;
            return next();
        }

        req.user = decoded;
        next();
    });
};

module.exports = AuthCheck;