import mysql from 'mysql2';

// Create the rshop database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Harshita@0456',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  
  console.log('Connected to MySQL successfully!');
  
  // Create the database
  connection.query('CREATE DATABASE IF NOT EXISTS rshop', (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
    } else {
      console.log('Database "rshop" created or already exists!');
    }
  });
  
  connection.end();
});
