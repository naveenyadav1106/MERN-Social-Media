import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
    try {

        // Extract JWT token from request header sent by the client-side
        let token = req.header('Authorization');

        // If token is not provided, return 403 Forbidden
        if (!token) {
            return res.status(403).send("Access denied");
        }

        // Remove 'Bearer' prefix from token (if present)
        if (token.startsWith("Bearer")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // Verify JWT token with secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Attach verified user information to request object
        req.user = verified;

        // Proceed to the next middleware
        next();

    } catch (error) {
        // If verification fails, return 500 Internal Server Error
        res.status(500).json({ error: error.message });
    }
};
