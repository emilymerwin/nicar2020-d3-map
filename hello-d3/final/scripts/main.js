
// make sure we've loaded d3 properly, check out all the functions inside
console.log(d3);

////////////////////
/////SELECTIONS/////
////////////////////

/* you can select things individually */

var p1 = d3.select("#p1");
p1.style("font-size","22px").style("padding","20px").attr("class","blue-selection");

/* select all of the divs with class "selections" and change the font color*/
var allP = d3.selectAll(".selections");
allP.style("color","white").style("background","navy");

/* add an inner paragraph with append */
allP.append("p")
	.attr("class","inner-paragraph")
	.text("Our new paragraph");

/* our first SVG! */
var svg = d3.select('#svg').append('svg')
		.attr('width','500')
		.attr('height','500');

/* our first shape*/
	svg.append('circle') 
		.attr('cx', '250') // the x coordinate position for the circle center
		.attr('cy', '250') // the y coordinate position for the circle center
		.attr('r','100') // the radius of the circle
		.style('fill','blue') // svg elements use "fill" and "stroke" instead of background color, color or border

/* what about a rectangle? */
	svg.append('rect')
		.attr('x', '250') // the x coordinate position of the top left corner of the rectangle
		.attr('y', '250') // the y coordinate position of the top left corner of the rectangle
		.attr('width','150') // the width
		.attr('height','75') // the height
		.style('fill','red');


////////////////////
/////DATA JOINS/////
////////////////////

/* some test data */
var circleData = [75,100,230,415];

/* lets add some circles with this data */
	var circles = svg.selectAll('.data-circle') 
		.data(circleData).enter()
		.append('circle').attr('class','data-circle')
			.attr('cx', function(d){
				return d
			})
			.attr('cy','30')
			.attr('r','20')


////////////////////
///////SCALES///////
////////////////////

var svgWidth = 300;
var svgHeight = 150;


var showSeasons = [
	{
		"seasonNumber": "Season 1",
		"episodes": 22,
		"network": "Fox",
		"airDate": "11/2/2003"
	},
	{
		"seasonNumber": "Season 2",
		"episodes": 18,
		"network": "Fox",
		"airDate": "11/7/2004"
	},
	{
		"seasonNumber": "Season 3",
		"episodes": 13,
		"network": "Fox",
		"airDate": "9/19/2005"
	},
	{
		"seasonNumber": "Season 4",
		"episodes": 15,
		"network": "Netflix",
		"airDate": "5/23/2013"
	},
	{
		"seasonNumber": "Season 5",
		"episodes": 8,
		"network": "Netflix",
		"airDate": "5/29/2018"
	}
];

var showSVG = d3.select('#show-svg').append('svg')
	.attr('width',svgWidth)
	.attr('height',svgHeight);

var episodeScale = d3.scaleLinear()
	.domain([
		0, d3.max(showSeasons, function(d){ return d.episodes })
	]) // set the domain from zero (youngest possible pet age) to the max Age value in our data set (one of many nice d3 array manipulation methods)
    .range([0, svgWidth]); // this is the _range_ we want to align our data to. let's make it the width of our SVG so we can make bars

var seasonScale = d3.scaleBand()
	.domain(showSeasons.map(function(d){ return d.seasonNumber; })) 
	.paddingInner(0.1)
    .paddingOuter(0.5)
	.range([0, svgHeight], .1); //setting range from 0 to our svgHeight. scaleBand() scales are good for positioning bars

console.log(seasonScale(showSeasons[1].seasonNumber));

var bars = showSVG.selectAll('.season-bar')
	.data(showSeasons).enter()
	.append('rect').attr('class','season-bar')
	.attr('x','0') // our X coordinate for each bar will be 0, because the top left of our rectangle needs to be all the way to the left
	.attr('y', function(d){
		return seasonScale(d.seasonNumber) //we pass in our pet's name to the petScale to get its y position
	})
	.attr('height', seasonScale.bandwidth() ) // scaleBand comes with a nice bandWith() method for creating bars
	.attr('width', function(d){
		return episodeScale(d.episodes) //we pass in our pet's age to the ageScale to see how wide the bar should be
	});





