
// canvas size
var margin = {top: 20, right: 100, bottom: 30, left: 50},
    w = 1200 - margin.left - margin.right,
    h = 250 - margin.top - margin.bottom;

var removeLoadingMsg = function(){
    $("#loadmsg").text("")
}

var makeBarPlot = function (thedata) {
    var parseDate = d3.time.format("%y-%b-%d").parse;

    var x = d3.time.scale()
        .range([0, w]);

    var y = d3.scale.linear()
        .range([h, 0]);

    var svg = d3.select("#graficoAnos")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("rect")
        .data(thedata)
        .enter()
        .append("rect")
        .attr({
            x: function (d, i) {
                return i * (w / thedata.length)
            },
            y: function (d) {
                return h - d.porcentagem * h
            },
            height: function (d) {
                return d.porcentagem * h
            },
            width: w / (thedata.length) - 1,
            fill: "steelblue"
        })
}

var makeAreaPlot = function (thedata) {
    var parseDate = d3.time.format("%Y-%m-%d").parse;

    thedata.forEach(function(d){
        d.data = parseDate(d.data);
        d.porcentagem = +d.porcentagem;
    })

    var x = d3.time.scale()
        .range([0, w]);

    var y = d3.scale.linear()
        .range([h, 0]);

    x.domain(d3.extent(thedata, function(d) { return d.data; }));
    y.domain([0, d3.max(thedata, function(d) { return d.porcentagem; })]);

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(20);
    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(4);

    var area = d3.svg.area()
        .x(function(d) { return x(d.data); })
        .y0(h)
        .y1(function(d) { return y(d.porcentagem); });

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.data); })
        .y(function(d) { return y(d.porcentagem);});

    var svg = d3.select("#graficoAnos")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .datum(thedata)
        .attr("class", "area")
        .attr("d", area)
        .attr("opacity", 0.1);

    //original:
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(thedata))

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Prop. com água");

    // interactivity
    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 4.5);

    focus.append("text")
        .attr("x", 9)
        .attr("dy", "-.5em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", w)
        .attr("height", h)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    var bisectDate = d3.bisector(function(d) { return d.data; }).left;

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(thedata, x0, 1),
            d0 = thedata[i - 1],
            d1 = thedata[i],
            d = x0 - d0.data > d1.data - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.data) + "," + y(d.porcentagem) + ")");
        focus.select("text").text(Math.round(d.porcentagem*100)/100);
    }
}


var makeAreaPlot2 = function (thedata) {
    var parseDate = d3.time.format("%Y-%m-%d").parse;

    thedata.forEach(function(d){
        d.data = parseDate(d.data);
        d.porcentagem = +d.porcentagem;
    })

    var x = d3.time.scale()
        .range([0, w]);

    var y = d3.scale.linear()
        .range([h, 0]);

    x.domain(d3.extent(thedata, function(d) { return d.data; }));
    y.domain([0, d3.max(thedata, function(d) { return d.porcentagem; })]);

//    var xAxis = d3.svg.axis().scale(x)
//        .orient("bottom").ticks(20);
//    var yAxis = d3.svg.axis().scale(y)
//        .orient("left").ticks(4);
    function xAxis() {
        return d3.svg.axis().scale(x)
            .orient("bottom").ticks(20);
    }

    function yAxis() {
        return d3.svg.axis().scale(y)
            .orient("left")
            //.ticks(4);
            .tickValues([0, 0.15, 0.24, 0.64, 1]);
    }

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.data); })
        .y(function(d) { return y(d.porcentagem);});

    var svg = d3.select("#graficoAnos")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var path = svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(thedata))
        .attr("fill", "none")

    var lineLen = path.node().getTotalLength();

//    svg.append("g")
//        .attr("class", "grid")
//        .attr("transform", "translate(0," + h + ")")
//        .call(xAxis()
//            .tickSize(-h, 0, 0)
//            .tickFormat("")
//    )

    svg.append("g")
        .attr("class", "grid")
        .call(yAxis()
            .tickSize(-w, 0, 0)
            .tickFormat("")
    )

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis());

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis())
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Prop. com água");

    svg.append("g")
        .append("text")
        .attr("y", y(1))
        .attr("x", x(x.domain()[1]) + 5)
        .attr("dy", ".25em")
        //.style("text-anchor", "middle")
        .text("Cheio");

    svg.append("g")
        .append("text")
        .attr("y", y(.24))
        .attr("x", x(x.domain()[1]) + 5)
        .attr("dy", ".25em")
        //.style("text-anchor", "middle")
        .text("Crise de 2004");

    svg.append("g")
        .append("text")
        .attr("y", y(.64))
        .attr("x", x(x.domain()[1]) + 5)
        .attr("dy", ".25em")
        //.style("text-anchor", "middle")
        .text("Pior 2005-2013");

    svg.append("g")
        .append("text")
        .attr("y", y(.15))
        .attr("x", x(x.domain()[1]) + 5)
        .attr("dy", ".25em")
        //.style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Hoje");

    // THE LINE
    path.attr("stroke-dasharray", // 2. pattern big enough to hide line
            lineLen + ", "+lineLen)
        .attr("stroke-dashoffset",lineLen); // 3. start with gap
    path.transition()
        .duration(400)
        .ease("linear")
        .attr("stroke-dashoffset", 0); // 4. shift pattern to reveal


    // interactivity
    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 4.5);

    focus.append("text")
        .attr("x", 9)
        .attr("dy", "-.5em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", w)
        .attr("height", h)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    var bisectDate = d3.bisector(function(d) { return d.data; }).left;

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(thedata, x0, 1),
            d0 = thedata[i - 1],
            d1 = thedata[i],
            d = x0 - d0.data > d1.data - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.data) + "," + y(d.porcentagem) + ")");
        var stringDate = (d.data.getUTCDate()) +"/"+ (d.data.getUTCMonth()+1) + "/" + d.data.getUTCFullYear()
        focus.select("text").text(Math.round(d.porcentagem*100)/100 + " em " + stringDate);
    }
}



var dataset = []
d3.csv("../data/boqueirao-porsemana.csv", function(error, data){
    if(error){
        throw error;
    } else {
        dataset = data;
        removeLoadingMsg();
        makeAreaPlot2(dataset);
    }
})

for(var i = 0; i < 25; i++){
    dataset.push(Math.random() * 30)
}
