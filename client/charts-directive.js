angular.module('data_qs')
    .directive('hist', [function() {

        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=chartData',
                label: '@',
                onClick: '&'
            },
            link: function (scope, element, attrs) {

                var margin = {top: 20, right: 20, bottom: 20, left: 20},
                    width = 320, //- margin.left - margin.right,
                    height = 250, //- margin.top - margin.bottom,
                    padding = 50;

                // on window resize, re-render d3 canvas
                window.onresize = function() {
                    return scope.$apply();
                };

                // scope.$watch(function(){
                //     return angular.element(window)[0].innerWidth;
                //   }, function(){
                //     return scope.render(scope.data);
                //   }
                // );

                // watch for data changes and re-render
                scope.$watch('data', function(newVals, oldVals) {
                    // console.log(newVals)
                    return scope.render(newVals);
                }, true);

                // define render function

                //converting all data passed thru into an array
                // var data = attrs.chartData.split(',');

                // define render function
                scope.render = function(data){

                    // clear existing chart, if any
                    d3.select(element[0]).html("");

                    var hist = d3.layout.histogram()
                    ;

                    var values = _.flatten(data)[0].values;

                    var col_width = element[0].offsetWidth;

                    switch(data[0][0].datatype){

                        case "date":
                            d3.selectAll(element)
                                .classed("date-chart", true);

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

                          // var yFisheye = d3.fisheye.scale(d3.scale.identity).domain([0, height]).focus(90);

                          var maxFreq = d3.max(groups, function (d) { return d.freq});

                          var svg = d3
                            .select(element[0])
                            .append('svg')
                            .attr('class', 'string-chart')
                            .attr('width', col_width)
                            .attr('height', height)
                            .append('g');

                          //     //set scale and origin focus
                          // var xFisheye = d3.fisheye.scale(d3.scale.identity)
                          //               .domain([0, width])
                          //               .focus(width/2),

                          //     yFisheye = d3.fisheye.scale(d3.scale.identity)
                          //                .domain([0, height])
                          //                .focus(height/2);

                          //     fontSizeFisheye = d3.fisheye.scale(d3.scale.log)
                          //                       .domain([3,150])
                          //                       .range([8,15])
                          //                       .focus(12),

                          //     fontOpacityFisheye = d3.fisheye.scale(d3.scale.log)
                          //                         .domain([8,50])
                          //                         .range([0,1])
                          //                         .focus(1)

                          if (groups.length < 15) {

                            var padding = 3;
                            var barHeight = height / groups.length - padding;
                            ySteps = d3.range(10, height, 16);

                            var yScale = d3.scale.linear()
                              .domain([0, groups.length])
                              .range([0, groups.length * 18]);

                              var xScale = d3.scale.linear()
                              .domain([0, maxFreq])
                              .range([0, col_width * 0.4]);

                              var bars = svg.selectAll('.bar')
                                .data(groups)
                                .enter().append('g')
                                    .classed('bar', true);

                              bars
                                  .append('rect')
                                  .attr('x', 0)
                                  .attr('y', function (d, i) { return padding + yScale(i); })
                                  .attr("width", function (d) { return xScale(d.freq); })
                                  .attr("height", 7)
                                  ;

                              bars.append('text')
                                  .text(function (d) { return d.value; })
                                  .attr('x', function (d) { return 10 + xScale(d.freq); })
                                  .attr('y', function (d, i) { return yScale(i) - padding; })
                                  .attr('dy', '1em');
                          } else {

                              var padding = 1;
                              var barHeight = Math.ceil(height / groups.length);

                              var yScale = d3.scale.ordinal()
                                  .domain(d3.range(groups.length))
                                  .rangeBands([0, height], 0.1);


                              var xScale = d3.scale.linear()
                                  .domain([0, maxFreq])
                                  .range([0, col_width * 0.4]);
                              
                              var yFisheye = d3.fisheye.ordinal()
                                    .rangeBands([0, height], 0.1)
                                    .distortion(groups.length / 10);

                              yFisheye.domain(_.range(groups.length));
                              // var yFisheye = d3.fisheye.scale(d3.scale.identity).domain([0, barHeight]).focus(90);
                              // var ySteps = d3.range(1, 8, 1); //start, stop, step

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

                              // bars.append('text')
                              //     .text(function (d) { return d.value; })
                              //     .attr('x', function (d) { return 10 + xScale(d.freq); })
                              //     .attr('y', function (d, i) { return yScale(i) - padding; })
                              //     .attr('dy', '1em');


                            //   redraw();

                              svg.on("mousemove", function() {
                                    var mouse = d3.mouse(this);
                                    yFisheye.focus(mouse[1]);
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
                              }
                        }

                          // redraw();

                          //     svg.on("mousemove", function() {
                          //       var mouse = d3.mouse(this);
                          //       xFisheye.focus(mouse[0]);
                          //       yFisheye.focus(mouse[1]);
                          //       redraw();
                          //     });

                          //     function redraw() {
                          //       xLine.attr("x1", xFisheye).attr("x2", xFisheye);
                          //       yLine.attr("y1", yFisheye).attr("y2", yFisheye);
                          //     }

                          // (function chart3() {
                          //     var width = 960,
                          //         height = 180,
                          //         xSteps = d3.range(10, width, 16),
                          //         ySteps = d3.range(10, height, 16);

                          //     var xFisheye = d3.fisheye.scale(d3.scale.identity).domain([0, width]).focus(360),
                          //         yFisheye = d3.fisheye.scale(d3.scale.identity).domain([0, height]).focus(90);

                          //     var svg = d3.select("#chart3").append("svg")
                          //         .attr("width", width)
                          //         .attr("height", height)
                          //       .append("g")
                          //         .attr("transform", "translate(-.5,-.5)");

                          //     svg.append("rect")
                          //         .attr("class", "background")
                          //         .attr("width", width)
                          //         .attr("height", height);

                          //     var xLine = svg.selectAll(".x")
                          //         .data(xSteps)
                          //       .enter().append("line")
                          //         .attr("class", "x")
                          //         .attr("y2", height);

                          //     var yLine = svg.selectAll(".y")
                          //         .data(ySteps)
                          //       .enter().append("line")
                          //         .attr("class", "y")
                          //         .attr("x2", width);

                          //     redraw();

                          //     svg.on("mousemove", function() {
                          //       var mouse = d3.mouse(this);
                          //       xFisheye.focus(mouse[0]);
                          //       yFisheye.focus(mouse[1]);
                          //       redraw();
                          //     });

                          //     function redraw() {
                          //       xLine.attr("x1", xFisheye).attr("x2", xFisheye);
                          //       yLine.attr("y1", yFisheye).attr("y2", yFisheye);
                          //     }
                          //   })()



                            break;

                        default:
                            // ints and floats

                            d3.selectAll(element)
                                .classed("num-chart", true);

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

                            var hoverDetail = new customHover({
                                graph: graph,
                                xFormatter: function(x){return "bin"},
                                yFormatter: function(y){
                                    return parseInt(y);
                                }
                            });

                            // var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                            //     graph: graph,
                            //     xFormatter: function(x){
                            //         // debugger;
                            //         return x;
                            //     },
                            //     yFormatter: function(y){ return y; }
                            // } );


                            // var maxFreq = d3.max(groups, function (d) { return d.freq});
                            //
                            // var svg = d3
                            //     .select(element[0])
                            //     .append('svg')
                            //     .attr('width', width)
                            //     .attr('height', height)
                            //     .append('g');
                            //
                            // var padding = 3;
                            // var barHeight = height / groups.length - padding;
                            //
                            // var yScale = d3.scale.linear()
                            //     .domain([0, groups.length])
                            //     .range([0, height]);
                            //
                            // var xScale = d3.scale.linear()
                            //     .domain([0, maxFreq])
                            //     .range([0, width]);
                            //
                            // var bars = svg.selectAll('.bar')
                            //     .data(groups)
                            //     .enter().append('g');
                            //
                            // bars
                            //     .append('rect')
                            //     .attr('x', 0)
                            //     .attr('y', function (d, i) { return yScale(i); })
                            //     .attr("width", function (d) { return xScale(d.freq); })
                            //     .attr("height", barHeight)
                            //     .attr('fill','steel');
                            //
                            // bars.append('text')
                            //     .text(function (d) { return d.value; })
                            //     .attr('x', function (d) { return 10 + xScale(d.freq); })
                            //     .attr('y', function (d, i) { return yScale(i); })
                            //     .attr('dy', '1em');
                            break;
                    }



                      // // A formatter for counts.
                      // var formatCount = d3.format(",.0f");

                      // var x = d3.scale.linear()
                      //     .domain([d3.min(data), d3.max(data)])
                      //     .range([0, width]);

                      //  // Generate a histogram using twenty uniformly-spaced bins.
                      // var histogram = d3.layout.histogram()
                      //     .bins(10)
                      //     (data);

                      // var y = d3.scale.linear()
                      //     .domain([0, d3.max(histogram.data(function(i) { return i.length; })])
                      //     .range([0, height - padding]);

                      // var xAxis = d3.svg.axis()
                      //     .scale(x)
                      //     .orient("bottom");

                      // var svg = d3.select(element[0])
                      //   .append("svg")
                      //   .attr('width', width)
                      //   .attr('height', height)
                      //   .append("g")
                      //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                      // var bars = svg.selectAll(".bar")
                      //     .data(histogram)
                      //   .enter().append("g")
                      //     .attr("class", "bar")
                      //     .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

                      // bars.append("rect")
                      //     .attr('x', function(d) {return x(d.x); })
                      //     .attr('y', function(d) {return 500 - y(d.y); })
                      //     .attr('width', function(d) {return x(d.dx); })
                      //     .attr('height', function(d) {return y(d.y); })
                      //     .attr("fill", "steelblue")
                      //     // .attr("x", 1)
                      //     // .attr("width", x(data[0].dx) - 1)
                      //     // .attr("height", function(d) { return height - y(d.y); })


                      // // bars.append("text")
                      // //     .attr("dy", ".75em")
                      // //     .attr("y", 6)
                      // //     .attr("x", x(data[0].dx) / 2)
                      // //     .attr("text-anchor", "middle")
                      // //     .text(function(d) { return formatCount(d.y); });

                      // svg.append("g")
                      //     .attr("class", "x axis")
                      //     .attr("transform", "translate(0," + height + ")")
                      //     .call(xAxis);

                };
            }
        };
    }]);
