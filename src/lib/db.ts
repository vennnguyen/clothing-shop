import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',       // sửa theo config của bạn
  user: 'root',            // user mysql của bạn
  password: 'nguyenngocanhtuan',      // password mysql của bạn
  database: 'quanao', // tên database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
