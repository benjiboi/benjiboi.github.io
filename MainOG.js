
var canvas = document.getElementById('game');//create canvas var
var canvasContext = canvas.getContext('2d'); //make it 2d	
var w = canvas.width / 50; //general scaling in relation to canvas
// later update will redefine it so size of cells are bound to canvas size, but can be subdivided into cells in relation to rows/cols thereby changing the dimensions of the map

var rows = 50; //how many rows of tiles
var cols= 50; //how many cols of tiles

var grid = []; //where we store the map

var walls = []; //where we store the walls for the rooms
var rooms = []; //where we store the rooms
var collide = false; //whether or not the rooms are colliding
var stuck = 0;

var amount = 10; //amount of rooms value stored in the html
var sizeMin = 5; //minimum size
var size = 5;	//the variance for size
var format = w.toString() + "px Arial" //format for room indexing numbers

var disX; //distance x between rooms
var disY; //distance y between rooms
var corridorW = 1; //corridor width


 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

// used for defining sizes and display parameters
class Cell {
	constructor(c, r, x, y) {
		this.c = c; //column it is in
		this.r = r; //row it is in
		this.x = x; //x coord
		this.y = y; //y coord
		this.empty = false; //sets empty start value

		this.show = function () {
			if (this.empty == false) {
				canvasContext.fillStyle = "#323232";
				canvasContext.fillRect(this.x, this.y, w, w);
			}

			else {
				canvasContext.fillStyle = "#696966";
				canvasContext.fillRect(this.x, this.y, w, w);
			}
		};

		this.carve = function (dis, x, y) {
			for (var i = 0; i < rooms.length; i++) {
				if (this.c >= rooms[i].y / w && 
					this.c < rooms[i].y / w + rooms[i].h / w && // the 
					this.r >= rooms[i].x / w &&
					this.r < rooms[i].x / w + rooms[i].w / w) {
					this.empty = true;
				}
			}
		};

		this.carveH = function (dis, x, y) {
			if (this.r >= x && this.r < x + dis && this.c < y + corridorW && this.c > y - corridorW) {
				this.empty = true;
			}
		};
		this.carveV = function (dis, x, y) {
			if (this.c >= y && this.c < y + dis && this.r < x + corridorW && this.r > x - corridorW) {
				this.empty = true;
			}
		};
	}
}
  
function makeGrid()//create the array of tiles
 	{ 
  	for (var r = 0; r < rows; r++) 
  		{
    		for (var c = 0; c < cols; c++) 
    			{
    				var y = c*w // y pos of cell
    				var x = r*w // x pos of cell
     				var cell = new Cell(c, r, x, y);
      			grid.push(cell);
    			}
  		}
 	}
 	
 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

//Defines the squares and attaches a number for easy reference
class Room {
    constructor(x, y, width, height, i) {
        this.x = x * w; //column
        this.y = y * w; //row
        this.w = width * w; //width
        this.h = height * w; //height

        this.center = [Math.floor(this.x / w + width / 2), Math.floor(this.y / w + height / 2)]; //center

        this.draw = function () {

            canvasContext.fillStyle = "white";
			canvasContext.font = format;
            canvasContext.fillText(i, this.x + this.w / 2 - sizeMin, this.y + this.h / 2 - sizeMin);
        };
    }
}

// Used for directional generation, w is divided so room values can be reused without compounding values
class Wall {
    constructor(x, y, stretch, id) {
      this.x = Math.round(x / w); //start pos
      this.y = Math.round(y / w); //start pos
      this.s = Math.round(stretch / w); //used for calculations of one side from the x,y coords
      this.id = id; //used later to identify in switch statements
    }
}
  

