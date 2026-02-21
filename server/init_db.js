const db = require('./db');

const initDB = async () => {
    try {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
        await db.query(createTableQuery);
        console.log('Successfully created users table (or it already exists).');
    } catch (err) {
        console.error('Error creating database tables:', err);
    } finally {
        process.exit();
    }
};

initDB();
