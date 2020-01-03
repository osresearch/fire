/*
 * Serve this directory with:
 * python -mSimpleHTTPServer 8000
 */

var fire;
var palette;
var calc1;
var calc2;
var calc3;
var calc4;
var calc5;
var fire_width = 128;
var fire_height = 64;

function setup()
{
	createCanvas(windowWidth, windowHeight);
	background(0);

	// huge goes from 0 to 85: red to yellow
	// saturation is always max 255
	// lightness is 0..255 for x=0..128 and 255 to x=128..255
	colorMode(HSB, 128)
	palette = []
	for(var i = 0 ; i < 255 ; i++)
	{
		palette[i] = color(i/3.5, 255, constrain(i*3, 0, 180));
	}
	colorMode(RGB)

	reinit();
}

function reinit()
{
	fire = []
	calc1 = []
	calc2 = []
	calc3 = []
	calc4 = []
	calc5 = []

	for(var x = 0 ; x < fire_width ; x++)
	{
		fire[x] = []
		for(var y = 0 ; y < fire_height ; y++)
		{
			fire[x][y] = 0;
		}
	}

	for(var x = 0 ; x < fire_width ; x++)
	{
		calc1[x] = x % fire_width;
		calc3[x] = (x - 1 + fire_width) % fire_width;
		calc4[x] = (x + 1) % fire_width;
	}

	for(var y = 0 ; y < fire_height ; y++)
	{
		calc2[y] = (y + 1) % fire_height;
		calc5[y] = (y + 2) % fire_height;
	}
}

//function keyReleased() { }
//function keyPressed() { }
//function mousePressed() { }

function draw()
{
	background(0);

	//angle += 0.05;

	// randomize the bottom row of the fire buffer
	for(var x = 0 ; x < fire_width ; x++)
	{
		fire[x][fire_height-1] = int(random(0, 100));
	}

	noStroke()
	var xscale = int(width / fire_width);
	var yscale = int(height / fire_height);

	fire[int(mouseX / xscale)][int(mouseY / yscale)] += 64;

	for(var y = 0 ; y < fire_height ; y++)
	{
		for(var x = 0 ; x < fire_width ; x++)
		{
			// add pixel values around current pixel
			var r = ((0
				+ fire[calc3[x]][calc2[y]]
				+ fire[calc1[x]][calc2[y]]
				+ fire[calc4[x]][calc2[y]]
				+ fire[calc1[x]][calc5[y]]) << 5) / (128+(abs(x-fire_width/2))/4); // 129;

			r = int(r)
			fire[x][y] = r
			var c = palette[r]
			fill(c)
			rect(x*xscale, y*yscale, xscale, yscale);

			if (c._getRed() == 128)
			{
				// only map 3d cube 'lit' pixels onto fire array needed for next frame
				fire[x][y] = 128;
			}
		}
	}

	updatePixels()
}
