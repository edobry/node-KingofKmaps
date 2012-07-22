var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app,
    plates = require("plates");

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
		var gridRow = function (row){
			var newGrid = [];
			for(i = row*8; i < (row*8)+8; i++){
				newGrid.push({"cell": grid[i]});
			}
			return newGrid;
		}
		var table = "<table style='table-layout:fixed;' border='1px'>";
		for(j = 0; j < 4; j++){
			table += "<tr>" + plates.bind("<td class='cell'></td>", gridRow(j)) + "</tr>";
		}
		table += "</table>"

		this.res.end("<style>.cell{width:10px;padding:10px;height:25%;text-align:center;}</style>" + table);
	}}
};

app.router.mount(routes);
app.start(3000);