import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { JWT_SECRET } from '../config.js';

// Middleware to verify the JWT token and check if the user is authenticated
const authenticateUser = async (req, res, next) => {
    try {
        // Get token from the header
        const token = req.header('Authorization')?.split(' ')[1]; // Expecting 'Bearer <token>'

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Save the decoded payload to req.user

        // Check if user exists and is approved
        const user = await User.findById(decoded.id);
        if (!user || !user.approved) {
            return res.status(401).json({ message: 'User not approved or does not exist' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
};

// Middleware to check if the authenticated user has the 'admin' role
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next(); // User is an admin, proceed to the next middleware or route handler
};

export { authenticateUser, authorizeAdmin };
