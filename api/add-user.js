const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const { name, email } = req.body;
  
  // Use the environment variable to get the connection string
  // In development, you can use .env file with the string: 
  // MONGODB_URI=mongodb+srv://rtalhaonline:SbRerkXKr4zr1yjR@cluster0.kjkn6gf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  const uri = process.env.MONGODB_URI;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("studentsDB");
    const collection = db.collection("users");

    await collection.insertOne({ name, email, timestamp: new Date() });
    res.status(200).json({ message: "User added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
};
