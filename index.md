# Programmet v1.0.1

Det her er programmet som har oplevet mindre forbedringer. 
Det inkluderer en tilføjelse til javascripted, 
som forhindrer programmet i at køre uendeligt, samt html integration.
 
Det er hvad var det originale mål for programmet, hvor som sagt i min problemformulering:
> Jeg havde lyst til at lave programmet så det var let tilgængeligt for alle med en computer

<canvas id="game" width="500" height="500">
</canvas>

<script src="MainOG.js"></script>

<label for="amount"> amount of rooms </label>
<input type="number" value="10" id="amount">
	
<label for="minSize"> Minimum room size </label>
<input type="number" value="5" id="minSize">
<br>
	
<label for="maxSize"> Maximum room size </label>
<input type="number" value="10" id="maxSize">

<label for="cWidth"> The width of a corridor </label>
<input type="number" value="1" id="cWidth">

<button class="gen" onclick="gen()">New Room Complex</button>

En specifik ændring var også at gøre programmet kunne justere sig til det canvas som der bliver specificeret.

# Hvordan javascript tegner det her

Inden koden til tilfældigheds genererings laves er det vigtigt at beskrive den kode som danner et billede ud fra det som var tilfældigt genereret.

Koden virker på et princip af kvadranter, eller mere simpelt, firkanter. Nedenunder kan koden ses, og der vil løbende blive lavet referencer til koden.
Først og fremmest har vi Cell og dets constructor. Den gør brug af "Rows" og "Columns" til at indexe hvilken firkant der bliver refereret til.
X og Y koordinaterne vil være de værdier som er brugt til at sammenligne med x/y koordinaterne for pbjekter der vil blive lavet senere.
Under selve constructoren har vi fuktionerne show og carve carve vil bestemme om en firkant er fyldt (den er en del af et objekt) eller ikke er fyldt (den er ikke en del af et objekt).
Show vil så tage den information fra carve og farve den firkant ind. Da x og y kun er et punkt vil w bruges til at skalere, som også kan ses i carve.

Dog skal alle firkanterne laves. Til det er der funktionen makeGrid() som kører igennem en udvalgt mængde Rows og Columns for at danne de firkanter, som vil skabe billederne.

Til sidst er der carveH og carveV de virker meget på samme princip som den normale carve, det her er bare specifikt for forbindelserne mellem rummene. Det betyder at carve for dem skal kaldes på et andet tidspunkt, hvilket kræver at de er separate.

```js

var w = canvas.width / 50; //general scaling in relation to canvas

var rows = 50; //how many rows of tiles
var cols= 50; //how many cols of tiles

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
```

# Rummene

Det er her hvor massen af programmet ligger. Rum generatoren skulle bruget en stor mængde plads pga dets switch statement, som var nødvendigt for at bestemme orienteringen på et rum ud fra det forrige.
Hvad alt det betyder er at for at danne rum der var både tætte på hinanden, og ikke skulle køre igennem en million checks var der brug for at blive sat nogle rammer til hvordan rummene kom til.

Først og fremmest er der to nye classes. Room og Wall begge er relativt simple, Room er two koordinater hvor width og height bruges til at lave resten af firkanten. Wall bruger koordinaterne samt længderne til at definere sig selv. Wall vil blive brugt for at nemt kunne bestemme hvilken side af Room der skal laves et nyt rum ud fra. Det er desuden derfor den har et ID, så den kan identificeres som en top mur, en bund mur etc.
nu til den aktuelle funktion der får det hele til at køre.

Der ligger nogle gamle console.logs fra debugging, de har været brugbare til at finjustere programmet, samt finde fejl.
Den første del kan ses som et seed til tilfældigheden, det er et predefineret rum, hvor alle fire mure er defineret ud fra det. Derefter vil et forloop starte, slutningen af loopet er ikke inkluderet her, da den her funktion er rimelig massiv. Her vil konstruktionen af murene kun tales om.

