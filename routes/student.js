const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');


var app = express.Router();


const client = new MongoClient('mongodb://127.0.0.1:27017/assignment4', { useNewUrlParser: true, useUnifiedTopology: true });

const databaseName = 'assignment4';
const collectionName = 'student';


app.use(express.json());

app.get('/add',function(req, res, next) {
  console.log("123");
    res.render('student/student_add');    
});

// Route to store data in MongoDB
app.post('/add', async (req, res) => {
  try {
    await client.connect();
    console.log('Connected to the database');

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Data sent in the request body
    const dataToInsert = req.body;

    // Insert data into the collection
    const result = await collection.insertOne(dataToInsert);

    //console.log(`Inserted ${result.insertedCount} document into the collection`);
    res.redirect("/student/display");
    //res.status(201).send('Data stored successfully');
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
    console.log('Connection closed');
  }
});

app.get('/display', async (req, res) => {
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to the database');

    // Access the specific database and collection
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Retrieve all documents from the collection
    const cursor = collection.find();

    // Convert cursor to array and send the data as JSON
    const data = await cursor.toArray();
    //res.json(data);
    res.render("student/student_display", { db_rows_array: data });
  } catch (error) {
    console.error('Error connecting and retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the connection when done
    await client.close();
    console.log('Connection closed');
  }
});

app.get('/edit/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName); 
    const id = new ObjectId(req.params.id);
   
    // Find document by ID
    const document = await collection.findOne({ _id: id });
    // res.render("department/department_edit", { db_rows_array: document });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    //res.json(document);
    res.render("student/student_edit", { db_rows_array: document });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});


app.post('/edit/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const id = new ObjectId(req.params.id);
// Update the document by ID
const result = await collection.updateOne({ _id: id },{ $set: {fname:req.body.fname,lname:req.body.lname,city:req.body.city,age:null,address:req.body.address,email:req.body.email,mobile:req.body.mobile}});
res.redirect("/student/display");

    //res.redirect('/success'); // Redirect to success page
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});


app.get('/show/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName); 
    const id = new ObjectId(req.params.id);
   
    // Find document by ID
    const document = await collection.findOne({ _id: id });
    // res.render("department/department_edit", { db_rows_array: document });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    //res.json(document);
    res.render("student/student_show", { db_rows_array: document });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

// Define a route to delete a document by ID
app.get('/delete/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const id = req.params.id;

    // Use ObjectId to convert the string ID to a MongoDB ObjectId
    const objectId = new ObjectId(id);

    const result = await collection.deleteOne({ _id: objectId });
    res.redirect("/student/display");
    /*if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Document deleted successfully' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }*/
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

module.exports = app;