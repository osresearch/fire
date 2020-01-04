/*
 * Serve this directory with:
 * python -mSimpleHTTPServer 8000
 */

var fire;
var palette;
var fire_width = 256;
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
		//palette[i] = color(i/3.5, 255, constrain(i*3, 0, 180), 20);
		palette[i] = color(i/3.5, 255, constrain(i*3, 0, 180));
	}
	colorMode(RGB)

	reinit();
}

function reinit()
{
	fire = new Uint8Array(fire_width * fire_height)
}

//function keyReleased() { }
//function keyPressed() { }
//function mousePressed() { }

function draw()
{
	background(0, 0, 0, 1);

	//angle += 0.05;

	// randomize the bottom row of the fire buffer
	for(var x = 0 ; x < fire_width ; x++)
	{
		fire[(fire_height-1) * fire_width + x] = int(random(0, 100));
	}

	noStroke()
	var xscale = int(width / fire_width);
	var yscale = int(height / (fire_height-3));

	var mx = int(mouseX / xscale + random(-1,+1))
	var my = int(mouseY / yscale + random(-1,+1))
	if (mx >=0 && mx < fire_width && my >=0 && my < fire_height)
		fire[my * fire_width + mx] += int(random(128))

	for(var y = 0 ; y < fire_height-1 ; y++)
	{
		for(var x = 0 ; x < fire_width ; x++)
		{
			// add fire values 
			var offset = y * fire_width + x;
			var r = (0
				+ fire[offset] // current pixel [x,y]
				+ fire[offset + fire_width] // [x,y+1]
				+ fire[offset + fire_width + 1] // [x+1, y+1]
				+ fire[offset + fire_width - 1] // [x-1, y+1]
			) / 4;

			if (y < fire_height/4)
				r -= 1
			if (x < fire_width/2)
				r -= 2*random(fire_width/2 - x) / (fire_width/2)
			if (x > fire_width/2)
				r -= 2*random(x - fire_width/2) / (fire_width/2)
// - 1
			//				+ fire[calc1[x]][calc5[y]]) << 5) / (128+(abs(x-fire_width/2))/4); // 129;

			//console.log(x, y, r)
			r = int(r)
			if (r < 0)
				r = 0
			else
			if (r > 255)
				r = 255
			fire[offset] = r

			var c = palette[r]
			fill(c)
			rect(x*xscale+random(-1,1), y*yscale+random(-1,1), xscale, yscale);
			//ellipse(x*xscale+random(-1,1), y*yscale+random(-1,1), 2*xscale, 2*yscale);

/*
			if (c._getRed() == 128)
			{
				// only map 3d cube 'lit' pixels onto fire array needed for next frame
				fire[x][y] = 128;
			}
*/
		}
	}

	updatePixels()
}
