const jwt = require("jsonwebtoken")

const isAuth = async (req, res, next) => {
    const token = req.headers["authorization"]?.slice(8);
    
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Access Denied: No Token Provided"
        })
    }

    try {
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifiedUser
        return next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Access Denied: Invalid token`
        });
    }
}

module.exports = isAuth