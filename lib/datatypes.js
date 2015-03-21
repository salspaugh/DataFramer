// functions for creating data structures per datatype

formatTime = function(value) {
  var noColon = value.match(/\d\d\d\d/)
    , colon = value.match(/\d\d:\d\d/);
  if (noColon != null) {
    var d = value.split("");
    return d[0] + d[1] + ":" + d[2] + d[3];
  } else if (colon != null) {
    return value;
  }
  //console.log("ERROR: Cannot process value as time: ", value);
  return value;
}

processTime = function(col) {
  
  _.each(col.orig_values, function(v,i) {
    if (!checkNull(v, true)) {
      v = formatTime(v);
      col.values.push(v);
    }
  });

  if (col.values.length) {
    // store the set of unique values
    col.set = _.uniq(col.values);
  }

  // store count of nulls
  col.nulls = _.reduce(col.orig_values, function(memo, v) {
    return checkNull(v, true)? memo + 1 : memo;
  }, 0);
  col.pctNulls = Math.round(col.nulls / col.orig_values.length * 100);
  return col;
}

processFloat = function(col) {
  _.each(col.orig_values, function(v,i) {
    if (!checkNull(v, true)) col.values.push(parseFloat(v));
  });
  if (col.values.length) {
    // calculate the mean
    var sum = _.reduce(col.values, function(memo, num) {
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

    // store the set of unique values
    col.set = _.uniq(col.values);

  }

  // store count of nulls
  col.nulls = _.reduce(col.orig_values, function(memo, v) {
    return checkNull(v, true)? memo + 1 : memo;
  }, 0);
  col.pctNulls = Math.round(col.nulls / col.orig_values.length * 100);
  return col;
}

processInt = function(col) {
  _.each(col.orig_values, function(v,i) {
    if (!checkNull(v, true)) col.values.push(parseInt(v));
  });
  if (col.values.length) {
    // calculate the mean
    var sum = _.reduce(col.values, function(memo, num) {
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

    // store the set of unique values
    col.set = _.uniq(col.values);
  }

  // store count of nulls
  col.nulls = _.reduce(col.orig_values, function(memo, v) {
    return checkNull(v, true)? memo + 1 : memo;
  }, 0);
  col.pctNulls = Math.round(col.nulls / col.orig_values.length * 100);
  return col;
}

processString = function(col) {
  _.each(col.orig_values, function(v,i) {
    if (!checkNull(v, true)) col.values.push(v);
  });

  if (col.values.length) {
    // store the set of unique values
    col.set = _.uniq(col.values);
  }

  // store count of nulls
  col.nulls = _.reduce(col.orig_values, function(memo, v) {
    return checkNull(v, true)? memo + 1 : memo;
  }, 0);
  col.pctNulls = Math.round(col.nulls / col.orig_values.length * 100);
  return col;
}

processDate = function(col) {
  _.each(col.orig_values, function(v) {
    if (!checkNull(v, true)) {
      col.values.push(moment(v))
    }
  });

  if (col.values.length) {
    // TODO: sometimes this barfs ... maybe something to do with undefined values?
    col.values = _.sortBy(col.values); // will this cause problems?

    // formatted for Rickshaw js input
    col.timeSeries = _.each(_.uniq(col.values), function(v,i,a) {
      a[i] = {"x": moment(+v.key).unix(), "y": v.values};
    });

    col.max = _.last(col.values);
    col.min = _.first(col.values);
    col.range = moment.duration(col.max - col.min);
    // NOTE: call humanize() method to get col.range in plain English

    // to determine intervals:
    // check the range,
    // and also make sure the diffs aren't all exactly the next largest interval

    col.intervals = {
      "year": col.max.diff(col.min, "years") > 0,
      "month": col.max.diff(col.min, "months") > 0 && _.some(col.values,
        function(v,i,a) {
          if (a[i+1] != undefined) {
            return v.diff(a[i+1], "years", true) != v.diff(a[i+1], "years");
          } else {
            return false;
          }
        }),
        "day": col.max.diff(col.min, "day") > 0 && _.some(col.values,
          function(v,i,a) {
            if (a[i+1] != undefined) {
              return v.diff(a[i+1], "months", true) != v.diff(a[i+1], "months");
            } else {
              return false;
            }
          }),
          "hour": col.max.diff(col.min, "hours") > 0 && _.some(col.values,
            function(v,i,a) {
              if (a[i+1] != undefined) {
                return v.diff(a[i+1], "days", true) != v.diff(a[i+1], "days");
              } else {
                return false;
              }
            }),
            "minute": col.max.diff(col.min, "minutes") > 0 && _.some(col.values,
              function(v,i,a) {
                if (a[i+1] != undefined) {
                  return v.diff(a[i+1], "hours", true) != v.diff(a[i+1], "hours");
                } else {
                  return false;
                }
              }),
              "second": col.max.diff(col.min, "seconds") > 0 && _.some(col.values,
                function(v,i,a) {
                  if (a[i+1] != undefined) {
                    return v.diff(a[i+1], "minutes", true) != v.diff(a[i+1], "minutes");
                  } else {
                    return false;
                  }
                })
              };
              _.each(col.values, function(v,i,a) {
                a[i] = checkNull(v, true)? undefined : v.unix();
              });

    // store the set of unique values
    col.set = _.uniq(col.values);
  }

  // store count of nulls
  col.nulls = _.reduce(col.orig_values, function(memo, v) {
    return checkNull(v, true)? memo + 1 : memo;
  }, 0);
  col.pctNulls = Math.round(col.nulls / col.orig_values.length * 100);
  return col;
}

checkNull = function(value, excludeEmpty) {
  return _.isUndefined(value) 
  || _.isNaN(value) 
  || _.isNull(value) 
  || value === "None"
  || value === "null" 
  || value === "NA" 
  || value === "N/A"
  || value === "#N/A" 
  || (value === "" && excludeEmpty) 
  || value == "undefined";
}


roundToPrecision = function(number, places) {
  var multiplier = Math.pow(10, places);
  return Math.round(number * multiplier) / multiplier;
}
