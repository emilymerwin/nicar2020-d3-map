// First step: create the canvas we will paint on with our data
// We start by defining the size of that canvas.
var width = 960,
    height = 600;

// Create GeoPath function that uses built-in D3 functionality to turn
// lat/lon coordinates into screen coordinates
var geopath = d3.geoPath();


// tell d3 to build that canvas for us in the body of the html document. Using d3's special syntax, we tell it to find the "#mapContainer" div
var svg = d3.select("#mapContainer")
    // add on an svg, 
    .append("svg")
    // Make that svg the right width and height - this is important or it won't show up!
    .attr("width", width)
    .attr("height", height)
    // add on a "g" to hold a group of shapes
    .append('g')
    // and give it the class we define in our css
    .attr('class', 'map');


// Create a tooltip
var tip = d3.select("#tooltip").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// using Queue to load the external json and csv files

// we use queue to speed up and simplify the process of loading map and data
queue()
    .defer(d3.json, "data/states-albers-10m.json") // source: https://github.com/topojson/us-atlas#states-albers-10m.json
    .defer(d3.csv, "data/poverty_data.csv")
    .await(ready); //we need our data files to finish loading before we can use them


function ready(error, us, data){
  //In case there's an error.
  if (error) throw error;

  // Here are the quantitative variables that we need to read to create the map. First, we create empty variables that we're going to fill with our data later
  var poverty_pcts = {};

  // For each row in the data, we define our variables, telling d3 which columns to look for. The + sign indicates that they need to be converted into numbers, rather than read as text strings
  data.forEach(function(d) {
      poverty_pcts[d["GEO.display-label"]] = +d.HC03_EST_VC01;
  });

  // pick colors. We first tell d3 what numbers to look for when creating stops...
  var color_domain = [5, 10, 15, 20, 25, 30];

  // Then we tell it what colors to output based on those stops.
  var color_scale = d3.scaleThreshold()
      .domain(color_domain)
      .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

  // create a selection to pair with our data
  svg.append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
      .attr("d", geopath)
      .style("fill", function(d) {
        return color_scale(poverty_pcts[d.properties.name]);
      })
      //add an event listener and set up the tooltips
      .on("mouseover", function(d) {
             tip.transition()
               .duration(200)
               .style("opacity", .9);
             tip.html("<h3>" + d.properties.name + "</h3>" + poverty_pcts[d.properties.name] + "%")
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
             })
           .on("mouseout", function(d) {
             tip.transition()
               .duration(500)
               .style("opacity", 0);
             });

svg.append("path")
    .attr("class", "state-borders") // we already set up styles for these in styles.css
    .attr("d", geopath(topojson.mesh(us, us.objects.states, function(a, b) {  // topojson.mesh basically simplifies the borders so that identical boundaries shared by two shapes will be treated as one
        return a !== b;
    })));

console.log("We did it!")
} // ready