function createRooms()//create the rooms
	{
		console.log("This is the amount of failed tries " + stuck);
		// First room is out of loop as some special case setup is required
		var room = new Room(
			rows/2 - sizeMin, 
			cols/2 - sizeMin, 
			Math.floor(Math.random() * size) + sizeMin, 
			Math.floor(Math.random() * size) + sizeMin,
			0);
		//centralized room to seed the random generation

		var wall1 = new Wall(room.x + 1, room.y + 1, room.w, 1); // Top piece
		var wall2 = new Wall(room.x, room.y, room.h, 2); // Left piece
		var wall3 = new Wall(room.x, room.y + room.h, room.w, 3); // Bottom piece
		var wall4 = new Wall(room.x + room.w, room.y, room.h, 4); // Right piece

		rooms.push(room);
		walls.push(wall1);
		walls.push(wall2);
		walls.push(wall3);
		walls.push(wall4);
		
		for (var i = 1; i < amount; i++) //for the amount of rooms you want
			{
				var rWall =  Math.floor(Math.random() * walls.length); // random number for array

				var rWidth = Math.floor(Math.random() * size) + sizeMin; // The width of the next wall
				var rHeight = Math.floor(Math.random() * size) + sizeMin; // the height of the next wall
				var rDisp = Math.floor(Math.random() * (walls[rWall].s / 2) - (walls[rWall].s / 4)); //Displacement of point from -0,5 to 0,5 of wall length

				switch (walls[rWall].id % 4) { // Decides which kind of wall the random wall is, as all directions have a number assigned they will be sorted accordingly
					case 0: // Right wall

						var room = new Room(
							walls[rWall].x + 1, // x coord
							walls[rWall].y + rDisp,  // y coord
							rWidth, // width
							rHeight, // height
							i);
						
						// Exclude connecting wall
						var wall1 = new Wall(room.x, room.y, room.w, 1); // top wall
						var wall3 = new Wall(room.x, room.y + room.h, room.w, 3); // bottom wall
						var wall3 = new Wall(room.x + room.w, room.y, room.h, 4); // right wall

						break;

					case 1: // Top wall

						var room = new Room(
							walls[rWall].x + rDisp, // x coord
							walls[rWall].y - (rHeight + 1), // y coord
							rWidth, // width
							rHeight, // height
							i);

						// Exclude connecting wall
						var wall1 = new Wall(room.x, room.y, room.w, 1); // top wall
						var wall2 = new Wall(room.x, room.y, room.h, 2); // left wall
						var wall3 = new Wall(room.x + room.w, room.y, room.h, 4); // right wall

						break;

					case 2: // Left wall

						var room = new Room(
							walls[rWall].x - (1 + rWidth), // x coord
							walls[rWall].y + rDisp, // y coord 
							rWidth, // width
							rHeight, // height
							i);
						
						// Exclude connecting wall
						var wall1 = new Wall(room.x, room.y, room.w, 1); // top wall
						var wall2 = new Wall(room.x, room.y, room.h, 2); // left wall
						var wall3 = new Wall(room.x, room.y + room.h, room.w, 3); // bottom wall

						break;

					case 3: // Bottom wall

						var room = new Room(
							walls[rWall].x + rDisp, 
							walls[rWall].y + 1, 
							rWidth, 
							rHeight, 
							i);

						// Exclude connecting wall
						var wall1 = new Wall(room.x, room.y, room.h, 2); // left wall
						var wall2 = new Wall(room.x, room.y + room.h, room.w, 3); // bottom wall
						var wall3 = new Wall(room.x + room.w, room.y, room.h, 4); // right wall

						break;
				}
		

				if (stuck == amount * amount){ // The number is the amount of rooms squared, as adding more rooms will increase the complexity exponentially, which would mean more collisions
					console.log("The initial conditions make this room gen either very difficult, or impossible. This is what you get") // potentially display this within the canvas
					i = amount;
					break;
				} else {
	
						for (var e = 0; e < rooms.length; e++) //for all the previous rooms
							{
								collide = false//they are not colliding

								if(room.x <= rooms[e].x+rooms[e].w && room.x+room.w >= rooms[e].x && room.y <= rooms[e].y+rooms[e].h && room.y+room.h >= rooms[e].y)//if colliding with previous room
									{
										collide = true;//kill room
										i--; // take back count
										stuck += 1;
										console.log("room Collision nr. " + stuck)
										break;
									}
								else if (room.x + room.w >= canvas.width || room.x <= 0 || room.y + room.h >= canvas.height || room.y <= 0) //if outside of canvas
									{
										collide = true;//kill room
										i--;
										stuck += 1;
										console.log("space Collision nr. " + stuck)
										break;
									}
							}
						}
				if(collide == false)//if they have not collided
					{
						rooms.push(room); //add room to the room array
						walls.splice(rWall, 1); //removes the selected wall from the array, a new room has already been placed here
						walls.push(wall1);
						walls.push(wall2);
						walls.push(wall3);

						if(i>0)//make corridors
							{
								hCorridor(rooms[i-1].center[0], room.center[0], rooms[i-1].center[1], room.center[1])
								vCorridor(rooms[i-1].center[0], room.center[0], rooms[i-1].center[1], room.center[1])
							}
					}
			}
	}

 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function hCorridor(x1,x2,y1,y2)//horizontal corridor creator
	{
		if(x1 > x2)//if the first room is further towards the right than the second one
			{
				disX = x1-x2 //find the distance between rooms
				disX += 1
				
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveH(disX, x2, y2)//carve out the corridor horizontally
					}				
			}
		else//if the second room is further towards the right then the first one
			{
				disX = x2 - x1 //find the distance between rooms
				disX += 1
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveH(disX, x1, y1)//carve out corridor
					}
			}
			
	}
	
function vCorridor(x1,x2,y1,y2)//vertical corridor creator
	{
		var x;
		
		if(y1 > y2)//if the first room is further towards the bottom then the second one
			{
				disY = y1-y2 //find the distance between rooms
				disY += 1
				
				if(x2+(disX-1) > x1+(disX-1))//find the correct x coord
					{
						x = x2
					}
				else 
					{
					x = x2+(disX-1)
					}
				
				for(var i = 0; i < grid.length; i++) 
					{
						grid[i].carveV(disY, x, y2)//carve out corridor
					}
			}
		else//if the second room is further towards the bottom then the first one
			{
				disY = y2 - y1 //find the distance between rooms
				disY += 1
				
				if(x1+(disX-1) > x2+(disX-1))//find the correct x coord
					{
						x = x1
					}	
				else 
					{
						x = x1+(disX-1)
					}
					
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveV(disY, x, y1)//carve out corridor
					}
				
			}
			
	}
		
 ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

 
function draw() 
	{
   	for (var i = 0; i < grid.length; i++) 
   		{
     		grid[i].carve();//carve out the rooms
     		grid[i].show();//draw the map
  		}
		
  	for (var i = 0; i < rooms.length; i++) 
  		{
  			rooms[i].draw();//draw the rooms number
  		}
  }

makeGrid()//make map
createRooms()//make rooms
draw()//update

function gen()
{
	stuck = 0;
	amount = document.getElementById("amount").value; //amount of rooms value, stored in the html
	sizeMin = document.getElementById("minSize").value; //minimum size
	size = document.getElementById("maxSize").value - sizeMin;	//the variance for size, max size was deemed more user friendly while variance more computing friendly
	grid = [];
	rooms = [];
console.log("amount is " + amount + ", and the size is " + size + ", and the minSize is" + sizeMin)
	makeGrid();
	createRooms();
	draw();
}