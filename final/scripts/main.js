
/**** Configuration Variables ****/
      /*
         If a value is only used once, you _could_ hard code it
         directly when you use it (i.e. `selection.attr("width", 960")`).
         But setting likely-to-change variables at the top of the file
         makes it easier for you or someone else to update your project or re-use the code
      */

// size of our SVG canvas
var width = 960,
    height = 600;

// buckets for color stops
var colorDomain = [5, 10, 15, 20, 25, 30];

// colors to match by index with the colorDomain
var colorArray = ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"];

var geoShapesJson = "data/states-albers-10m.json"; // source: https://github.com/topojson/us-atlas#states-albers-10m.json
var censusCsv = "data/poverty_data2018.csv"; // source: 2018 Census ACS 5-Year Estimates Subject Tables

// the column name in censusCsv to use for comparison
var fieldname = "S0501_C01_104E";


/**** set up SVG element in the body of the html document ****/
      /*
        notice we aren't using jQuery at all for this map.
        You never _need_ jQuery, but you really don't with d3
      */

// select "#mapContainer" div already present in index.html
var svg = d3.select("#mapContainer")
    // add on an svg element
    .append("svg")
    // Set the svg to the width and height we already defined - otherwise it won't show up!
    .attr("width", width)
    .attr("height", height)
    // add on a "g" to hold a group of state shapes
    .append('g')
    // and give it the class we define in our css
    .attr('class', 'map');

/**** load the data ****/
// promises ensure the data are loaded before we try to use them
Promise.all([
  d3.json(geoShapesJson),
  d3.csv(censusCsv)
]).then(ready, function(error) {
  console.log(error); // we could have ended with .then(ready) but you might like to know about the error argument for debugging
});

// once the data is loaded, do things with it
function ready([geoShapes, censusData]) {

  // create empty lookup object to fill with our data in a moment
  var censusPcts = {};

  // Loop through each row in censusData
  censusData.forEach(function(d) {
    // d represents a row in censusData
    // use the 'NAME' property in our census data to associate our value with the state name
       // because our state shapes have a corresponding value, we can use that later to match them
    censusPcts[d["NAME"]] = +d[fieldname]; // the '+' prefix is a shortcut for converting text strings to numbers so we can compare them mathematically
  });
  // let's see what it looks like
  console.log("censusPcts: ", censusPcts);

  var colorScale = d3.scaleThreshold()
      .domain(colorDomain)
      .range(colorArray);

  /**** append a new tooltip to #tooltip div already set up in index.html ****/
        // this will be shared by all of our state shapes
        // note this is a regular HTML element, which is easier to style than SVG text
  var tip = d3.select("#tooltip")
      .append("div")
        .attr("class", "tooltip") // styles already defined in index
        .style("opacity", 0);

  // join our shape data to the selection and add it to the DOM via `enter()`
  svg.append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(geoShapes, geoShapes.objects.states).features)
      .enter().append("path")
      // convert lat/lon coordinates into screen coordinates
      // https://github.com/d3/d3-geo/blob/v1.11.9/README.md#geoPath
      .attr("d", d3.geoPath())
      .style("fill", function(d) {
        // d here is an individual state shape's data
        // d.properties.name is the state's name, which has a twin in censusPcts
        // so if d.properties.name == 'Alabama', we'll set the colorScale using censusPcts['Alabama']
        return colorScale(censusPcts[d.properties.name]);
      })
      //add an event listener and set up the tooltips
      .on("mouseover", function(d) {
          tip.transition()
              .duration(200)
              .style("opacity", .9);
          tip.html("<h3>" + d.properties.name + "</h3>" + censusPcts[d.properties.name] + "%")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tip.transition()
              .duration(500)
              .style("opacity", 0);
      });

  // add borders to state shapes
  svg.append("path")
      .attr("class", "state-borders") // styles already defined in index
      .attr("d", d3.geoPath()(
        // topojson.mesh basically simplifies the borders so that identical boundaries shared by two shapes will be treated as one
        topojson.mesh(geoShapes, geoShapes.objects.states, function(a, b) {
          return a !== b;
        })
      ));

  console.log("We did it!")
} // end ready()
