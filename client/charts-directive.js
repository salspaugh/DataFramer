angular.module('data_qs')
    .directive('hist', ['d3Service', function(d3Service) {
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
                    var hist = d3.layout.histogram()
                    .bins(10)
                    ;

                    var values = _.flatten(data)[0].values;

                    var bins = hist(values);

                    switch(data[0][0].datatype){

                        case "date":
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
                              .sortBy(function (d) { return d.value; })
                              .value();

                          var maxFreq = d3.max(groups, function (d) { return d.freq});

                          var svg = d3
                            .select(element[0])
                            .append('svg')
                            .attr('class', 'string-chart')
                            .attr('width', width)
                            .attr('height', height)
                            .append('g');

                          var padding = 3;
                          var barHeight = height / groups.length - padding;

                          var yScale = d3.scale.linear()
                              .domain([0, groups.length])
                              .range([0, groups.length * 18]);

                          var xScale = d3.scale.linear()
                              .domain([0, maxFreq])
                              .range([0, width * 0.4]);

                          var bars = svg.selectAll('.bars')
                            .data(groups)
                            .enter().append('g');

                          bars
                              .append('rect')
                              .attr('x', 0)
                              .attr('y', function (d, i) { return padding + yScale(i); })
                              .attr("width", function (d) { return xScale(d.freq); })
                              .attr("height", 7)
                              .attr('fill','steelblue');

                          bars.append('text')
                              .text(function (d) { return d.value; })
                              .attr('x', function (d) { return 10 + xScale(d.freq); })
                              .attr('y', function (d, i) { return yScale(i) - padding; })
                              .attr('dy', '1em');

                            break;
                            
                        default:
                            var graph = new Rickshaw.Graph({
                                width: width,
                                height: height,
                                element: element[0],
                                renderer: 'bar',
                                series: [{
                                    data: bins,
                                    color: '#70aa47',
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
