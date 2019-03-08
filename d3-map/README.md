# A simple D3 map

- https://bit.ly/2EVX3wj
- @emilymerwin
- emerwin@ajc.com


## Set up our dev environment
- Start a local python server in your terminal to run our page: `python -m SimpleHTTPServer`
- Open your web browser and visit http://localhost:8000/ and navigate to the `class` folder.
- Open Sublime Text and go to File-Open, click once on the folder name, and click the open button. That should open all the files for the class for you to navigate. We will be doing everything in the class/main.js file. The "Final" directory has a built example of our final code.

## Reference chunks
### Create the map DOM element in main.js:

```javascript
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


// TODO: Create a tooltip here

// TODO: Load JSON
```

- Open your browser console and inspect the page - you should see your new elements in the DOM

### Add json shape data
- find `TODO: Load JSON` and add: 

```javascript
// using Queue to load the external json and csv files
// we use queue to speed up and simplify the process of loading map and data
queue()
    .defer(d3.json, "data/us.json") // source: https: //unpkg.com/us-atlas@1.0.2/us/10m.json
    // TODO: Load poverty data CSV here
    .await(ready); //we need our data files to finish loading before we can use them


function ready(error, us, data){
  //In case there's an error.
  if (error) throw error;

  // TODO: Set up poverty variables


  // TODO: Set up colors

  // create a selection to pair with our data
  svg.append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
      .attr("d", geopath)
  // TODO: add colors
  // TODO: add event listener for tooltips

// TODO: add borders to state shapes
} // ready
```

### Add borders to state shapes
- find `// TODO: add borders to state shapes`
```javascript
svg.append("path")
    .attr("class", "state-borders") // we already set up styles for these in styles.css
    .attr("d", geopath(topojson.mesh(us, us.objects.states, function(a, b) { // topojson.mesh basically simplifies the borders so that identical boundaries shared by two shapes will be treated as one
        return a !== b;
    })));
```

### Add poverty data to join with our shapes:

- find  `// TODO: Load poverty data CSV here` and add in our poverty data:

```javascript
.defer(d3.csv, "data/poverty_data.csv")
```

- find `// TODO: Set up poverty variables` and we will set up our poverty variables:
```javascript
  // Here are the quantitative variables that we need to read to create the map. First, we create empty variables that we're going to fill with our data later
  var poverty_pcts = {};
  var display_names = {};

  // For each row in the data, we define our variables, telling d3 which columns to look for. The + sign indicates that they need to be converted into numbers, rather than read as text strings
  data.forEach(function(d) {
      poverty_pcts[d["GEO.id2"]] = +d.HC03_EST_VC01;
      display_names[d["GEO.id2"]] = d["GEO.display-label"];
  });
  console.log("poverty_pcts array: ", poverty_pcts);
  console.log("display_names array: ", display_names);
```

### Add colors
- find `  // TODO: Set up colors` and we set up our colors:

```javascript
  // pick colors. We first tell d3 what numbers to look for when creating stops...
  var color_domain = [5, 10, 15, 20, 25, 30];

  // Then we tell it what colors to output based on those stops.
  var color_scale = d3.scaleThreshold()
      .domain(color_domain)
      .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
```

- find `  // TODO: add colors` to tell each state shape how to determine its color:
```javascript
.style("fill", function(d) {
  return color_scale(poverty_pcts[d.id]);
})
 ```
 
 
### Create a tooltip:

- find `// TODO: Create a tooltip here`, and add our tooltip: 

```javascript
var tip = d3.select("#tooltip").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
```

- find `// TODO: add event listener for tooltips`
```javascript
//add an event listener and set up the tooltips
.on("mouseover", function(d) {
       tip.transition()
         .duration(200)
         .style("opacity", .9);
       tip.html("<h3>"+display_names[d.id] + "</h3>" + poverty_pcts[d.id] + "%")
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       tip.transition()
         .duration(500)
         .style("opacity", 0);
       });
console.log("We did it!")
```
