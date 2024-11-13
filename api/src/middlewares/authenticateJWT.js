import jwt from 'jsonwebtoken';

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(403).json({ message: 'Access Denied: No Token Provided' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: err });
        }
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
};

export default authenticateJWT;
