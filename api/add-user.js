const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  // Add CORS headers to allow requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed", method: req.method });

  try {
    const { name, email } = req.body;
    
    // Use hardcoded connection string instead of environment variable for testing
    const uri = "mongodb+srv://rtalhaonline:SbRerkXKr4zr1yjR@cluster0.kjkn6gf.mongodb.net/studentsDB?retryWrites=true&w=majority&appName=Cluster0";
    
    console.log("Connecting to MongoDB...");
    
    // Update MongoDB client instantiation with more explicit options
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    try {
      await client.connect();
      console.log("MongoDB connected successfully");
      
      const database = client.db("studentsDB");
      const collection = database.collection("users");

      // Add data validation
      if (!name || !email) {
        throw new Error("Name and email are required");
      }

      const newUser = { 
        name, 
        email, 
        timestamp: new Date(),
        createdAt: new Date().toISOString() 
      };
      
      console.log("Attempting to insert document:", newUser);
      const result = await collection.insertOne(newUser);
      
      console.log("Document inserted with ID:", result.insertedId);
      
      return res.status(200).json({ 
        message: "User added successfully!", 
        success: true,
        userId: result.insertedId 
      });
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      return res.status(500).json({ 
        message: "Database operation failed", 
        error: dbError.message
      });
    } finally {
      // Make sure to close the client connection
      await client.close();
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Server error:", error.message, error.stack);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message
    });
  }
};
