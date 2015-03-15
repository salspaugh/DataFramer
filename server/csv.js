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

function checkIsTime(item) {
  var t = _.clone(item).match(/(\d\d\d\d)|(\d\d:\d\d)|(\d\d:\d\d:\d\d) ?(am|pm)?/i);
  if (t != null) {
      t = t.replace(":", "");
      var h = parseInt(t.substr(0,2))
        , validHours = (h >= 0 && h <= 24)
        , m = parseInt(t.substr(2,4))
        , validMinutes = (m >= 0 && m <= 60)
        , s = parseInt(t.substr(4,6))
        , validSeconds = ((_.isNaN(s)) || (s >= 0 && s <= 60));
      if (validHours && validMinutes && validSeconds) return true;
      return false;
  }
  return false;
}

var MONTHS = [
  "january", "jan",
  "february", "feb",
  "march", "mar",
  "april", "apr",
  "june", "jun",
  "july", "jul",
  "august", "aug",
  "september", "sept", "sep",
  "october", "oct",
  "november", "nov",
  "december", "dec"
];

var TIMEZONE_ABBRS = ["a", "acdt", "acst", "act", "acwst", "adst", "adt", "aedt", "aest", "aet", "aft", "akdt", "akst", "almt", "amdt", "amst", "amt", "anast", "anat", "aoe", "aqtt", "art", "asia", "ast", "at", "awdt", "awst", "azodt", "azost", "azot", "azst", "azt", "b", "bdst", "bdt", "bnt", "bot", "brst", "brt", "bst", "bt", "btt", "c", "cast", "cat", "cct", "cdst", "cdt", "cedt", "cest", "cet", "chadt", "chast", "chot", "chst", "chut", "ckt", "cldt", "clst", "clt", "cot", "cst", "ct", "cvt", "cxt", "d", "davt", "ddut", "e", "eadt", "easst", "east", "eat", "ecst", "ect", "edst", "edt", "eedt", "eest", "eet", "efate", "egst", "egt", "est", "et", "f", "fet", "fjdt", "fjst", "fjt", "fkdt", "fkst", "fkt", "fnt", "g", "galt", "gamt", "get", "gft", "gilt", "gmt", "gst", "gt", "gyt", "h", "haa", "hac", "hadt", "hae", "hap", "har", "hast", "hat", "hdt", "hkt", "hlv", "hna", "hnc", "hne", "hnp", "hnr", "hnt", "hovt", "hst", "i", "ict", "idt", "iot", "irdt", "irkst", "irkt", "irst", "ist", "it", "jst", "k", "kgt", "kit", "kost", "krast", "krat", "kst", "kt", "kuyt", "l", "lhdt", "lhst", "lint", "m", "magst", "magt", "mart", "mawt", "mck", "mdst", "mdt", "mesz", "mez", "mht", "mmt", "msd", "msk", "mst", "mt", "mut", "mvt", "myt", "n", "nacdt", "nacst", "naedt", "naest", "namdt", "namst", "napdt", "napst", "nct", "ndt", "nft", "novst", "novt", "npt", "nrt", "nst", "nut", "nzdt", "nzst", "o", "oesz", "oez", "omsst", "omst", "orat", "p", "pdst", "pdt", "pet", "petst", "pett", "pgt", "phot", "pht", "pkt", "pmdt", "pmst", "pont", "pst", "pt", "pwt", "pyst", "pyt", "q", "qyzt", "r", "ret", "rott", "s", "sakt", "samst", "samt", "sast", "sbt", "sct", "sgt", "sret", "srt", "sst", "st", "syot", "t", "taht", "tft", "tjt", "tkt", "tlt", "tmt", "tot", "tvt", "u", "ulat", "utc", "uyst", "uyt", "uzt", "v", "vet", "vlast", "vlat", "vost", "vut", "w", "wakt", "warst", "wast", "wat", "wdt", "wedt", "wesz", "wet", "wez", "wft", "wgst", "wgt", "wib", "wit", "wita", "wst", "wt", "x", "y", "yakst", "yakt", "yapt", "yekst", "yekt", "z"];

function checkIsDate(item) {
  var d = _.clone(item).match(/[a-z]/i)
  if (d != null) {
    // Make sure letters are only months or timezones
    var words = [];
    // Iterate over characters, collecting words.
    // For each word, check that it is in one of the above two lists.
    // If not, return false
  }
  // Otherwise check using moment.js
}

function detectDataType(items {
  
  var validItems = _.filter(items, function(item, idx) {
    return !checkNull(item);
  })

  var counts = {integer: 0, float: 0, date: 0, number: 0, string: 0, time: 0}
    , isInteger = true
    , isFloat = true
    , isTime = true
    , isDate = true;

  _.each(validItems, function(item) {

    // Check integer.
    var n = _.clone(item).replace(",", "").match(/^-?[\d]+(.[0]+)?$/);
    if (n == null) {
      isInteger = false;
    } else {
      counts.integer += 1;
    }

    // Check float.
    var f = _.clone(item).replace(",", "").match(/^-?[\d]*(.[\d]+)?$/);
    if (f == null) {
      isFloat = false;
    } else {
      counts.float += 1;
    }

    // Check time.
    var t = checkIsTime(item);
    if (!t) {
      isTime = false;
    } else {
      counts.time += 1;
    }

    // Check date.
    var d = checkIsDate(item);
    if (!d) {
      isDate = false;
    } else {
      counts.date += 1;
    }
    
  }

  // Default to string.
  var result = ["string", counts];

  if (isInteger) {
    result = "integer";
    return result;
  }
  if (isFloat) {
    result = "float";
    return result;
  }
  if (isTime) {
    result = "time";
    return result;
  }
  if (isDate) {
    result = "date";
    return result;
  }
  return result;
  
}

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
