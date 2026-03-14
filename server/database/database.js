import mysql from "mysql2/promise";

let databaseInstance;

const connectDB = async () => {
  try {
    console.log("Initializing MySQL connection pool...");
    databaseInstance = mysql.createPool({
      host: process.env.HOST,
      user: process.env.USER,
      database: process.env.NAME,
      password: process.env.PASS,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
    
    // Test the connection
    const connection = await databaseInstance.getConnection();
    console.log(`mysql Database Pool Created and Tested...!!! HOST: ${process.env.HOST}`);
    connection.release();
    
    return databaseInstance;
  } catch (error) {
    console.error("mySQL Connection Error...!!!", error);
    process.exit(1);
  }
};

const connectEndDB = async () => {
  try {
    if (databaseInstance) {
      await databaseInstance.end();
      console.log("mysql Database Connection Pool Ended..!");
    }
  } catch (error) {
    console.log("mySQL Connection Error", error);
    process.exit(1);
  }
};

export { connectDB, connectEndDB, databaseInstance };


// database promise function

/* const connectDB = async () => {
  try {
    await new Promise((resolve, reject) => {
      databaseInstance.connect((err) => {
        return err
          ? reject(
              console.log("Error While Connection to Mysql...!!!", err),
              process.exit(1)
            )
          : resolve(
              console.log(
                `mysql Databse Connected...!!! HOST: ${databaseInstance.config.host}`
              )
            );
      });
    });
  } catch (error) {
    console.log("mySQL Connection Error...!!!", error);
    process.exit(1);
  }
};

*/

// const connectDB = async () => {
//   try {
//     databaseInstance.connect(function (err) {
//       if (err) {
//         console.log("Error While Connection to Mysql...!!!");
//         process.exit(1);
//       }

//       console.log(
//         `mysql Databse Connected...!!! HOST: ${databaseInstance.config.host}`
//       );
//     });

//   } catch (error) {
//     console.log("mySQL Connection Error...!!!", error);
//     process.exit(1);
//   }
// };

// const connectEndDB = async () => {
//   try {
//     databaseInstance.end(function (err) {
//       if (err) {
//         console.log("Error While Closing Connection to Mysql....");
//         process.exit(1);
//       }
//     });

//     console.log("mysql Databse Connection Ended..!");
//   } catch (error) {
//     console.log("mySQL Connection Error", error);
//     process.exit(1);
//   }
// };

// export { connectDB, connectEndDB };

// await databaseInstance.connect((err) => {
//   if (!err) console.log("mysql Databse Connected..!");
//   else console.log("mysql not connect",err);
// });

// const mysql = require("mysql");
// const dotenv = require('dotenv');

// dotenv.config({ path: "configuration/config.env" });

//   const db = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     database: process.env.NAME,
//     password: process.env.PASS,
//   });
//   db.connect((err) => {
//     if (!err) console.log("connected");
//     else console.log(err);
//   });

// module.exports = db;
