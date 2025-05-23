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
    const uri = "mongodb+srv://rtalhaonline:SbRerkXKr4zr1yjR@cluster0.kjkn6gf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    await client.connect();
    console.log("MongoDB connected successfully");
    
    const db = client.db("studentsDB");
    const collection = db.collection("users");

    const result = await collection.insertOne({ name, email, timestamp: new Date() });
    console.log("Document inserted:", result);
    
    await client.close();
    return res.status(200).json({ message: "User added successfully!", success: true });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
