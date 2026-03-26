import dotenv from "dotenv";
import { connectDB } from "./database/database.js";
import { sequelize } from "./database/models/index.js";

import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

(async () => {
  console.log("--- STARTING RSHOP BACKEND WITH SEPARATE DATABASES ---");
  
  // Connect to main database (for now)
  await connectDB();
  
  // Test models
  console.log("Testing Sequelize models...");
  try {
    await sequelize.sync({ alter: false });
    console.log("Models initialized successfully!");
  } catch (error) {
    console.error("Error initializing models:", error);
  }
  
  app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
    console.log("SUCCESS: Database system is active and connected.");
  });
})();

// connectDB();

// const server = app.listen(port, () => {
//   console.log(`server is running on http://localhost:${port}`);
// });

// connectDB()
//   .then(() => {

//     app.on("error",(error)=>{
//       console.log("Initial Error: ",error)
//       throw error
//     })

//     app.listen(port, () => {
//       console.log(`server is running on http://localhost:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.log("mysql db connection failed!!!", err);
//   });

// (async () => {
//   const db = await connectDB();

//   db.connect((error) => {
//     if (error) {
//       console.log("Initial Error: ", error);
//       throw error;
//     }

//     const server = app.listen(port, () => {
//       console.log(`server is running on http://localhost:${port}`);
//     });
//   });
// })();
