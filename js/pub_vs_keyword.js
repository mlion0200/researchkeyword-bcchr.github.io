var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height_dot = 500 - margin.top - margin.bottom;
var xValue_dot = function(d) { return d.Publications;}, // data -> value
    xScale_dot = d3.scale.linear().range([0, width]), // value -> display
    xMap_dot = function(d) { return xScale_dot(xValue_dot(d));}, // data -> display
    xAxis_dot = d3.svg.axis().scale(xScale_dot).orient("bottom");
var yValue_dot = function(d) { return d.Keywords;}, // data -> value
    yScale_dot = d3.scale.linear().range([height_dot, 0]), // value -> display
    yMap_dot = function(d) { return yScale_dot(yValue_dot(d));}, // data -> display
    yAxis_dot = d3.svg.axis().scale(yScale_dot).orient("left");

var svg4 = d3.select(".line-chart").append("svg")
    .attr("width", width + margin.left + margin.right + 20)
    .attr("height", height_dot + margin.top + margin.bottom + 20)
  .append("g")
    .attr("transform", "translate(" + (margin.left+20) + "," + (margin.top+10) + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("data/PubVsKeywords.csv", function(error, data) {
  if (error) throw error;
  // Coerce the strings to numbers.
  data.forEach(function(d) {
    d.Publications = +d.Publications;
    d.Keywords = +d.Keywords;
  });
  // Compute the scales’ domains.
  xScale_dot.domain([d3.min(data, xValue_dot)-1, d3.max(data, xValue_dot)+1]);
  yScale_dot.domain([d3.min(data, yValue_dot)-1, d3.max(data, yValue_dot)+1]);

  // Add the x-axis.
  svg4.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_dot + ")")
      .call(xAxis_dot)
    .append("text")
      .attr("transform",
            "translate(" + width/2 + " ," + (margin.bottom+10) + ")")
      .style("text-anchor", "middle")
      .text("Number of Publications");

  // Add the y-axis.
  svg4.append("g")
      .attr("class", "y axis")
      .call(yAxis_dot)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0-height_dot/2)
      .attr("y", 0-margin.left-10)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Keywords");

  svg4.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - ((margin.top-20) / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Number of Publications VS Number of Keywords");

  // Add the points!
  svg4.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap_dot)
      .attr("cy", yMap_dot)
      .style("fill", 'orange') 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("(" + xValue_dot(d) + ", " + yValue_dot(d) + ")")
               .style("left", (event.pageX + 5) + "px")
               .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  var legend = svg4.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 10)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});
