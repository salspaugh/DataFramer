Meteor.methods({
    'processCsv': processCsv,
    'setupTestData': setupTestData,
    'titanicData': function(){
        // add to admin
        processCsv(Assets.getText('titanic_raw.csv'), 'titanic');

        // add to student1
        var userId = Meteor.users.findOne({username:'student1'})._id;
        CSV()
        .from.string(Assets.getText('titanic_raw.csv'))
        // need to bind Meteor environment to callbacks in other libraries
        .to.array(Meteor.bindEnvironment(function(data){

            var dataset = {
                "user_id": userId,
                "name": "titanic_data",
                "rowCount": data.length - 1, // subtract the header row
                "questions": []
                //{
                //     "id": null,
                //     "text": null,
                //     "notes": null,
                //     "answerable": null,
                //     "col_refs": []
                // }
            };

            // add to database or replace existing with same name
            var d_id = Datasets.insert(dataset);
            console.log('added dataset', 'titanic_raw.csv');

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
                var datatype = detectDataType(col.orig_values);
                col['datatype'] = datatype[0];

                // cast numbers and dates before storing
                if (datatype[0] == 'float'){
                    col = processFloat(col);

                } else if (datatype[0] == 'integer') {
                    col = processInt(col);

                } else if (datatype[0] == 'string') {
                    col = processString(col);

                } else if (datatype[0] == 'date') {
                    col = processDate(col);
                }

                col.notes = null;

                Columns.insert(col);
            });


        }));
    }
});

function processCsv(csvfile, name){
    // var csvfile = CSVs.findOne({'_id': csvfile_id});

    // using collectionFS package
    CSV()
    .from.string(csvfile)
    // need to bind Meteor environment to callbacks in other libraries
    .to.array(Meteor.bindEnvironment(function(data){

        var dataset = {
            "user_id": Meteor.userId(),
            "name": name,
            "rowCount": data.length - 1, // subtract the header row
            "questions": []
            //{
            //     "id": null,
            //     "text": null,
            //     "notes": null,
            //     "answerable": null,
            //     "col_refs": []
            // }
        };

        // add to database or replace existing with same name
        var d_id = Datasets.insert(dataset);
        console.log('added dataset', name);

        // convert rows to columns
        var cols = _.zip.apply(_, data);
        // convert arrays to objects, separate name from values
        _.each(cols, function(v,i,a){
            a[i] = {
                "user_id": Meteor.userId(),
                name: v[0],
                values: [],
                'orig_values': _.rest(v),
                'dataset_id': d_id
            };
        });

        // detect the datatype
        _.each(cols, function(col){
            var datatype = detectDataType(col.orig_values);
            col['datatype'] = datatype[0];

            // cast numbers and dates before storing
            if (datatype[0] == 'float'){
                col = processFloat(col);

            } else if (datatype[0] == 'integer') {
                col = processInt(col);

            } else if (datatype[0] == 'string') {
                col = processString(col);

            } else if (datatype[0] == 'date') {
                col = processDate(col);
            }

            col.notes = null;

            Columns.insert(col);
        });


    }));
}

// utility functions for processor
function detectDataType(items){
    // remove nulls
    var new_items = _.filter(items, function(item, index) {
        return !checkNull(item);
    });

    // randomize the values
    var sample = _.sample(new_items, new_items.length);

    // initialize vote tallies
    var counts = {integer: 0, float: 0, date: 0, number: 0, string: 0};

    _.each(new_items, function(item) {

        // check for alpha and punct
        var chars = _.clone(item).toLowerCase().match(/[a-z$^{[(|)*+?\\]/i);
        if (chars !== null) {
            // vote for string
            counts.string += 1;
        }

        var n = Number(item);
        if (!_.isNaN(n) && chars === null){
            // vote for number
            counts.number += 1;

            // more specific number types
            if (item.indexOf('.') > -1){
                var f = parseFloat(item);
                // vote for float
                counts.float += 1;
            } else {
                var integer = parseInt(item);
                // vote for integer
                counts.integer += 1;
            }
        }

        // requires moment.js package
        if (moment(item).isValid()) {
            // vote for date
            counts['date'] += 1;
        }
    });

    var metrics = _.map(counts, function(value, key) {
        return {name: key, value: value};
    });

    var max = _.max(metrics, function(metric) {
        return metric.value;
    });

    var result = ['string', counts];

    // if no value gets a majority, default to string
    if (max.value > new_items.length / 2){

        // if any members aren't numbers, it's a string
        if ((max.name === 'number' || max.name === 'integer' || max.name==='float') && counts.string === 0){

            // if anything can be parsed as a float, it's a float
            if (counts.float > 0)
                result[0] = 'float';
            else
                result[0] = 'integer';
        }
        else if (max.name === 'date')
            result[0] = 'date';
    }

    return result;
}

function setupTestData(username){
    var userId = Meteor.users.findOne({username:username})._id;
    var csvFiles = ['faa-on-time-performance-sample.csv', 'faa-wildlife-strike-clean.csv'];
    _.each(csvFiles, function(name){
        CSV()
        .from.string(Assets.getText(name))
        // need to bind Meteor environment to callbacks in other libraries
        .to.array(Meteor.bindEnvironment(function(data){
            var dataset = {
                "user_id": userId,
                "name": name.slice(0,-4),
                "rowCount": data.length - 1, // subtract the header row
                "questions": []
            };

            // add to database or replace existing with same name
            var d_id = Datasets.insert(dataset);
            console.log('added dataset', name);

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
                console.log("added column " + col.name + " for dataset " + dataset.name + " for user " + username)
            });
        }));
    })
    return "complete";
}
