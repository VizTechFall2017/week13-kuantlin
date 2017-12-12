//Bar Chart Stuff!!!!!!!!!!!!!!!!!!!!!!!!!!!

var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 50;
var marginTop = 50;

var nestedData = [];

var svg1 = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var scaleX = d3.scaleBand().rangeRound([0, width-2*marginLeft]).padding(0.1);
var scaleY = d3.scaleLinear().range([height-2*marginTop, 0]);
var scaleY2 = d3.scaleLinear().range([height-2*marginTop, 0]);

d3.csv('./Clean Energy.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key == '2006'})[0].values;

    svg1.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')
        .call(d3.axisBottom(scaleX))
        .style('text-anchor','middle')
        .style("font-size",'13px');

    svg1.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(scaleY))
        .style("font-size",'13px');

    svg2.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')
        .call(d3.axisBottom(scaleX))
        .style('text-anchor','middle')
        .style("font-size",'13px');

    svg2.append("g")
        .attr('class', 'yaxis2')
        .call(d3.axisLeft(scaleY2))
        .style("font-size",'13px');

    svg1.append('text')
        .text('Clean Energy Produced, in MWh')
        .attr('transform', 'translate(-38,125)rotate(270)')
        .style('text-anchor','middle')
        .style("font-size",'16px');

    svg2.append('text')
        .text('Clean Energy Over Total Energy Produced, in %')
        .attr('transform', 'translate(-38,125)rotate(270)')
        .style('text-anchor','middle')
        .style("font-size",'16px');

    drawPoints(loadData);
});

function drawPoints(pointData) {
    scaleX.domain(pointData.map(function (d) {
        return d.name;
    }));
    scaleY.domain([0, d3.max(pointData, function(d){return parseFloat(d.clean);})]);
    scaleY2.domain([0, d3.max(pointData, function(d){return parseFloat(d.per);})]);

    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));

    d3.selectAll('.yaxis2')
        .call(d3.axisLeft(scaleY2));

    var rects = svg1.selectAll('.bars')
        .data(pointData, function (d) {
            return d.name;
        });

    rects.exit()
        .remove();

    rects
        .transition()
        .duration(200)
        .attr('x', function (d) {
            return scaleX(d.name);
        })
        .attr('y', function (d) {
            return scaleY(parseFloat(d.clean));
        })
        .attr('width', function (d) {
            return scaleX.bandwidth();
        })
        .attr('height', function (d) {
            return height - 2 * marginTop - scaleY(parseFloat(d.clean));
        })
        .attr('data-toggle', 'tooltip')
        .attr('title', function (d) {
            return d.clean;
        });

    rects
        .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('id', function (d) {
            return d.name;
        })
        .attr('fill', "lightgreen")
        .attr('x', function (d) {
            return scaleX(d.name);
        })
        .attr('y', function (d) {
            return scaleY(parseFloat(d.clean));
        })
        .attr('width', function (d) {
            return scaleX.bandwidth();
        })
        .attr('height', function (d) {
            return height - 2 * marginTop - scaleY(parseFloat(d.clean));
        })
        .attr('data-toggle', 'tooltip')
        .attr('title', function (d) {
            return d.clean + " MWh";
        })
        .on('mouseover', function (d) {
            d3.select(this).attr('fill', 'orange');

            currentID = d3.select(this).attr('id');
            svg2.selectAll('#' + currentID).attr('fill', 'orange');
            var bartooltip2 = svg2.append("g")
            .attr("class","bartooltip2")
            .attr("transform", "translate("+ scaleX(d.name) +","+ (scaleY2(d.per) - 20) +")");
           
            bartooltip2.append("rect")
            .attr("class", "rect")
            .attr("x", -27)
            .attr("y", -20)
            .attr("width", 66)
            .attr("height", 30)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("background", "black");

            bartooltip2.append('text')
            .text(d.per + "%")
            .attr("dx", 6)
            .attr("fill", "#f3f3f3")
            .attr("text-anchor", "middle");
        })
        .on('mouseout', function (d) {
            d3.select(this).attr('fill', 'lightgreen');

            currentID = d3.select(this).attr('id');
            svg2.selectAll('#' + currentID).attr('fill', 'lightgreen')
            svg2.selectAll(".bartooltip2").remove();
        });


    var rects2 = svg2.selectAll('.bars')
        .data(pointData, function(d){return d.name;});

    rects2.exit()
        .remove();

    rects2
        .transition()
        .duration(200)
        .attr('x',function(d){
            return scaleX(d.name);
        })
        .attr('y',function(d){
            return scaleY2(parseFloat(d.per));
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height - 2*marginTop - scaleY2(parseFloat(d.per));  //400 is the beginning domain value of the y axis, set above
        })
        .attr('data-toggle', 'tooltip')
        .attr('title', function(d) {
            return d.per;
        });

    rects2
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('id', function(d){return d.name;})
        .attr('fill', "lightgreen")
        .attr('x',function(d){
            return scaleX(d.name);
        })
        .attr('y',function(d){
            return scaleY2(parseFloat(d.per));
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(parseFloat(d.per));  //400 is the beginning domain value of the y axis, set above
        })
        .attr('data-toggle', 'tooltip')
        .attr('title', function(d) {
            return d.per + "%";
        })
        .on('mouseover', function(d){
            d3.select(this).attr('fill','orange');

            currentID = d3.select(this).attr('id');
            svg1.selectAll('#' + currentID)
            .attr('fill','orange');
            
            var bartooltip1 = svg1.append("g")
            .attr("class","bartooltip2")
            .attr("transform", "translate("+ scaleX(d.name) +","+ (scaleY(d.clean) - 20) +")");
           
            bartooltip1.append("rect")
            .attr("class", "rect")
            .attr("x", -44)
            .attr("y", -20)
            .attr("width", 100)
            .attr("height", 30)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("background", "black");

            bartooltip1.append('text')
            .text(d.clean + " MWh")
            .attr("dx", 6)
            .attr("fill", "#f3f3f3")
            .attr("text-anchor", "middle");
        })
        .on('mouseout', function(d){
            d3.select(this).attr('fill','lightgreen');

            currentID = d3.select(this).attr('id');
            svg1.selectAll('#' + currentID).attr('fill','lightgreen');
            svg1.selectAll('.bartooltip2').remove();
        });
    $('[data-toggle="tooltip"]').tooltip();
}

