# A simple D3 map

- https://bit.ly/2Olz4ut
- []@emilymerwin](https://twitter.com/emilymerwin)
- emerwin@ajc.com


### Data sources
- Poverty data: [2018 Census ACS 5-Year Estimates Subject Tables](https://data.census.gov/cedsci/table?q=&g=0100000US.04000.001&table=S0501&tid=ACSST5Y2018.S0501)
- U.S. Atlas shapes: [U.S. Atlas TopoJSON](https://github.com/topojson/us-atlas#readme)


### Some notes
- We are not using jQuery here - not that you every _need_ jQuery, but you especially don't if you are using d3 - it can do pretty much anything jQuery can.
- good descriptive variable names - consider something easy to do a search for

# 1. Set up our dev environment
- Start a local python server in your terminal to run our page: `python -m SimpleHTTPServer` (or `python3 -m http.server` for python 3)
- Open your web browser and visit http://localhost:8000/ and navigate to the `class` folder.
- Open Sublime Text and go to File-Open, click once on the folder name, and click the open button. That should open all the files for the class for you to navigate. We will be doing everything in the class/main.js file.
- The "Final" directory has a built example of our final code.


# 2. Create the map DOM element in main.js:
:new: `// TODO: set up SVG element`

```javascript
// select "#mapContainer" div already set up in index.html
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
```

:eyes: Open your browser console and inspect the page - you should see your new elements in the DOM

# 3. Add json shapes
 :new: `// TODO: Load shapes`:
 
```javascript
// TODO: replace when we add poverty data
// promises ensure the data is loaded before we try to use it
d3.json(geoShapesJson)
    .then(ready, function(error) {
      console.log(error); // we could have ended with .then(ready) but you might like to know about the error argument for debugging
});

// TODO: Update to accept an array of data
function ready(geoShapes){
  // TODO: Set up poverty data objects

  // TODO: set up color scale

  // TODO: create HTML tooltip/selection

  // join our shape data to the selection and add it to the DOM via `enter()`
  svg.append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(geoShapes, geoShapes.objects.states).features)
      .enter().append("path")
      // convert lat/lon coordinates into screen coordinates
      // https://github.com/d3/d3-geo/blob/v1.11.9/README.md#geoPath
      .attr("d", d3.geoPath())
      // TODO: assign fill color to states
      // TODO: add event listener for tooltips

  // TODO: add borders to state shapes
} // end ready()
```
:eyes: Refresh the page and you should see a map

# 4. Add poverty data and join with shapes:
:rewind: Replace the single promise to include multiple promises/data sources: `// TODO: replace when we add poverty data`:

```javascript
// promises ensure the data are loaded before we try to use them
Promise.all([
  d3.json(geoShapesJson),
  d3.csv(censusCsv)
]).then(ready, function(error) {
  console.log(error); // we could have ended with .then(ready) but you might like to know about the error argument for debugging
});
```

:rewind: `// TODO: Update to accept an array of data`:

```javascript
function ready([geoShapes, censusData]) {...}
```

:new: `// TODO: Set up poverty data objects`

```javascript
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
```
:eyes: Check the console for the census data

# 5. Color by value
We already set up colorDomain (value buckets) and colorArray (hex colors for those buckets).
Now we set up colorScale, where we set the scale domain to colorDomain and scale range to colorArray

:new: `// TODO: set up color scale`:
```javascript
var colorScale = d3.scaleThreshold()
    .domain(colorDomain)
    .range(colorArray);
```

Now we loop through each shape and determine its fill color using colorScale
:new: `// TODO: assign fill color to states`:

```javascript
.style("fill", function(d) {
  // d here is an individual state shape's data
  // d.properties.name is the state's name, which has a twin in censusPcts
  // so if d.properties.name == 'Alabama', we'll set the colorScale using censusPcts['Alabama']
  return colorScale(censusPcts[d.properties.name]);
})
```
 :eyes: Reload the page and our states should be colored
# 6. Add tooltips
:new: `// TODO: create HTML tooltip/selection`:

```javascript
/**** append a new tooltip to #tooltip div already set up in index.html ****/
      // this will be shared by all of our state shapes
      // note this is a regular HTML element, which is easier to style than SVG text
var tip = d3.select("#tooltip")
    .append("div")
      .attr("class", "tooltip") // styles already defined in index
      .style("opacity", 0);
```

:new: `// TODO: add event listener for tooltips`: 

```javascript
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
```
# 4. Add borders to state shapes
:new: `TODO: add borders to state shapes`:

```javascript
svg.append("path")
  .attr("class", "state-borders") // styles already defined in index
  .attr("d", d3.geoPath()(
    // topojson.mesh basically simplifies the borders so that identical boundaries shared by two shapes will be treated as one
    topojson.mesh(geoShapes, geoShapes.objects.states, function(a, b) {
      return a !== b;
    })
  ));
```

# 5. Make it responsive
We probably don't have time to get into this but here is a good example https://eyeseast.github.io/visible-data/2013/08/26/responsive-d3/