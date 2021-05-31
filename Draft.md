# Programmet v1.0.1

Det her er programmet som har oplevet mindre forbedringer. 
Det inkluderer en tilføjelse til javascripted, 
som forhindrer programmet i at køre uendeligt, samt html integration.
 
Det er hvad var det originale mål for programmet, hvor som sagt i min problemformulering:
> Jeg havde lyst til at lave programmet så det var let tilgængeligt for alle med en computer

<canvas id="game" width="1000" height="1000">
</canvas>

<script src "MainOG.js"></script>

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

```js


```