Herefter bliver der lavet nogle lokale variabler. De er brugt til at bestemme en hvis mængde tilfældighed ud fra placeringen af de nye rum. Hvad de længder for et rum skal være, samt hvor forskudt rummet skal være fra det forrige rum.
Efter de variabler er defineret er det tid til at finde ud af hvilken slags mur det er. Switch statementet bruger ID værdien for en mur, hvor jeg har lavet en forskellig udregning til hver case. Siden det kræver at positionerne for de nye rum er tæt op ad det forrige rum, men ikke direkte kolliderer.
Længder for den nye mur er defineret før noget andet den skal bruges til at skabe den rette distance mellem den forrige mur. Desuden bruges w igen til at lave præcist 1 firkant fra rummet det er genereret ud fra.

```js

//Defines the squares and attaches a number for easy reference
class Room {
    constructor(x, y, width, height, i) {
        this.x = x; //column
        this.y = y; //row
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
      this.x = x; //start pos
      this.y = y; //start pos
      this.s = stretch; //used for calculations of one side from the x,y coords
      this.id = id; //used later to identify in switch statements
    }
}
  

function createRooms()//create the rooms
	{
		console.log("NEW ITERATION");
		// First room is out of loop as some special case setup is required
		var room = new Room(
			canvas.width / 2 - sizeMin * w, // same as below
			canvas.height / 2 - sizeMin * w, // - sizeMin for balance
			Math.floor(Math.random() * size) + sizeMin, 
			Math.floor(Math.random() * size) + sizeMin,
			0);
		//centralized room to seed the random generation

		console.log(room.x);
		console.log(room.y);
		console.log(room.y + room.h);
		console.log(room.x + room.w);
		console.log(room.h);


		var wall1 = new Wall(room.x, room.y, room.w, 1); // Top piece
		var wall2 = new Wall(room.x, room.y, room.h, 2); // Left piece
		var wall3 = new Wall(room.x, room.y + room.h, room.w, 3); // Bottom piece
		var wall4 = new Wall(room.x + room.w, room.y, room.h, 4); // Right piece

		//console.log(room);

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

				

				console.log(walls[rWall]);
				//console.log("displacement" + rDisp + "  rWidth " + rWidth + "  rHeight" + rHeight);

				switch (walls[rWall].id % 4) { // Decides which kind of wall the random wall is, as all directions have a number assigned they will be sorted accordingly
					case 0: // Right wall

						var room = new Room(
							walls[rWall].x + w, // x coord
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
							walls[rWall].y - (rHeight * w + w), // y coord
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
							walls[rWall].x - (w + rWidth * w), // x coord
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
							walls[rWall].y + w, 
							rWidth, 
							rHeight, 
							i);

						// Exclude connecting wall
						var wall1 = new Wall(room.x, room.y, room.h, 2); // left wall
						var wall2 = new Wall(room.x, room.y + room.h, room.w, 3); // bottom wall
						var wall3 = new Wall(room.x + room.w, room.y, room.h, 4); // right wall

						break;
				}
				
////////////////////////// Mere Kode I Næste Sektion, Funktionen er stadigvæk ikke beskrevet færdig //////////////
		```
		
		
		# Kollision og checks
		
		[skal live kopieres ind]
		
		
		
		``` js
				////console.log(room);
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
										//console.log("Wall nr. " + rWall + " will be spliced")
										
										//walls.splice(rWall, 1);

										break;
									}
								else if (room.x + room.w >= canvas.width || room.x <= 0 || room.y + room.h >= canvas.height || room.y <= 0) //if outside of canvas
									{
										collide = true;//kill room
										i--;
										stuck += 1;
										console.log("space Collision nr. " + stuck)
										//console.log("Wall nr. " + rWall + " will be spliced")
										
										//walls.splice(rWall, 1);

										break;
									}
							}
						}
				if(collide == false)//if they have not collided
					{
						//console.log("compare to previous rWall"); 
						//console.log(walls[rWall]);

						rooms.push(room); //add room to the room array
						walls.splice(rWall, 1); //removes the selected wall from the array, rooms would overlap if so
						console.log("Succes!");
						//console.log("compare to previous rWall"); 
						//console.log(walls[rWall]);
						//console.log("still there?")
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

```
