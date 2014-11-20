var csvfile = CSVs.findOne();

// using collectionFS package

CSV()
.from(csvfile.createReadStream())
// need to bind Meteor environment to callbacks in other libraries
.to.array(Meteor.bindEnvironment(function(data){

    var dataset = {
        "name": csvfile.name(),
        "rowCount": data.length - 1, // subtract the header row
        "columns": []
    };

    // convert rows to columns
    var cols = _.zip.apply(_, data);
    // convert arrays to objects, separate name from values
    _.each(cols, function(v,i,a){
        a[i] = {
            name: v[0],
            values: _.rest(v)
        };
    });

    // detect the datatype
    _.each(cols, function(col){
        var datatype = detectDataType(col.values);
        col['datatype'] = datatype[0];

        // cast numbers and dates before storing
        if (datatype[0] == 'float'){
            _.each(col.values, function(v,i,a){
                a[i] = checkNull(v, true)? undefined : parseFloat(v);
            });
            // calculate the mean
            var sum = _.reduce(col.values, function(memo, num){
                return memo + num
            }, 0);

            var mean = sum / col.values.length;
            col.mean = roundToPrecision(mean, 2);

            // variance and standard deviation
            var variance = _.reduce(col.values, function(memo, num) {
                return Math.pow(num - mean, 2);
            }) / col.values.length;
            col.variance = roundToPrecision(variance, 3);

            var deviation = Math.sqrt(variance);
            col.stddev = roundToPrecision(deviation, 4);

        } else if (datatype[0] == 'integer') {
            _.each(col.values, function(v,i,a){
                a[i] = checkNull(v, true)? undefined : parseInt(v);

            });
            // calculate the mean
            var sum = _.reduce(col.values, function(memo, num){
                return memo + num
            }, 0);

            var mean = sum / col.values.length;
            col.mean = roundToPrecision(mean, 2);

            // variance and standard deviation
            var variance = _.reduce(col.values, function(memo, num) {
                return Math.pow(num - mean, 2);
            }) / col.values.length;
            col.variance = roundToPrecision(variance, 3);

            var deviation = Math.sqrt(variance);
            col.stddev = roundToPrecision(deviation, 4);

        } else if (datatype[0] == 'date') {
            _.each(col.values, function(v,i,a){
                a[i] = checkNull(v, true)? undefined : moment(v);
            });

            col.values = _.sortBy(col.values); // will this cause problems?

            // formatted for Rickshaw js input
            col.timeSeries = _.each(_.uniq(col.values), function(v,i,a){
                a[i] = {'x': moment(+v.key).unix(), 'y': v.values};
            });

            col.max = _.last(col.values);
            col.min = _.first(col.values);
            col.range = moment.duration(col.max - col.min);
            // NOTE: call humanize() method to get col.range in plain English

            // to determine intervals:
            // check the range,
            // and also make sure the diffs aren't all exactly the next largest interval

            col.intervals = {
                'year': col.max.diff(col.min, 'years') > 0,
                'month': col.max.diff(col.min, 'months') > 0 && _.some(col.values,
                    function(v,i,a){
                        if (a[i+1] != undefined){
                            return v.diff(a[i+1], 'years', true) != v.diff(a[i+1], 'years');
                        } else {
                            return false;
                        }
                }),
                'day': col.max.diff(col.min, 'day') > 0 && _.some(col.values,
                    function(v,i,a){
                        if (a[i+1] != undefined){
                            return v.diff(a[i+1], 'months', true) != v.diff(a[i+1], 'months');
                        } else {
                            return false;
                        }
                }),
                'hour': col.max.diff(col.min, 'hours') > 0 && _.some(col.values,
                    function(v,i,a){
                        if (a[i+1] != undefined){
                            return v.diff(a[i+1], 'days', true) != v.diff(a[i+1], 'days');
                        } else {
                            return false;
                        }
                }),
                'minute': col.max.diff(col.min, 'minutes') > 0 && _.some(col.values,
                    function(v,i,a){
                        if (a[i+1] != undefined){
                            return v.diff(a[i+1], 'hours', true) != v.diff(a[i+1], 'hours');
                        } else {
                            return false;
                        }
                }),
                'second': col.max.diff(col.min, 'seconds') > 0 && _.some(col.values,
                    function(v,i,a){
                        if (a[i+1] != undefined){
                            return v.diff(a[i+1], 'minutes', true) != v.diff(a[i+1], 'minutes');
                        } else {
                            return false;
                        }
                })
            };
             _.each(col.values, function(v,i,a){
                a[i] = checkNull(v, true)? undefined : v.unix();
            });
        }

        // store the set of unique values
        col.set = _.uniq(col.values);

        // store count of nulls
        col.nulls = _.reduce(col.values, function(memo, v){
            return _.isUndefined(v)? memo + 1 : memo;
        }, 0);

    });

    dataset["columns"] =  cols;

    // add to database
    Datasets.insert(dataset);
}));


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

function checkNull(value, exclude_empty){
    return _.isUndefined(value) || _.isNaN(value) || _.isNull(value) || value === 'None'
    || value === 'null' || (value==='' && exclude_empty);
}


function roundToPrecision(number, places){
    var multiplier = Math.pow(10, places);
    return Math.round(number * multiplier) / multiplier;
}
