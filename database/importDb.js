const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function importSql() {
  console.log(' Connecting to local MySQL on localhost:3306...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log(' Connected! Reading rotaract_nibm_db.sql...');
    const sqlFilePath = path.join(__dirname, '..', 'rotaract_nibm_db.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log(' Executing schema and inserting seed data into phpMyAdmin MySQL...');
    await connection.query(sql);

    console.log('========================================================');
    console.log(' ✅ DATABASE & TABLES CREATED SUCCESSFULLY IN PHPMYADMIN!');
    console.log(' Database: `rotaract_nibm_db`');
    console.log(' Tables created:');
    console.log('   • `users`');
    console.log('   • `events`');
    console.log('   • `event_registrations` (Active bookings)');
    console.log('   • `cancelled_passes`    (Cancelled archive & re-registration requests)');
    console.log('   • `unapproved_emails`   (Unverified & pending candidates)');
    console.log('   • `gallery`             (Board photo uploads)');
    console.log('   • `volunteer_logs`');
    console.log('   • `projects`');
    console.log('   • `avenues`');
    console.log('   • `contact_inquiries`');
    console.log('========================================================');

    await connection.end();
  } catch (err) {
    console.error('❌ MySQL Import Error:', err.message);
    console.log('\nTip: Make sure MySQL is started in XAMPP Control Panel before running this script.');
    console.log('Alternatively, open http://localhost/phpmyadmin/ -> Import -> select rotaract_nibm_db.sql.');
  }
}

importSql();
