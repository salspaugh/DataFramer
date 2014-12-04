angular.module('data_qs')
    .directive('hist', [function() {

        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=chartData',
                control: '='
            },
            link: function (scope, element, attrs) {

                var col_width = element[0].offsetWidth;

                var margin = {top: 20, right: 20, bottom: 20, left: 20},
                    width = col_width,
                    height = 250,
                    padding = 50;

                // on window resize, re-render d3 canvas
                window.onresize = function() {
                    return scope.$apply();
                };

                // watch for data changes and re-render
                scope.$watch('data', function(newVals, oldVals) {
                    // console.log(newVals)
                    return scope.render(newVals);
                }, true);

                // define render function

                // define render function
                scope.render = function(data){

                    // clear existing chart, if any
                    d3.select(element[0]).html("");

                    var hist = d3.layout.histogram()
                    ;

                    var values = _.flatten(data)[0].values;

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
                            ;

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
                                  .range([0, col_width]);

                              var yFisheye = d3.fisheye.ordinal()
                                    .rangeBands([0, height], 0.1)
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
                                  .attr('x', padding)
                                  .attr('y', function (d, i) { return yScale(i); })
                                  .attr('dy', '1em')
                                  .attr('text-anchor', 'start')
                                  .attr('font-size', function(d,i){
                                      return yScale.rangeBand();
                                  })
                                  .classed("hidden", true)
                                  ;

                              svg.on('mouseover', function(){
                                  svg.selectAll('text')
                                    .classed('hidden', false)
                              });

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
                                    svg.selectAll('text')
                                    .attr("y", function(d,i){
                                        return yFisheye(i);
                                    })
                                    .attr('font-size', function(d,i){
                                        return yFisheye.rangeBand(i);
                                    })
                                    ;
                              }

                            //   expose this via bidirectional control var
                              scope.control = {};
                              scope.control.resetBars = function(){
                                  svg.selectAll('rect')
                                      .attr("y", function(d,i){
                                          return yScale(i);
                                      })
                                      .attr('height', function(d,i){
                                          return yScale.rangeBand();
                                      })
                                      ;
                                  svg.selectAll('text')
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
                            break;
                    }


                };
            }
        };
    }]);