function updateData(selectedYear, sort){

    var filterval = nestedData.filter(function(d){
        return d.key == selectedYear
    })[0].values;
    if(sort == "amount"){
        var sortvalamount = filterval.sort(function(a, b){
            return parseFloat(a.clean) - parseFloat(b.clean);
        })    
    }else{
        var sortvalamount = filterval.sort(function(a, b){
            return parseFloat(a.per) - parseFloat(b.per);
        })    
    }
    return sortvalamount;
}

$(document).ready(function(){
    $('#mySlider').on('change', function(){
        filters();
    })
    $('.radio').on('change', function(){
        filters();
    });
});

function filters(){
    var radioval = "";
    if (document.getElementById('radioButton1').checked) {
      radioval = document.getElementById('radioButton1').value;
    }else if (document.getElementById('radioButton2').checked) {
      radioval = document.getElementById('radioButton2').value;
    }    
    var sliderval = document.getElementById('mySlider').value;
    newData = updateData(sliderval, radioval);
    drawPoints(newData);
};

//Map Stuff!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var marginLeft = 800;
var marginTop = -1300;

var solar;
var wind;
var geothermal;

var clicked = true;

var albersProjection = d3.geoAlbersUsa()
    .scale(8000)
    .translate([(width), (height/50000)]);

path = d3.geoPath()
    .projection(albersProjection);

var svg3 = d3.select('#svg3')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var maptooltip = d3.select(".maptooltip")
    .attr("class", "maptooltip")               
    .style("opacity", 0);

// load the data.
d3.queue(1)
    .defer(d3.csv, 'Hawaii_Geothermal.csv')
    .defer(d3.json, 'cb_2016_15_bg_500k.json')
    .await(energymap); 

var nestedData2 = [];

