var DATATYPE_SORT_IDX = {
  "string": 0,
  "integer": 1,
  "float": 2,
  "date": 3,
  "time": 4
};

Meteor.methods({
  "processCsv": processCsv,
  "tempAccount": tempAccount
});

function processCsv(csvfile, name, userId, type_overrides){
  // if no user specified, use currently logged in user
  if (userId === undefined) {
    userId = Meteor.userId()
  }

  try {
    CSV()
      .from.string(csvfile)
      // Need to bind Meteor environment to callbacks in other libraries
      .to.array(Meteor.bindEnvironment(function(data){

        var dataset = {
          "user_id": userId,
          "name": name,
          "rowCount": data.length - 1, // subtract the header row
              "questions": []
            };

          // Add to database or replace existing with same name
          var d_id = Datasets.insert(dataset);

          // Convert rows to columns
          var cols = _.zip.apply(_, data);
          
          // Convert arrays to objects, separate name from values
          _.each(cols, function(v,i,a){
            a[i] = {
              "user_id": userId,
              name: v[0],
              values: [],
              "orig_values": _.rest(v),
              "dataset_id": d_id
            };
          });
          
          // Detect the datatype
          _.each(cols, function(col) {
            var datatype = detectDataType(col.orig_values);
            col['datatype'] = datatype[0];

            if (type_overrides != undefined){
              _.each(type_overrides, function(override){
                if (name == override.dataset && col['name'] == override.column) {
                  col['datatype'] = override.datatype;
                }
              })
            }

            col["datatypeIdx"] = DATATYPE_SORT_IDX[col["datatype"]];

              // Cast numbers and dates before storing
              if (col['datatype'] == "float"){
                col = processFloat(col);

              } else if (col['datatype'] == "integer") {
                col = processInt(col);

              } else if (col['datatype'] == "string") {
                col = processString(col);

              } else if (col['datatype'] == "date") {
                col = processDate(col);

              } else if (col['datatype'] == "time") {
                col = processTime(col);
              }

              col.notes = null;

              Columns.insert(col);
            });


        }));
  } catch (err) {
    throw new Meteor.Error(err.name, err.message, err.stack)
  }

}

