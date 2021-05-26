<html>
	<head>
		<title> Prog B Eksamensprojekt</title>
    <link rel="stylesheet" href="styles.css"/>
		<link href="prism.css" rel="stylesheet" />
		<script src="prism.js"></script>
	</head>
	<body>
		<header>
			<nav>
				<ul>
						<li class="li2"><a class="nA" href="#h">Programmets nuværende stadie</a></li>
						<li class="li2"><a class="nA" href="#Produ">Hvordan det bliver tegnet</a></li>
						<li class="li2"><a class="nA" href="#CreatingM">Hvordan algoritmen for rummene virker</a></li>
						<li class="li2"><a class="nA" href="#generatingR">Kollision med andre rum, og siderne af væggen</a></li>
						<li class="li2"><a class="nA" href="#MSTDNC">Forbind rummene</a></li>
						<li class="li2"><a class="nA" href="#connectingR">Potentielle tilføjelser</a></li>
				</ul>
			</nav>
			<h1>Mit programmeringsprojekt</h1>
			<p> </p>
		</header>
		<main>
			<article id="Produ">
				<h2>Produktet (v1.0.1)</h2>
				<p>Det produkt set her er hvad der blev afleveret til programmering B eksamenen, en fejl var dog fundet i hvordan programmet ville skallere sig selv i forhold til html canvas, som er blevet fikset. <canvas id="game" width="1000" height="1000"></canvas><script src="script.js" ></script><button class="gen" onclick="gen()">New Dungeon</button>
			</article>
      
			
			<article id="CreatingM">
				<h2>Creating a map</h2>
				<p>For this tutorial we will be making a map out of an array of objects. Each object will store their column, row, x, y and whether or not it s a part of a room. However first we need to create the global variables: The width and heigth of the tiles, how many rows and colums the map will have, the array that will be used to store the tiles, the array that will store the rooms, a variable we will use later to check if rooms are colliding the rooms width and height in tiles, the variables we will use to help make the corridors and finally the width in tiles of the corridors. Now it's time to create an object for the tiles. This object will contain 4 functions: this.show which will determine whether or not to draw the tile to the color of the background or the color of the rooms & corridors, this.carve which will check if the tile is inside a room, this.carveH & this.carveV which check to see if the tile is in any corridors. Now that we have all that we can create the map using makeGrid() this will create a 50 x 50 map and store it in grid[]. Finally with the function draw() we can draw the map to do this we loop through all the tiles in the array grid[] and call the function this.show() we also call this.carve() & this.draw() for when we write the code for the rooms.<br>

<pre><code class="language-js">var canvas = document.getElementById("game");
var canvasContext = canvas.getContext("2d");

var w = 20;

var rows = 50;
var cols = 50;

var grid = [];

var rooms = [];
var collide = false;

var amount = 10;
var size = 5; //the actual size will be a number between 5 and 10 | e.g: size+sizeMin
var sizeMin = 5;

var disX;
var disY;
var corridorW = 1;

function Cell(c, r, x, y) {
  this.c = c;
  this.r = r;
  this.x = x;
  this.y = y;
  this.empty = false;

  this.show = function() {
    if (this.empty == false) {
      canvasContext.fillStyle = "#323232";
      canvasContext.fillRect(this.x, this.y, w, w);
    } else {
      canvasContext.fillStyle = "#696966";
      canvasContext.fillRect(this.x, this.y, w, w);
    }
  };

  this.carve = function(dis, x, y) {
    for (var i = 0; i < rooms.length; i++) {
      if (
        this.c >= rooms[i].y / w &&
        this.c < rooms[i].y / w + rooms[i].h / w &&
        this.r >= rooms[i].x / w &&
        this.r < rooms[i].x / w + rooms[i].w / w
      ) {
        this.empty = true;
      }
    }
  };

  this.carveH = function(dis, x, y) {
    if (
      this.r >= x &&
      this.r < x + dis &&
      this.c < y + corridorW &&
      this.c > y - corridorW
    ) {
      this.empty = true;
    }
  };
  this.carveV = function(dis, x, y) {
    if (
      this.c >= y &&
      this.c < y + dis &&
      this.r < x + corridorW &&
      this.r > x - corridorW
    ) {
      this.empty = true;
    }
  };
}

function makeGrid() {
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var y = c * w;
      var x = r * w;
      var cell = new Cell(c, r, x, y);
      grid.push(cell);
    }
  }
}

function draw() {
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
    grid[i].carve();
  }

  for (var i = 0; i < rooms.length; i++) {
    rooms[i].draw();
  }
}

makeGrid();
createRooms();
draw();</code></pre></p>
			</article>
			
			<article id="generatingR">
				<h2>Generating rooms</h2>
				<p>Now we need to generate rooms. First we need to create the object that we will use to generate the rooms. We will choose a random x, y, width, height and center. Then draw a little number that represents what room is being generated with the function this.draw.  Finally we go through and create 5 rooms (specified in the amount variable) and add them to the array rooms[].
<pre><code class="language-js">function Room(x, y, width, height, i) {
  this.x = (x - 1) * w;
  this.y = (y - 1) * w;
  this.w = width * w;
  this.h = height * w;

  this.center = [
    Math.floor(this.x / w + width / 2),
    Math.floor(this.y / w + height / 2)
  ];

  this.draw = function() {
    canvasContext.fillStyle = "white";
    canvasContext.fillText(i, this.x + this.w / 2, this.y + this.h / 2 - 20);
  };
}

