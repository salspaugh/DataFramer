// a voting function to determine the datatype for a column in a data table
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
