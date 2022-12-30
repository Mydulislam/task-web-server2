const express = require('express');
const cors = require('cors');

// mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');

// .env file for read
require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());

//userId: task_portal
// password: fqEQtR2cjnmcRPqA

//database connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bugesq5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const userCollection = client.db('taskPortal').collection('users');
        const addTaskCollection = client.db('taskPortal').collection('addTask');

        // User ke database e store korar jonno
        app.post('/users', async(req, res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // Tasks add korar jonno
        app.post('/addtasks', async(req, res)=>{
            const tasks = req.body;
            const result = await addTaskCollection.insertOne(tasks);
            res.send(result)
        })

        // Je email ala gulo add tasks korece
        app.get('/mytasks', async(req, res)=>{
            const email = req.query.email;
            const query = {email:email};
            const myAddingTasks = await addTaskCollection.find(query).toArray();
            res.send(myAddingTasks)
        })

        // Task delete
        app.delete('/mytasks/:id',async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await addTaskCollection.deleteOne(filter);
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(console.log())


//Testing Purpose
app.get('/', async(req, res)=>{
    res.send('The Sever running')
})

app.listen(port, ()=>{
    console.log('The server on port', port);
})