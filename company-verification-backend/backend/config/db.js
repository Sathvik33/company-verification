const { Pool } = require('pg');


const connectionString = "postgresql://postgres:Sathvik@333@localhost:5432/company_module";
// --------------------


// Use the hardcoded connection string for this test
const pool = new Pool({
  connectionString: connectionString, 
  // connectionString: process.env.DB_URL, // The original code is temporarily disabled
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('FATAL: Could not connect to the database. Error:', err.message);
  } else {
    console.log('SUCCESS: Connected to PostgreSQL database.');
  }
});

module.exports = pool;