function createRooms() {
  for (var i = 0; i < amount; i++) {
    var room = new Room(
      Math.floor(Math.random() * rows) + 1,
      Math.floor(Math.random() * cols) + 1,
      Math.floor(Math.random() * size) + sizeMin,
      Math.floor(Math.random() * size) + sizeMin,
      i
    );
    rooms.push(room);
  }
}</code></pre></p>
			</article>
			
			<article id="MSTDNC">
				<h2>Making sure they do not collide</h2>
				<p>To make sure the rooms do not collide we put some basic collision code in the function that generates the rooms createRooms(). If the room currently being generated is colliding with a previous room we delete it. There is also code to detect whether or not the room is outside of the canvas if so we delete the room. If everything goes well and the room is not off the canvas or colliding with other rooms then we add it to the array of rooms this process continues until we have reached the desired amount of rooms.
<pre><code class="language-js">
function createRooms() {
  for (var i = 0; i < amount; i++) {
    var room = new Room(
      Math.floor(Math.random() * rows) + 1,
      Math.floor(Math.random() * cols) + 1,
      Math.floor(Math.random() * size) + sizeMin,
      Math.floor(Math.random() * size) + sizeMin,
      i
    );

    if (i > 0) {
      if (
        rooms[0].x + rooms[0].w >= canvas.width ||
        rooms[0].x <= 0 ||
        rooms[0].y + rooms[0].h >= canvas.height ||
        rooms[0].y <= 0
      ) {
        rooms = [];
        createRooms();
        break;
      }

      for (var e = 0; e < rooms.length; e++) {
        collide = false;

        if (
          room.x <= rooms[e].x + rooms[e].w &&
          room.x + room.w >= rooms[e].x &&
          room.y <= rooms[e].y + rooms[e].h &&
          room.y + room.h >= rooms[e].y
        ) {
          collide = true;
          i--;
          break;
        } else if (
          room.x + room.w >= canvas.width ||
          room.x <= 0 ||
          room.y + room.h >= canvas.height ||
          room.y <= 0
        ) {
          collide = true;
          i--;
          break;
        }
      }
    }

    if (collide == false) {
      rooms.push(room);
    }
  }
}
</code></pre></p>
			</article>
			
			<article id="connectingR">
				<h2>Connecting Rooms</h2>
				<p>Connecting the rooms is very easy, we first find the horizontal distance (x1 & x2) and the vertical distance (y1 & y2) between the centre of the rooms. Once we have found the distances we call the function this.carveH and this.carveV to change the state of any cells within the corridors.</p> 
<pre><code class="language-js">
function hCorridor(x1, x2, y1, y2) {
  if (x1 > x2) {
    disX = x1 - x2;
    disX += 1;

    for (var i = 0; i < grid.length; i++) {
      grid[i].carveH(disX, x2, y2);
    }
  } else {
    disX = x2 - x1;
    disX += 1;
    for (var i = 0; i < grid.length; i++) {
      grid[i].carveH(disX, x1, y1);
    }
  }
}

function vCorridor(x1, x2, y1, y2) {
  var x;

  if (y1 > y2) {
    disY = y1 - y2;
    disY += 1;

    if (x2 + (disX - 1) > x1 + (disX - 1)) {
      x = x2;
    } else {
      x = x2 + (disX - 1);
    }

    for (var i = 0; i < grid.length; i++) {
      grid[i].carveV(disY, x, y2);
    }
  } else {
    disY = y2 - y1;
    disY += 1;

    if (x1 + (disX - 1) > x2 + (disX - 1)) {
      x = x1;
    } else {
      x = x1 + (disX - 1);
    }

    for (var i = 0; i < grid.length; i++) {
      grid[i].carveV(disY, x, y1);
    }
  }
}
</code></pre><p>Now that we have al this code we need a way to call it. To do this you will just need to add the following code to the if statement "if(collide == false)" at the vary end of our createRooms() function this will call the functions that create the hallways and gives it the centers of the rooms.</p>
<pre><code class="language-js">if (i > 0) {
  hCorridor(
    rooms[i - 1].center[0],
    room.center[0],
    rooms[i - 1].center[1],
    room.center[1]
  );
  vCorridor(
    rooms[i - 1].center[0],
    room.center[0],
    rooms[i - 1].center[1],
    room.center[1]
  );
}</code></pre>
			</article>
			
			<article id="WTGFH">
				<h2>Where to go from here</h2>
				<p>You've come a long way building your first procedurally generated dungeon level, and I'm hoping you've realized that PCG isn't some magical beast that you will never have a chance to slay.<br><br>We went over how to make a map using arrays & objects, and randomly place content around your dungeon level with simple random number generators. Next, we discovered a way to determine if your random placement made sense by checking for overlapping rooms. Lastly, we found a way to ensure that your player can reach every room in your dungeon.<br><br>The first four steps of our five step process are finished, which means that you have the building blocks of a great dungeon for your next game. The final step is down to you: you must iterate over what you learned to create more procedurally generated content for endless replay-ability.</p>
			</article>
			<article>
				<hr>
				<img src="https://www.pixilart.com/images/art/cb2d6d8fb2983f5.png" alt="Me!" width="80px" height="80px"/>
				<h3>The_Coder</h3>
				<p id="i">I love making games and creating pixel art you can see some of my work and read a bit more about me <a href="https://addisoncraik.com" target="_blank">here</a>.</p>
				<hr>
			</article>
		</main>
	</body>
	<footer>
		<p>Thank you to CaptainKraft's <em><a href="https://gamedevelopment.tutsplus.com/tutorials/create-a-procedurally-generated-dungeon-cave-system--gamedev-10099?_ga=2.195336428.1114271151.1537050855-2081289398.1536880697" target="_blank">tutorial </a></em> where I got the concept from</p>
		<p class="foot">&copy; 2020 addisoncraik.com	all rights reserved</p>
	</footer>
</html>

