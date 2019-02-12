const handleRegister = (req, res, db, bcrypt) =>{
	const {name, email, password } = req.body;

	if(!name || !email || !password){//room for more validation
		return res.status(400).json("Invalid form submission")
	}

	bcrypt.hash(password, null, null, function(err, hash) {
	    // console.log(hash);
	    db.transaction(trx =>{
	    	trx('login')//Create the login record first
	    	.insert({
	    		hash,
	    		email
	    	})
	    	.returning('email')
	    	.then(email =>{
	    		db('users')//then create the user record
		   		.returning('*')//this returns this newly inserted item
		   		.insert({
			   		email: email[0],
			   		name,
			   		joined: new Date()
			   	})
			   	.then(user =>{
			   		res.json(user[0]);//Because it returns an array of objects having only one element
			   	})
			   	.catch(err =>{
			   		res.status(400).json("Unable to register");
			   	});
	    	})//response from email creation
	    	.then(trx.commit)
	    	.catch(trx.rollback)
	    })
	});
	
};

const login = (req, res, db, bcrypt) =>{
	const { email, password } = req.body;
	if(!email || !password){//room for more validation
		return res.status(400).json("Invalid form submission")
	}
	db.select('*').from('login')
	.where('email', '=', email)//check the email
	.then(data =>{
		// Load hash from your password DB.
		bcrypt.compare(password, data[0].hash, function(err, response) {
			// console.log(data[0].hash	)
		    if(response){
				return db.select('*').from('users')//fetch the user
					.where('email', '=', email)
					.then(user =>{
						res.json(user[0])
					})
					.catch(err =>{
						res.status(400).json("Unable to fetch user");
					})
			}else{
				res.status(400).json("Invalid credentials");
			}
		});	
	}).catch(err=>{
		console.log(1)
		res.status(400).json("Error signing in");
	})

};

const getProfile = (req, res, db) =>{
	const { id } = req.params;
	let found = false;
	db.select('*').from('users').where({id})
	.then(user=>{
		if(user.length){
			res.json(user[0])
		}else{
			res.status(400).json("User not found");
		}
	})
}

module.exports = {
	handleRegister,
	login,
	getProfile
}