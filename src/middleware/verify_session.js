const db = require('../db/connection.js');

// Export session verification function as a function -- not object
module.exports = function verifySession(req, res, next) {

    const { username, session_token } = req.cookies;

    if (!session_token) {
        return res.status(401).json({ error: 'Missing session token' });
    }

    db.query('SELECT session_token FROM users WHERE username = ?', [username], ((err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (!rows.length) return res.status(401).json({ error: 'User or session token not found' });

        const result_session_token = rows[0].session_token;

        if (session_token === result_session_token) {

            req.user = { // use this to detach business logic from cookies
                username: username
            };
            return next();
        }

        return res.status(401).json({ error: 'Invalid session token' });
    }));
}

// module.exports = {verifySession}; => this would export the function as an object