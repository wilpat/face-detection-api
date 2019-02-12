const Clarifai = require('clarifai');

var app;
let setKey = (key) =>{//fxn for setting the apiKey
	 app = new Clarifai.App({
	 apiKey: key
	});
}


const identify = (req, res, db) =>{
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries =>{
			res.json(entries[0])
		})
		.catch(err =>{
			res.status(400).json('Error getting number of enteries')
		})
}

const handleApiCall = (req, res, key) =>{
	setKey(key);//set the key
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data =>{
		return res.json(data);
	})
	.catch(err =>{
		// console.log(err)
		return res.status(400).json(err)
	})
}

module.exports ={
	identify,
	handleApiCall
}