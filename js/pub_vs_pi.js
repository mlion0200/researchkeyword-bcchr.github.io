var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Number:</strong> <span style='color:red'>" + d.pis + "</span>";
  })

var svg1 = d3.select(".bar-chart-1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 20)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg1.call(tip);

d3.tsv("data/pub_vs_pi.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.publications; }));
  y.domain([0, d3.max(data, function(d) { return d.pis; })]);

  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("transform",
            "translate(" + width/2 + " ," + (margin.bottom+10)+ ")")
      .style("text-anchor", "middle")
      .text("Number of Publications");

  svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0-height/2)
      .attr("y", 0-margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of PIs");

  svg1.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Number of Publications VS Number of PIs");

  svg1.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.publications); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.pis); })
      .attr("height", function(d) { return height - y(d.pis); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});

function type(d) {
  d.pis = +d.pis;
  return d;
}