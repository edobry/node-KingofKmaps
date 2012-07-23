var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app,
    plates = require("plates")
    fs = require('fs');

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

var routes = {
	'/': {get: function () {
  		this.res.json({ 'hello': 'world' })
	}},
	'/test/:blah': {get: function (blah) {
		this.res.writeHead(200, { 'Content-Type': 'text/plain' })
		var output = "";
		if(blah) output += blah;

		this.res.end(output);
	}},
	'/grid': {get: function (){
		this.res.writeHead(200, { 'Content-Type': 'text/html' })

		var grid = ["0"," "," "," "," "," "," "," "," "," "," "," ","1"," "," "," "," "," "," "," "," "," "," "," ","0"," "," "," "," "," "," "," "];
		
		function renderGrid(grid){
			var gridRow = function (side, row){
				var newGrid = [];
				var offset = side == "left" ? 0 : 4;
				for(i = row*8 + offset; i < (row*8)+(offset+4); i++){
					newGrid.push({"cell": grid[i]});
				}
				return newGrid;
			}

			var renderHalf = function (side){
				var table = "<table border='1px'>";
				for(var i = 0; i < 4; i++){
					table += "<tr>" + plates.bind("<td class='cell'></td>", gridRow(side, i)) + "</tr>";
				}
				table += "</table>";
				return table;
			}
			return {"grid_left": renderHalf("left"), "grid_right": renderHalf("right")};
		}

		var html = fs.readFileSync("index.html", "ASCII");
		this.res.end(plates.bind(html, renderGrid(grid)));
	}}
};

app.router.mount(routes);
app.start(3000);