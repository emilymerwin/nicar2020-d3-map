
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
// TODO: set up SVG element


// TODO: Load shapes
