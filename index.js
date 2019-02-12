const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');//USed to allow interaction across different origins in the browser
const user = require('./controllers/userController');
const image = require('./controllers/imageController');
const CLARIFAI_KEY = process.env.CLARIFAI_KEY;

var db = require('knex')({// Used for connecting to sql databases. It needs postgres cli to work too
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT ? process.env.PORT : 3001;

app.get('/', (req, res) =>{
	res.json('Hey sorcerer, shoot me a spell!')
});

app.post('/signin', (req, res) => { user.login(req, res, db, bcrypt) });

app.post('/register', (req, res) => { user.handleRegister(req, res, db, bcrypt) });//Passing the params into this controller is called dependency injection

app.get('/profile/:id', (req, res) =>{ user.getProfile(req, res, db) })

app.put('/image', (req, res) => { image.identify(req, res, db) });

app.post('/imageAPI', (req, res) => { image.handleApiCall(req, res, CLARIFAI_KEY) });


app.listen(PORT, () =>{
	console.log(`Your app is listening on port ${PORT}`)
})