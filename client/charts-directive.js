var renderStringChart = function(scope, dimensions) {
  var data = scope.$parent.column;
  d3.selectAll(scope.container)
    .classed("string-chart", true)
    .classed("integer-chart", false)
    .classed("float-chart", false)
    .classed("date-chart", false)
    .classed("time-chart", false);

  // Calculate frequency for each word in the list
  var groups = _(data.values).chain()
    .groupBy(_.identity)
    .map(function(values, key) {
      return {
        freq: values.length,
        value: key
      };
     })
    .sortBy(function(d) { return -d.freq; })
    .value();

  // Remove nulls
  groups = _.filter(groups, function(obj) { return obj.value != "null"; });
  var maxFreq = d3.max(groups, function(d) { return d.freq; });

  var svg = d3.select(scope.container[0])
    .append("svg")
    .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
    .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
    .attr("class", "string-chart")
    .attr("style", "overflow: visible;");

  if (groups.length < 10) {

    var yScale = d3.scale.ordinal()
      .domain(d3.range(groups.length))
      .rangeBands([0, dimensions.height + dimensions.margin.top], 0.15);

    var xScale = d3.scale.linear()
      .domain([0, maxFreq])
      .range([0, dimensions.width + dimensions.margin.left + dimensions.margin.right]);

    var bars = svg.selectAll(".bar")
      .data(groups)
      .enter().append("g")
      .classed("bar", true);

    bars.append("rect")
     .attr("x", 0)
     .attr("y", function(d, i) { return yScale(i); })
     .attr("width", function(d) { return xScale(d.freq); })
     .attr("height", yScale.rangeBand());

    bars.append("text")
     .text(function(d) { return d.value; })
     .attr("x", 5)
     .attr("y", function(d, i) { return yScale(i) + yScale.rangeBand()/2; });

  } else {

    var yScale = d3.scale.ordinal()
     .domain(d3.range(groups.length))
     .rangeBands([0, dimensions.height + dimensions.margin.top], 0.1);

    var xScale = d3.scale.linear()
     .domain([0, maxFreq])
     .range([0, dimensions.width + dimensions.margin.left + dimensions.margin.right]);

    var yFisheye = d3.fisheye.ordinal()
      .rangeBands([0, dimensions.height], 0.1)
      .distortion(groups.length / 20);

    yFisheye.domain(_.range(groups.length));

    var bars = svg.selectAll(".bar")
      .data(groups)
      .enter().append("g")
      .classed("bar", true);

    bars.append("rect")
     .attr("x", 0)
     .attr("y", function(d, i) { return yScale(i) })
     .attr("width", function(d) { return xScale(d.freq); })
     .attr("height", yScale.rangeBand());

    bars.append("text")
     .text(function(d) { return d.value; })
     .classed("bar-label", true)
     .attr("x", 2)
     .attr("y", function(d, i) { return yScale(i); })
     .attr("dy", "1em")
     .attr("text-anchor", "start")
     .attr("font-size", yScale.rangeBand())
     .classed("hidden", true);

    // Add fisheye functionality
    svg.on("mouseover", function() {
      svg.selectAll("text.bar-label").classed("hidden", false);
    });

    svg.on("mousemove", function() {
      var mouse = d3.mouse(this);
      var yPos = mouse[1];
      if (yPos > dimensions.height) {
          yPos = dimensions.height;
      } else if (yPos < 0) {
          yPos = 0;
      }
      yFisheye.focus(yPos);
      redraw();
    });

    function redraw() {
      svg.selectAll("rect")
        .attr("y", function(d,i) { return yFisheye(i); })
        .attr("height", function(d,i) { return yFisheye.rangeBand(i); });
      svg.selectAll("text.bar-label")
        .attr("y", function(d,i) { return yFisheye(i); })
        .attr("font-size", function(d,i) { return yFisheye.rangeBand(i); });
    }
    scope.resetBars = function() {
      svg.selectAll("rect")
        .attr("y", function(d,i) { return yScale(i); })
        .attr("height", function(d,i) { return yScale.rangeBand(); });
      svg.selectAll("text.bar-label")
        .attr("y", function(d,i) { return yScale(i); })
        .attr("height", function(d,i) { return yScale.rangeBand(); })
        .classed("hidden", true);
    }
  }

  // Add X-axis
  var xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(xScale)
    .tickFormat(d3.format("d"))
    .tickSubdivide(0);

  var xCall = svg.append("g")
    .classed("axis", true)
    .attr("transform", "translate(0," + (dimensions.height + dimensions.margin.top) + ")")
    .call(xAxis);
  xCall.selectAll("text")
    .attr("x", 9)
    .attr("dy", ".1em")
    .attr("transform", "rotate(60)")
    .style("text-anchor", "start");
  xCall.append("text")
    .attr("class", "axis-label")
    .attr("x", (dimensions.width + dimensions.margin.left + dimensions.margin.right)/2)
    .attr("y", 60)
    .text("Frequency");
}

