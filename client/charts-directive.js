angular.module('data_qs')
    .directive('hist', [function() {

        return {
            restrict: 'AE',
            replace: false,
            scope: false,
            link: function (scope, element, attrs) {
                // debugger;
                var col_width = element[0].offsetWidth;

                var margin = {top: 20, right: 20, bottom: 20, left: 20},
                    width = col_width,
                    height = 275,
                    padding = 50;

                // on window resize, re-render d3 canvas
                window.onresize = function() {
                    return scope.$apply();
                };

                // define render function
                scope.renderChart = function(data){

                    // clear existing chart, if any
                    d3.select(element[0]).html("");

                    var values = data.values;
                    // if all nulls, short-circuit and display a warning instead
                    if (_.all(values, function(v){return v == null; })){
                        d3.selectAll(element)
                            .append('div')
                            .attr('class', "panel panel-warning")
                                .append('div')
                                .attr('class', 'panel-heading')
                                    .append('h3')
                                    .attr('class', 'panel-title')
                                    .text('Missing values')
                                    ;
                        d3.selectAll(element).select('.panel')
                            .append('div')
                            .attr('class', 'panel-body')
                            .text("This variable contains no data.")
                            ;
                        return false;
                    }

                    switch(data.datatype){

                        case "date":
                            d3.selectAll(element)
                                .classed("date-chart", true)
                                .classed("num-chart", false)
                                    .append('div')
                                    .attr('class', 'axis-label')
                                    .text('frequency');

                            // calculate frequency for each timestamp in the list
                            var groups = _(values).chain()
                                .groupBy(_.identity)
                                .map(function (values, key) {
                                    return {
                                        y: values.length,
                                        x: +key
                                    };
                                })
                                .sortBy(function (d) { return d.x; })
                                .value();

                            var graph = new Rickshaw.Graph({
                                width: col_width,
                                height: height,
                                element: element[0],
                                renderer: 'line',
                                interpolation: 'linear',
                                series: [{
                                    data: groups,
                                    name: 'frequency'
                                }]
                            });

                            var xAxis = new Rickshaw.Graph.Axis.Time( {
                                graph: graph
                            } );

                            var yAxis = new Rickshaw.Graph.Axis.Y({
                                graph: graph
                            });

                            graph.render();

                            var hoverDetail = new customHover({
                                graph: graph,
                                yFormatter: function(y){
                                    return parseInt(y);
                                }
                            });
                            break;

                        case "string":
                        d3.selectAll(element)
                            .classed("date-chart num-chart rickshaw_graph", false);

                          var axis_height = 20;

                          // calculate frequency for each word in the list
                          var groups = _(values).chain()
                              .groupBy(_.identity)
                              .map(function (values, key) {
                                  return {
                                      freq: values.length,
                                      value: key
                                  };
                              })
                              .sortBy(function (d) { return -d.freq; })
                              .value();

                          //   remove nulls
                          groups = _.filter(groups, function(obj){
                              return obj.value != "null";
                          });

                          var maxFreq = d3.max(groups, function (d) { return d.freq});

                          var svg = d3
                            .select(element[0])
                            .append('svg')
                            .attr('class', 'string-chart')
                            .attr('width', col_width)
                            .attr('height', height)
                            .attr('style', "overflow: visible;")
                            ;

                          if (groups.length < 15) {

                            var padding = 3;
                            var barHeight = height / groups.length - padding;
                            ySteps = d3.range(10, height, 16);

                            var yScale = d3.scale.ordinal()
                              .domain(d3.range(groups.length))
                              .rangeBands([padding, height - axis_height], 0.3);

                              var xScale = d3.scale.linear()
                              .domain([0, maxFreq])
                              .range([0, col_width]);

                              var bars = svg.selectAll('.bar')
                                .data(groups)
                                .enter().append('g')
                                    .classed('bar', true);

                              bars
                                  .append('rect')
                                  .attr('x', 0)
                                  .attr('y', function (d, i) { return yScale(i); })
                                  .attr("width", function (d) { return xScale(d.freq); })
                                  .attr("height", function(){
                                      return yScale.rangeBand();
                                  })
                                  ;

                              bars.append('text')
                                  .text(function (d) { return d.value; })
                                  .attr('x', padding)
                                  .attr('y', function (d, i) { return yScale(i)})
                                  .attr('dy', '1em');


                          } else {

                              var padding = 10;

                              var yScale = d3.scale.ordinal()
                                  .domain(d3.range(groups.length))
                                  .rangeBands([padding, height - axis_height], 0.1);


                              var xScale = d3.scale.linear()
                                  .domain([0, maxFreq])
                                  .range([0, col_width]);

                              var yFisheye = d3.fisheye.ordinal()
                                    .rangeBands([padding, height - axis_height], 0.1)
                                    .distortion(groups.length / 10);

                              yFisheye.domain(_.range(groups.length));

                              var bars = svg.selectAll('.bar')
                                .data(groups)
                                .enter().append('g')
                                    .classed('bar', true);

                              bars
                                  .append('rect')
                                  .attr('x', 0)
                                  .attr('y', function (d, i) { return yScale(i) })
                                  .attr('width', function (d) { return xScale(d.freq); })
                                  .attr('height', yScale.rangeBand())
                                  ;

                              bars.append('text')
                                  .text(function (d) { return d.value; })
                                  .classed("label", true)
                                  .attr('x', padding)
                                  .attr('y', function (d, i) { return yScale(i); })
                                  .attr('dy', '1em')
                                  .attr('text-anchor', 'start')
                                  .attr('font-size', function(d,i){
                                      return yScale.rangeBand();
                                  })
                                  .classed("hidden", true)
                                  ;

                              // add fisheye functionality
                              svg.on('mouseover', function(){
                                  svg.selectAll('text.label')
                                    .classed('hidden', false)
                              });

                              svg.on("mousemove", function() {
                                    var mouse = d3.mouse(this);
                                    var y_pos = mouse[1];
                                    if (y_pos > height - axis_height){
                                        y_pos = height - axis_height;
                                    } else if (y_pos < padding){
                                        y_pos = padding;
                                    }
                                    yFisheye.focus(y_pos);
                                    redraw();

                              });

                              function redraw() {
                                    // debugger;
                                    svg.selectAll('rect')
                                        .attr("y", function(d,i){
                                            return yFisheye(i);
                                        })
                                        .attr('height', function(d,i){
                                            return yFisheye.rangeBand(i);
                                        })
                                        ;
                                    svg.selectAll('text.label')
                                    .attr("y", function(d,i){
                                        return yFisheye(i);
                                    })
                                    .attr('font-size', function(d,i){
                                        return yFisheye.rangeBand(i);
                                    })
                                    ;
                              }

                              scope.resetBars = function(){
                                  svg.selectAll('rect')
                                      .attr("y", function(d,i){
                                          return yScale(i);
                                      })
                                      .attr('height', function(d,i){
                                          return yScale.rangeBand();
                                      })
                                      ;
                                  svg.selectAll('text.label')
                                      .attr("y", function(d,i){
                                          return yScale(i);
                                      })
                                      .attr('height', function(d,i){
                                          return yScale.rangeBand();
                                      })
                                      .classed('hidden', true)
                                      ;
                              }
                        }
                            // add X-axis
                            var xAxis = d3.svg.axis()
                            .scale(xScale);

                            svg.append('g')
                            .classed('axis', true)
                            .attr('transform', 'translate(0,' + (height - axis_height + 5) + ')')
                            .call(xAxis)
                                .append('text')
                                .attr('class', 'axis-label')
                                .attr('x', col_width)
                                .attr('y', -1)
                                .text('frequency')
                                ;

                            break;

                        default:
                            // ints and floats

                            d3.selectAll(element)
                                .classed("num-chart", true)
                                .classed("date-chart", false)
                                    .append('div')
                                    .attr('class', 'axis-label')
                                    .text('frequency')
                                    ;

                            var hist = d3.layout.histogram()
                                .value(function(v){
                                    if (checkNull(v, true)) v = undefined;
                                    return Number(v);
                                })
                                ;
                            // deal with special time variables
                            if (_.contains(["ArrTime", "DepTime", "CRSArrTime", "CRSDepTime", "WheelsOff", "WheelsOn"], data.name)){
                                hist.range([0,2400])
                                    .bins(24)
                                    ;
                            } else {
                                hist.range(function(values){
                                    // make sure the range is divisible by 10
                                    var min = _.min(values, function(v){
                                        if (_.isNaN(v)){
                                            return undefined;
                                        } else {
                                            return v;
                                        }
                                    }),
                                        max = _.max(values, function(v){
                                            if (_.isNaN(v)){
                                                return undefined;
                                            } else {
                                                return v;
                                            }
                                        });
                                    min = Math.floor(min);
                                    max = Math.ceil(max);
                                    while (min % 10){
                                        min -= 1;
                                    }
                                    while (max % 10){
                                        max += 1;
                                    }
                                    return [min, max];
                                })
                                .bins(10)
                                ;
                            }

                            var bins = hist(values);

                            var graph = new Rickshaw.Graph({
                                width: col_width,
                                height: height,
                                element: element[0],
                                renderer: 'bar',
                                series: [{
                                    data: bins,
                                    name: 'frequency'
                                }]
                            });

                            var xAxis = new Rickshaw.Graph.Axis.X( {
                                graph: graph
                            } );

                            var yAxis = new Rickshaw.Graph.Axis.Y({
                                graph: graph
                            });

                            graph.render();

                            if (data.datatype ==  "integer") {
                                var hoverDetail = new customHover({
                                    graph: graph,
                                    xFormatter: function(x){
                                        var start = x,
                                            end = Math.ceil(x + bins[0].dx);
                                        if (end - start == 1){
                                            return "Value: " + start;
                                        }
                                        return "Values: [" + start + " – " + end + ")";
                                    },
                                    yFormatter: function(y){
                                        return parseInt(y);
                                    }
                                });
                            } else {
                                var hoverDetail = new customHover({
                                    graph: graph,
                                    xFormatter: function(x){
                                        var start = x,
                                            end = Math.ceil(x + bins[0].dx);
                                        return "Values: [" + start + " – " + end + ")";
                                    },
                                    yFormatter: function(y){
                                        return parseInt(y);
                                    }
                                });
                            }

                            break;
                    }


                };
                // debugger;
                scope.renderChart(scope.$parent.col);
            }
        };
    }]);
