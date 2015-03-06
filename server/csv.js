var DATATYPE_SORT_IDX = {
  "string": 0,
  "integer": 1,
  "float": 2,
  "date": 3,
  "time": 4
};

Meteor.methods({
    'processCsv': processCsv,
});

function processCsv(csvfile, name){

    // using collectionFS package
    CSV().from.string(csvfile)
    // need to bind Meteor environment to callbacks in other libraries
    .to.array(Meteor.bindEnvironment(function(data){

        var dataset = {
            "user_id": Meteor.userId(),
            "name": name,
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
                "user_id": Meteor.userId(),
                name: v[0],
                values: [],
                'orig_values': _.rest(v),
                'dataset_id': d_id
            };
        });
        
        // detect the datatype
        _.each(cols, function(col) {
            var datatype = detectDataType(col.orig_values);
            col['datatype'] = datatype[0];
            col['datatypeIdx'] = DATATYPE_SORT_IDX[datatype[0]];

            // cast numbers and dates before storing
            if (datatype[0] == 'float'){
                col = processFloat(col);

            } else if (datatype[0] == 'integer') {
                col = processInt(col);

            } else if (datatype[0] == 'string') {
                col = processString(col);

            } else if (datatype[0] == 'date') {
                col = processDate(col);

            } else if (datatype[0] == 'time') {
                col = processTime(col);
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
    var counts = {integer: 0, float: 0, date: 0, number: 0, string: 0, time: 0};

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

        time = item.match(/(\d:[0-5]\d)|([0-1]\d:[0-5]\d)/i);
        if (time != null) {
            counts.time += 1;
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
        else if (max.name == 'time')
            result[0] = 'time';
    }

    return result;
}