var renderIntegerChart = function(scope, dimensions) {
  renderDefaultChart(scope, dimensions);
  d3.selectAll(scope.container)
    .classed("string-chart", false)
    .classed("integer-chart", true)
    .classed("float-chart", false)
    .classed("date-chart", false)
    .classed("time-chart", false);

}

var renderFloatChart = function(scope, dimensions) {
  renderDefaultChart(scope, dimensions);
  d3.selectAll(scope.container)
    .classed("string-chart", false)
    .classed("integer-chart", false)
    .classed("float-chart", true)
    .classed("date-chart", false)
    .classed("time-chart", false);
}

var renderDateChart = function(scope, dimensions) {
  d3.selectAll(scope.container)
    .classed("string-chart", false)
    .classed("integer-chart", false)
    .classed("float-chart", false)
    .classed("date-chart", true)
    .classed("time-chart", false);

  var data = scope.$parent.column
    , bisectDate = d3.bisector(function(d) { return d.x; }).left;

  // Calculate frequency for each timestamp in the list
  var groups = _(data.values).chain()
    .groupBy(_.identity)
    .map(function(values, key) {
      key = +key * 1000;
      return {
        y: values.length,
        x: new Date(+key)
      };
    })
    .sortBy(function(d) { return d.x; })
    .value();

  var x = d3.time.scale()
    .domain(d3.extent(groups, function(d) { return d.x; }))
    .range([0, dimensions.width - 15]);

  var y = d3.scale.linear()
    .domain([0, d3.max(groups, function(d) { return d.y; })])
    .range([dimensions.height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

  var svg = d3.select(scope.container[0])
    .append("svg")
    .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
    .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");

  svg.append("path")
    .attr("class", "line")
    .attr("d", line(groups));

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + dimensions.height + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("x", 9)
    .attr("dy", ".1em")
    .attr("transform", "rotate(60)")
    .style("text-anchor", "start");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", - (dimensions.height + dimensions.margin.top)/2)
    .style("text-anchor", "middle")
    .text("Frequency");

  // Tooltip
  var focus = svg.append("g")
    .style("display", "none");

  // Append the rectangle to capture mouse
  svg.append("rect")
    .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
    .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function() { 
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .attr("id", "date-chart-tooltip")
        .attr("dx", 8)
        .attr("dy", "1em");
      focus.style("display", null); 
    })
    .on("mouseout", function() {
      focus.style("display", "none");
      d3.select("#date-chart-tooltip").remove();
    })
    .on("mousemove", mousemove);

  // Append the circle at the intersection
  focus.append("circle")
    .attr("class", "y")
    .style("fill", "#000")
    .style("stroke", "#000")
    .attr("r", 4);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0])
      , i = bisectDate(groups, x0, 1)
      , d0 = groups[i - 1]
      , d1 = groups[i]
      , d = x0 - d0.x > d1.x - x0 ? d1 : d0;

    focus.select("circle.y")
      .attr("transform", "translate(" + x(d.x) + "," + y(d.y) + ")");

    var tooltip = d3.select("#date-chart-tooltip");

    tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px")
      .style("visibility", "visible")
      .text("Point: " + d.x  + "\nNumber of items: " + d.y);

  }
}

var renderTimeChart = function(scope, dimensions) {
  var data = scope.$parent.column;
  d3.selectAll(scope.container)
    .classed("string-chart", false)
    .classed("integer-chart", false)
    .classed("float-chart", false)
    .classed("date-chart", false)
    .classed("time-chart", true);

  var svg = d3.select(scope.container[0])
    .append("svg")
    .attr("class", "time-chart")
    .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
    .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + dimensions.margin.left +",0)")
    .attr("style", "overflow: visible;");

  var x = d3.time.scale()
    .range([0, dimensions.width + dimensions.margin.right]);

  var y = d3.scale.linear()
    .range([dimensions.height + dimensions.margin.top, dimensions.margin.top]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(12);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var format = d3.time.format("%H:%M");
  var firstTime = format.parse("00:00");
  var lastTime = format.parse("23:59");

  x.domain([firstTime, lastTime]);
  xAxis.tickFormat(format);

  var bins = x.ticks(24);
  var groups = _.groupBy(data.values, function(d) {
    if (d != null) {
      d = format.parse(d);
      return d.getHours();
    }
  });
  var max = _.max(_.map(_.values(groups), function(x) {
    return x.length; 
  }));

  y.domain([0, max]);
  var histogram = _.map(bins, function(b) {
    var itemsInBin = groups[b.getHours()]
      , f = 0.0;
    if (!_.isUndefined(itemsInBin)) {
      f = itemsInBin.length; 
    }
    return {
      "bin": b,
      "frequency": f
      };
  });

  binLabel = function(t) {
    var h = t.getHours();
    return h + ":00-" + (h+1) + ":00";
  }

  var bars = svg.selectAll(".bar")
    .data(histogram)
    .enter().append("g")
    .classed("bar", true);

  bars.append("rect")
    .attr("x", function(d) { return x(d.bin); })
    .attr("width", Math.floor((x.range()[1]/24)-1)+"px")
    .attr("y", function(d) { return y(d.frequency); })
    .attr("height", function(d) {
      return (dimensions.height + dimensions.margin.top) - y(d.frequency); })
    .on("mouseover", function(d){
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .attr("id", "time-chart-tooltip");
      tooltip.text("Bin: [" + binLabel(d.bin) + ")\nNumber of items: " + d.frequency);
      return tooltip.style("visibility", "visible"); })
    .on("mousemove", function(){ 
       var tooltip = d3.select("#time-chart-tooltip");
       return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); })
    .on("mouseout", function(){ 
      d3.select("#time-chart-tooltip").remove();
    });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (dimensions.height + dimensions.margin.top) + ")")
    .call(xAxis)
   .selectAll("text")
    .attr("x", 9)
    .attr("dy", ".1em")
    .attr("transform", "rotate(60)")
    .style("text-anchor", "start");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", - (dimensions.height + dimensions.margin.top)/2)
    .style("text-anchor", "middle")
    .text("Frequency");
}

