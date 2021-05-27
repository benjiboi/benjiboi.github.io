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
					<li class="li2"><a class="nA" href="#Prod">Programmets nuværende stadie</a></li>
					<li class="li2"><a class="nA" href="#Se">Hvordan det bliver tegnet</a></li>
					<li class="li2"><a class="nA" href="#RoomGen">Hvordan algoritmen for rummene virker</a></li>
					<li class="li2"><a class="nA" href="#Kollision">Kollision med andre rum, og siderne af væggen</a></li>
					<li class="li2"><a class="nA" href="#Forbind">Forbind rummene</a></li>
					<li class="li2"><a class="nA" href="#Tilføj">Potentielle tilføjelser</a></li>
				</ul>
			</nav>
			<h1>Mit programmeringsprojekt</h1>
			<p> </p>
		</header>
		<main>
			<article id="Prod">
				<h2>Produktet (v1.0.1)</h2>
				<p>Det produkt set her er hvad der blev afleveret til programmering B eksamenen, en fejl var dog fundet i hvordan programmet ville skallere sig selv i forhold til html canvas, som er blevet fikset. 
					
<canvas id="game" width="1000" height="1000">
</canvas>
					
<script src="MainOG.js" ></script>
<label for="amount"> amount of rooms
<input type="number" value="10" id="amount">
	
<label for="minSize"> Minimum room size </label>
<input type="number" value="5" id="minSize">
<br>
	
<label for="maxSize"> Maximum room size </label>
<input type="number" value="10" id="maxSize">

<label for="cWidth"> The width of a corridor </label>
<input type="number" value="1" id="cWidth"> 

<button class="gen" onclick="gen()">New Dungeon</button>


			</article>
      
			
			<article id="CreatingM">
				<h2>Creating a map</h2>
				<p>For this tutorial we will be making a map out of an array of objects. Each object will store their column, row, x, y and whether or not it s a part of a room. However first we need to create the global variables: The width and heigth of the tiles, how many rows and colums the map will have, the array that will be used to store the tiles, the array that will store the rooms, a variable we will use later to check if rooms are colliding the rooms width and height in tiles, the variables we will use to help make the corridors and finally the width in tiles of the corridors. Now it's time to create an object for the tiles. This object will contain 4 functions: this.show which will determine whether or not to draw the tile to the color of the background or the color of the rooms & corridors, this.carve which will check if the tile is inside a room, this.carveH & this.carveV which check to see if the tile is in any corridors. Now that we have all that we can create the map using makeGrid() this will create a 50 x 50 map and store it in grid[]. Finally with the function draw() we can draw the map to do this we loop through all the tiles in the array grid[] and call the function this.show() we also call this.carve() & this.draw() for when we write the code for the rooms.<br>

<pre><code class="language-js">

[Indsæt kode der tegner figuren]

</code></pre></p>
			</article>
			
			<article id="generatingR">
				<h2>Generating rooms</h2>
				<p>Now we need to generate rooms. First we need to create the object that we will use to generate the rooms. We will choose a random x, y, width, height and center. Then draw a little number that represents what room is being generated with the function this.draw.  Finally we go through and create 5 rooms (specified in the amount variable) and add them to the array rooms[].
<pre><code class="language-js">

[Room generation]

</code></pre></p>
			</article>
			
			<article id="MSTDNC">
				<h2>Making sure they do not collide</h2>
				<p>To make sure the rooms do not collide we put some basic collision code in the function that generates the rooms createRooms(). If the room currently being generated is colliding with a previous room we delete it. There is also code to detect whether or not the room is outside of the canvas if so we delete the room. If everything goes well and the room is not off the canvas or colliding with other rooms then we add it to the array of rooms this process continues until we have reached the desired amount of rooms.
<pre><code class="language-js">

[Kollision]

</code></pre></p>
			</article>
			
			<article id="connectingR">
				<h2>Connecting Rooms</h2>
				<p>Connecting the rooms is very easy, we first find the horizontal distance (x1 & x2) and the vertical distance (y1 & y2) between the centre of the rooms. Once we have found the distances we call the function this.carveH and this.carveV to change the state of any cells within the corridors.</p> 
<pre><code class="language-js">

[Forbind korridorene]

}</code></pre>
			</article>
			
			<article id="WTGFH">
				<h2>Where to go from here</h2>
				<p>You've come a long way building your first procedurally generated dungeon level, and I'm hoping you've realized that PCG isn't some magical beast that you will never have a chance to slay.<br><br>We went over how to make a map using arrays & objects, and randomly place content around your dungeon level with simple random number generators. Next, we discovered a way to determine if your random placement made sense by checking for overlapping rooms. Lastly, we found a way to ensure that your player can reach every room in your dungeon.<br><br>The first four steps of our five step process are finished, which means that you have the building blocks of a great dungeon for your next game. The final step is down to you: you must iterate over what you learned to create more procedurally generated content for endless replay-ability.</p>
			</article>

		</main>
	</body>
	<footer>
	
	</footer>
</html>

