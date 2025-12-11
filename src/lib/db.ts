// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',       // sửa theo config của bạn
//   port: 3306,
//   user: 'root',            // user mysql của bạn
//   password: '',      // password mysql của bạn
//   database: 'quanao', // tên database
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export default pool;
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