function energymap(error, geodata, position){
    nestedData2 = geodata;

    svg3.selectAll("path")
        .data(position.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "feature")
        .attr('fill','gainsboro')
        .attr('stroke','black')
        .attr('stroke-width',.25);
}

function drawmap(geodata){
    d3.selectAll('.circle').remove();
    svg3.selectAll('circle')
        .data(geodata)
        .enter()
        .append('circle')
        .attr("class", "circle")
        .attr('cx', function (d){
            return albersProjection([d.long, d.lat])[0]
        })
        .attr('cy', function (d){
            return albersProjection([d.long, d.lat])[1]
        })
        .attr('r', 5)
        .attr('fill', function (d){
            return d.fill;
        })
        .attr('stroke','black')
        .attr('stroke-width',1)
        .attr('title', function(d) {
            return d.site;
        })
        .on("mouseover", function(d){
            maptooltip.style("left", 50)
            .style("opacity", 1)
            .style("fill", "#000")
            .attr("font-weight", "bold")
            .html(
                "<div class='title' style='color:#000;'>" + "<h5>"+ d.site +"</h5></div>" + "<br/>" +
                "<p>"+ "Island: " + d.island +"</p>" +
                "<p>" + "Location: " + d.location + "</p>" + 
                "<p>"+ "Capacity: " + d.capacity +"</p>" +
                "<p>"+ "Year Built: " + d.year +"</p>" +
                "<p>"+ "Developer: " + d.developer +"</p>" + 
                "</div>");
        })
        .on("mouseout", function(d){
            maptooltip.style("opacity", 0); //Hide tool tip
        });
}

function buttonClicked(value){
    var filterdata = nestedData2.filter(function(d){
        return d.fill == value;
    });
    drawmap(filterdata);
}

//Pie Chart!!!!!!!!!!!!!!!!!!!!!!

var marginLeft = 0;
var marginTop = 50;

var pieX = width/2;
pieY = height/2;


var svg4 = d3.select('#svg4')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var pieGroup = svg4.append('g')
    .attr('transform', 'translate(' + pieX + ',' + pieY + ')');

// Define the pietooltip
var pietooltip = d3.select("#pie-tooltip")   
    .attr("class", "tooltip")               
    .style("opacity", 0);  

var scaleColor = d3.scaleOrdinal().domain(["Biomass", "Geothermal", "Solar", "Hydro", "Wind","Oil"])
    .range(["#ffa5a5","#ff7e7e","#ec5555","#cc4d4d","#c53535","lightgrey"]);


var nestedData1 = [];

var pieRadius = 220;

var makeArc = d3.arc()
    .innerRadius(100)
    .outerRadius(pieRadius);

var makePie = d3.pie()
    .sort(null)
    .value(function(d){
        return d.total
    });


var labelArc = d3.arc()
    .outerRadius(pieRadius-50)
    .innerRadius(pieRadius-25);


d3.csv('./Pie.csv', function(dataIn){

    nestedData1 = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = dataIn;
    var total = 0;
    for(var i = 0; i<loadData.length;i++){
        total += parseFloat(loadData[i].total);
    }
    g = pieGroup.selectAll('.arc')
        .data(makePie(loadData))
        .enter()
        .append('g')
        .attr('class','arc');

    g.append('path')
        .attr('d',makeArc)
        .attr('fill', function(d){ return scaleColor(d.data.type)})
        .attr('opacity',.85)
        .attr('stroke','black')
        .attr('stroke-width',2)
        .attr('stroke-opacity',.75);;
    g.on("mouseover", function(d){
        var percent = (parseFloat(d.value) / total * 100).toFixed(1);

        pietooltip.style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px")
        .style("opacity", 1)
        .style("fill", "#fff")
        .attr("font-weight", "bold")
        .text(d.value + " MWh " + "("+ percent +"%)");
    })
    .on("mouseout", function(d){
        // Hide the tooltip
        pietooltip.style("opacity", 0);
    })    
    g.append('text')
        .attr("transform", function(d) {
            return "translate(" + labelArc.centroid(d) + ")"; })
        .attr('dy', '.35em')
        .attr('text-anchor','middle')
        .text(function(d){
            return d.data.type
        })
        .style("font-size",'16px');;
});



