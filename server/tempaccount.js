Meteor.methods({
	tempAccount: function (){
		// create an account
		var newId = Random.id(),
			username = "user-" + newId
			;

		var userId = Accounts.createUser({
			username: username,
			password: newId
		});

		// preload the account with some data
		var csvFiles = ['faa-on-time-performance-sample.csv', 'faa-wildlife-strike-clean.csv'];
		
		_.each(csvFiles, function(name){
			CSV()
			.from.string(Assets.getText(name))
			.to.array(Meteor.bindEnvironment(function(data){
		        // need to bind Meteor environment to callbacks in other libraries
		        var dataset = {
		        	"user_id": userId,
		        	"name": name.slice(0,-4),
	                "rowCount": data.length - 1, // subtract the header row
	                "questions": []
	            };

	            // add to database or replace existing with same name
	            var d_id = Datasets.insert(dataset);

	            // convert rows to columns
	            var cols = _.zip.apply(_, data);
	            // convert arrays to objects, separate name from values
	            _.each(cols, function(v,i,a){
	            	a[i] = {
	            		"user_id": userId,
	            		name: v[0],
	            		values: [],
	            		'orig_values': _.rest(v),
	            		'dataset_id': d_id
	            	};
	            });

	            // detect the datatype
	            _.each(cols, function(col){
	                // some manual overrides for ambiguous variables
	                if (name == 'faa-on-time-performance-sample.csv' && col['name'] == "Year") {
	                	col['datatype'] = "string";
	                } else if (name == 'faa-wildlife-strike-clean.csv' && col['name'] == "BIRDS_STRUCK") {
	                	col['datatype'] = "string";
	                } else {
	                	var datatype = detectDataType(col.orig_values);
	                	col['datatype'] = datatype[0];
	                }

	                // cast numbers and dates before storing
	                if (col['datatype'] == 'float'){
	                	col = processFloat(col);

	                } else if (col['datatype'] == 'integer') {
	                	col = processInt(col);

	                } else if (col['datatype'] == 'string') {
	                	col = processString(col);

	                } else if (col['datatype'] == 'date') {
	                	col = processDate(col);
	                }

	                col.notes = null;

	                Columns.insert(col);
	            });
			}));
		})
		

		// set a timer to delete this account after self-destruct period ends
		var seconds = 60 * 60,
			selfDestruct = 1000 * seconds; // in ms
		Meteor.setTimeout(function(){
			// delete user - this will log the client out immediately
			Meteor.users.remove({_id: userId});
			// delete the user's data also
			Datasets.remove({user_id: userId});
			Columns.remove({user_id: userId});
			Questions.remove({user_id: userId})
		}, selfDestruct);

		// return newId so the client can log in
		return newId;
	}
});