var renderDefaultChart = function(scope, dimensions) {
  var data = scope.$parent.column;

  var min = _.min(data.values, function(v) {
    if (_.isNaN(v)) { return undefined; }
    return v;
  })
    , max = _.max(data.values, function(v) {
      if (_.isNaN(v)) { return undefined; }
      return v;
    });
  min = Math.floor(min);
  max = Math.ceil(max);
  while (min % 10) { min -= 1; }
  while (max % 10) { max += 1; }

  var x = d3.scale.linear()
    .domain([0, max])
    .range([0, dimensions.width - 5]);

  var histogram = d3.layout.histogram()
    .value(function(v) {
      if (checkNull(v, true)) { v = undefined; }
      return Number(v);
    })
    .range([min, max])
    .bins(x.ticks(10));
  var bins = histogram(data.values);

  var y = d3.scale.linear()
    .domain([0, d3.max(bins, function(d) { return d.y; })])
    .range([dimensions.height, dimensions.margin.top]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var svg = d3.select(scope.container[0])
    .append("svg")
    .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
    .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + dimensions.margin.left +",0)")
    .attr("style", "overflow: visible;");

  var bars = svg.selectAll(".bar")
    .data(bins)
    .enter().append("g")
    .classed("bar", true)
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bars.append("rect")
    .attr("x", 3)
    .attr("width", x(bins[0].dx) - 4)
    .attr("y", dimensions.margin.top)
    .attr("height", function(d) { return dimensions.height - y(d.y); })
    .on("mouseover", function(d){
      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .attr("id", "default-chart-tooltip");
      tooltip.text("Bin: [" + d.x + " - " + (d.x + d.dx) +")\nNumber of items: " + d.y);
      return tooltip.style("visibility", "visible"); 
    })
    .on("mousemove", function(){ 
        var tooltip = d3.select("#default-chart-tooltip");
        return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px"); 
     })
    .on("mouseout", function(){
      return $("#default-chart-tooltip").remove();
     });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (dimensions.height + dimensions.margin.top) + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("x", 9)
    .attr("dy", ".1em")
    .attr("transform", "rotate(60)")
    .style("text-anchor", "start");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .attr("transform", "translate(0," + dimensions.margin.top + ")")
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", - (dimensions.height + dimensions.margin.top)/2)
    .style("text-anchor", "middle")
    .text("Frequency");
}

var renderChart = function(scope) {

  var data = scope.$parent.column
    , margin = {top: 10, right: 10, bottom: 60, left: 70}
    , dimensions = {
        margin: margin,
        width: scope.container[0].offsetWidth - margin.left - margin.right,
        height: 300 - margin.top - margin.bottom,
        padding:50
    };

  // Clear existing chart, if any.
  d3.select(scope.container[0]).html("");

  // TODO: Handle all nulls.
  switch (data.datatype) {
    case "string":
      renderStringChart(scope, dimensions);
      break;
    case "integer":
      renderIntegerChart(scope, dimensions);
      break;
    case "float":
      renderFloatChart(scope, dimensions);
      break;
    case "date":
      renderDateChart(scope, dimensions);
      break;
    case "time":
      renderTimeChart(scope, dimensions);
      break;
    default:
      renderDefaultChart(scope, dimensions);
      break;
  }

};

// Most important method:
angular.module("dataFramer")
.directive("chart", [function() {
  return {
    restrict: "AE",
    replace: false,
    scope: false,
    link: function(scope, element, attrs) {
      // On window resize, re-render d3 canvas.
      window.onresize = function() {
        return scope.$apply();
      };
      scope.container = element;
      scope.renderChart = renderChart;
      scope.renderChart(scope);
    }
  };
}]);