function checkIsTime(item) {
  var t = item.match(/(\d\d\d\d)|(\d\d:\d\d)|(\d\d:\d\d:\d\d) ?(am|pm)?/i);
  if (t != null) {
    var t = item.replace(":", "")
    , h = parseInt(t.substr(0,2))
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

var TIMEZONES = ["a", "acdt", "acst", "act", "acwst", "adst", "adt", "aedt", "aest", "aet", "aft", "akdt", "akst", "almt", "amdt", "amst", "amt", "anast", "anat", "aoe", "aqtt", "art", "asia", "ast", "at", "awdt", "awst", "azodt", "azost", "azot", "azst", "azt", "b", "bdst", "bdt", "bnt", "bot", "brst", "brt", "bst", "bt", "btt", "c", "cast", "cat", "cct", "cdst", "cdt", "cedt", "cest", "cet", "chadt", "chast", "chot", "chst", "chut", "ckt", "cldt", "clst", "clt", "cot", "cst", "ct", "cvt", "cxt", "d", "davt", "ddut", "e", "eadt", "easst", "east", "eat", "ecst", "ect", "edst", "edt", "eedt", "eest", "eet", "efate", "egst", "egt", "est", "et", "f", "fet", "fjdt", "fjst", "fjt", "fkdt", "fkst", "fkt", "fnt", "g", "galt", "gamt", "get", "gft", "gilt", "gmt", "gst", "gt", "gyt", "h", "haa", "hac", "hadt", "hae", "hap", "har", "hast", "hat", "hdt", "hkt", "hlv", "hna", "hnc", "hne", "hnp", "hnr", "hnt", "hovt", "hst", "i", "ict", "idt", "iot", "irdt", "irkst", "irkt", "irst", "ist", "it", "jst", "k", "kgt", "kit", "kost", "krast", "krat", "kst", "kt", "kuyt", "l", "lhdt", "lhst", "lint", "m", "magst", "magt", "mart", "mawt", "mck", "mdst", "mdt", "mesz", "mez", "mht", "mmt", "msd", "msk", "mst", "mt", "mut", "mvt", "myt", "n", "nacdt", "nacst", "naedt", "naest", "namdt", "namst", "napdt", "napst", "nct", "ndt", "nft", "novst", "novt", "npt", "nrt", "nst", "nut", "nzdt", "nzst", "o", "oesz", "oez", "omsst", "omst", "orat", "p", "pdst", "pdt", "pet", "petst", "pett", "pgt", "phot", "pht", "pkt", "pmdt", "pmst", "pont", "pst", "pt", "pwt", "pyst", "pyt", "q", "qyzt", "r", "ret", "rott", "s", "sakt", "samst", "samt", "sast", "sbt", "sct", "sgt", "sret", "srt", "sst", "st", "syot", "t", "taht", "tft", "tjt", "tkt", "tlt", "tmt", "tot", "tvt", "u", "ulat", "utc", "uyst", "uyt", "uzt", "v", "vet", "vlast", "vlat", "vost", "vut", "w", "wakt", "warst", "wast", "wat", "wdt", "wedt", "wesz", "wet", "wez", "wft", "wgst", "wgt", "wib", "wit", "wita", "wst", "wt", "x", "y", "yakst", "yakt", "yapt", "yekst", "yekt", "z"];

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function checkIsDate(item) {
  var d = item.toLowerCase().match(/[a-z]/i)
  if (d != null) {

    // Make sure letters are only months or timezones
    var words = []
    , chars = item.toLowerCase().split("")
    , word = "";
    
    // Iterate over characters, collecting words
    _.each(chars, function(c) {
      if (isLetter(c)) {
        word = word + c;
      } else {
        if (word.length > 0) {
          words.push(word);
          word = "";
        }
      }
    });        

    // For each word, check that it is in one of the above two lists
    _.each(words, function(w) {
      // If not, return false
      if (MONTHS.indexOf(w) == -1 && TIMEZONES.indexOf(w) == -1) return false;
    });
  }

  // Otherwise check using moment.js
  return moment(item).isValid(); 
}

function detectDataType(items) {

  var validItems = _.filter(items, function(item, idx) {
    return !checkNull(item, true);
  })

  var counts = {integer: 0, float: 0, date: 0, time: 0}
  , isInteger = true
  , isFloat = true
  , isTime = true
  , isDate = true;

  _.each(validItems, function(item) {

    // Check integer
    var n = item.replace(",", "").match(/^-?(?:[1-9][\d]*)(?:.[0]+)?$/);
    if (n == null) {
      isInteger = false;
    } else {
      counts.integer += 1;
    }

    // Check float
    var f = item.replace(",", "").match(/^-?(?:(?:[1-9][\d]*)?|0?)(?:\.[\d]+)?$/);
    if (f == null) {
      isFloat = false;
    } else {
      counts.float += 1;
    }

    // Check time
    var t = checkIsTime(item);
    if (!t) {
      isTime = false;
    } else {
      counts.time += 1;
    }

    // Check date
    var d = checkIsDate(item);
    if (!d) {
      isDate = false;
    } else {
      counts.date += 1;
    }
  });

  // Default to string
  var result = ["string", counts];

  if (isInteger) {
    result[0] = "integer";
    return result;
  }
  if (isFloat) {
    result[0] = "float";
    return result;
  }
  if (isTime) {
    result[0] = "time";
    return result;
  }
  if (isDate) {
    result[0] = "date";
    return result;
  }
  return result;
  
}

function tempAccount(){
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
    
    // some manual overrides for ambiguous variables
    var overrides = [
      {dataset: 'faa-on-time-performance-sample.csv', column: 'Year', datatype: 'string'},
      {dataset: 'faa-wildlife-strike-clean.csv', column: 'BIRDS_STRUCK', datatype: 'string'},
      {dataset: 'faa-wildlife-strike-clean.csv', column: 'TIME', datatype: 'time'},
    ];

    _.each(csvFiles, function(name){
      processCsv(Assets.getText(name), name, userId, overrides);
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