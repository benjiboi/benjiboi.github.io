<html>
	<head>
		<title> Prog B Eksamensprojekt</title>
	</head>
	<body>
		<header>

			<h1>Mit programmeringsprojekt</h1>
			<p> </p>
		</header>
		<main>
			<article id="Prod">
				<h2>Produktet (v1.0.1)</h2>
				<p>"Produkt set her er hvad der blev afleveret til programmering B eksamenen, en fejl var dog fundet i hvordan programmet ville skallere sig selv i forhold til html canvas, som er blevet fikset, desuden blev der tilføjet en måde for programmet at stoppe dets for-loop hvis der sker for mange iterationer. Desuden er det blevet gjort muligt at modificere forskellige aspekter af hvordan rum bliver dannet" </p>
					
<canvas id="game" width="1000" height="1000">
</canvas>
					
<script src="MainOG.js" ></script>
					<label for="amount"> amount of rooms </label>
<input type="number" value="10" id="amount">
<br>
	
<label for="minSize"> Minimum room size </label>
<input type="number" value="5" id="minSize">
<br>
	
<label for="maxSize"> Maximum room size </label>
<input type="number" value="10" id="maxSize">
<br>

<label for="cWidth"> The width of a corridor </label>
<input type="number" value="1" id="cWidth"> 
<br>

<button class="gen" onclick="gen()">New Dungeon</button>
      
</html>
