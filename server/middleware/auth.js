const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // The token format should be: Bearer <token>
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
        }

        // Attach the decoded user payload to the request
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
