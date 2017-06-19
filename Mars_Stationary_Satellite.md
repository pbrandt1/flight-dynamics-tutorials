# Mars Stationary Communications Satellite

A satellite in Mars stationary orbit.

## Table of Contents

- Mars gravity model
- Stable/unstable equilibrium orbits
- Plotting satellite coverage
- Eclipses


## Mars Stationary Orbit

A stationary orbit is one where a satellite orbits around the planet at the same speed at which the planet itself rotates, causing the satellite to appear stationary in the sky above one part of the planet. The comsat industry calls them geostationary or geosynchronous satellites; geo_stationary_ is a geo_synchronous_ orbit at the equator, but almost all geosynchronous satellites are geostationary so the two words have sort of become synonyms in the industry. People usually abbreviate both to GEO, but sometimes you'll see GSO used. Science fiction fans sometimes call them "Clarke" orbits, named after the science fiction author to propose them. On Mars they could be called "areostationary" orbits, but I prefer "Mars stationary." To calculate the orbital radius `r` for a Mars stationary orbit, set the downward acceleration due to gravity equal to the centripetal acceleration of the satellite moving in a circle with the same rotational speed as Mars, `ω`.

```
gravity = centripetal acceleration
   μ/r² = ω²r
      r = ∛(μ/ω²)

ω = 2π radians / 88642.66 seconds in a Mars sidereal day (a solar day is slightly more than 2π radians and slightly more time)
μ = 4.282837e4 km3 s−2
r = 20,427.7 km
```

Mars stationary orbit is above Phobos (9,376 km) and below Deimos (23,463 km).

Let's fire up GMAT and build a mission for a Mars stationary communications satellite.

### Define new coordinate systems

* In the Resources tree, right click the Coordinate Systems folder and select "Add Coordinate System"
* Name it MarsFixed
* Origin > Mars
* Axes Type > BodyFixed

Then make another coordinate system called MarsInertial that uses BodyInertial axes.

### Set the spacecraft state

* Double-click on DefaultSC
* Select Coordinate System > MarsFixed
* Edit X = 20427.7
* Edit Y = 0
* Edit Z = 0
* Edit VX = 0
* Edit VY = 0
* Edit VZ = 0

### Configure propagator

* Double-click on DefaultProp
* Select Central Body > Mars
* Select Primary Body > Mars
* Select Gravity Model > Mars-50C
* Set Degree = 10
* Set Order = 10

The moons of Mars, Phobos and Deimos, pass close to the stationary orbit altitudes, so we will need to add them to the calculation. GMAT doesn't include them by default, but we can create them.

In the resource tree, expand SolarSystem, right click on Mars, and choose Add > Moon.

* Enter name: Phobos
* Click OK
* Double-click on Phobos in the SolarSystem tree
* Set Mu = 7.093399e-004
* Set Equatorial Radius = 13.5
* Set Flattening = 0.3185185185185186
* Switch to the Orbit tab
* Set NAIF ID = 401

Add another moon named Deimos

* Set Mu = 1.588174e-004
* Set Equatorial Radius = 7.5
* Set Flattening = 0.30666666666666664
* Set NAIF ID = 402

Now go back to the propagator properties

* Under Point Masses click Select
* Add Phobos and Deimos
* Click OK

Now you'll need ephemeris data for them. Go to https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/ and download mar097.bsp, or whatever is the most recent marxxx.bsp file (mar = Mars). Then:

* Double-click on the SolarSystem folder in the tree view
* Select Ephemeris Source > SPICE
* SPK Kernel > Select the mar097.bsp file you just downloaded

### Configure outputs

* Double-click on DefaultOrbitView
* Unselect checkbox Enable Stars
* Remove Earth from Selected Celestial Objects
* Add Mars, Phobos, and Deimos to Selected Celestial Objects
* Select Coordinate System > MarsInertial
* Select View Point Reference > Mars
* Edit View Point Vector 0 0 50000
* Edit View Direction > Mars
* Edit View Up Definition > MarsInertial

### Configure Mission Sequence

* Double-click Propagate1 in the Mission tab
* Edit Stopping Condition to be 887750 seconds (ten Mars days)

Run the mission. In the graphics window you should see the orbit of the satellite as well as the orbits of Phobos (inner orbit) and Deimos (outer orbit).

![Stationary satellite around Mars, with Phobos and Deimos orbits included](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/output/Mars-stationary-phobos-deimos.gif)

Looks pretty good, but let's take a look at the actual data and see what's going on. Set up a report file and propagate for a while.

```c
%----------------------------------------
%---------- Subscribers
%----------------------------------------

Create ReportFile ReportFile1;
GMAT ReportFile1.SolverIterations = Current;
GMAT ReportFile1.UpperLeft = [ 0 0 ];
GMAT ReportFile1.Size = [ 0 0 ];
GMAT ReportFile1.RelativeZOrder = 0;
GMAT ReportFile1.Maximized = false;
GMAT ReportFile1.Filename = '/home/peter/code/flight-dynamics-tutorials/output/Mars-stationary-satellite.csv';

GMAT ReportFile1.Precision = 16;
GMAT ReportFile1.Add = {DefaultSC.UTCGregorian, DefaultSC.Mars.Latitude, DefaultSC.Mars.Longitude};
GMAT ReportFile1.WriteHeaders = false;
GMAT ReportFile1.LeftJustify = On;
GMAT ReportFile1.ZeroFill = Off;
GMAT ReportFile1.FixedWidth = false;
GMAT ReportFile1.Delimiter = ',';
GMAT ReportFile1.ColumnWidth = 23;
GMAT ReportFile1.WriteReport = false;

%----------------------------------------
%---------- Arrays, Variables, Strings
%----------------------------------------

Create Variable MARS_DAY T SEGMENT_END;
Create String CSV_HEADER;
GMAT CSV_HEADER = 'DefaultSC.UTCGregorian,DefaultSC.Mars.Latitude,DefaultSC.Mars.Longitude';

%----------------------------------------
%---------- Mission Sequence
%----------------------------------------

BeginMissionSequence;
MARS_DAY = 88775.222 % seconds in a Mars solar day
T = 0

% initialize report
Report ReportFile1 CSV_HEADER
Report ReportFile1 DefaultSC.UTCGregorian DefaultSC.Mars.Latitude DefaultSC.Mars.Longitude

SEGMENT_END = MARS_DAY * 200 % propagate for 200 days
While T < SEGMENT_END
  Propagate DefaultProp(DefaultSC) {DefaultSC.ElapsedSecs = MARS_DAY};
  T = T + MARS_DAY
  Report ReportFile1 DefaultSC.UTCGregorian DefaultSC.Mars.Latitude DefaultSC.Mars.Longitude
EndWhile
```

You'll notice that the longitude kind of wobbles between -35.7 and 0, never appreciably exceeding the initial value, like we dropped it at the top of a hill and it rolled down the hill and halfway up a hill on the other side, and then rolled back to the starting point.

Like Earth, Mars is not perfectly spherical, so there are gravitational hills and valleys. If you place a stationary orbit at the bottom of a valley or balance it on top of a hill, it's easier to keep the satellite in that same spot. The two stable equilibrium points are 17.92W and 167.83E, and the two unstable ones are 105.55W and 75.34E, according to [Optimal longitudes determination for the station keeping of areostationary satellites](http://www.sciencedirect.com/science/article/pii/S0032063313000044) by Juan J. Silvaa and Pilar Romero. Let's change the simulation to put the satellite at the stable equilibrium point at -17.92 longitude.

```
GMAT DefaultSC.X = 19436.6;
GMAT DefaultSC.Y = -6285.4;
```

Sure enough, the orbit is much more stable at this longitude, oscillating only between 17.0 and 19.3.

## Satellite Coverage

![Satellite Coverage Diagram](http://i.imgur.com/fKtQOcC.png)

Satellite coverage can be approximated as a circular region on the surface of Mars. Pick a point on Mars, and then draw a circle that goes `α` degrees east, west, north and south. We can calculate the angle α of the circle if we know the satellite's altitude, the planet's radius, and if we have specified a mask value (like the satellite needs to be at least 10° above the horizon in order to work).

```
R: planet's radius (3,390 km for Mars)
r: orbital radius (20,427 km for Mars stationary orbit)
β: mask value (10°)
α = acos(R/r cos(β)) - β
α = 70.59°
```

Satellite coverage is not super interesting for a Mars mission unless you know what you want to be covering. We'll plot the locations of some upcoming missions to Mars with Leaflet and then you can drag the satellites coverage zone around on the map to see what you can hit. If you find a spot you think is perfect, IDK, post it to reddit or something :).

For this, we're using tiles from Mapbox. If you want to read a little more about different maps of Mars, you can read my [blog post about them](https://peterbrandt.space/blog/2016-01-01-Modern-Maps-of-Mars) (currently under construction). For this tutorial, you can run your own map by running the command below in the root of this repository.

```
python -m SimpleHTTPServer 9966
```

Then go to http://localhost:9966/Mars.html. You should see something like this:

![Mars stationary satellite coverage with Leaflet](http://i.imgur.com/BcaGehN.png)

## Eclipses

Geostationary satellites on earth have two solar eclipse seasons per year where the satellite passes through the shadow of the Earth during the equinoxes, with the longest continuous period of darkness being about seven hours long. Operators have to prepare the power systems for this mode of operation and then when the eclipse period is over they put the satellite back into normal mode for solstice season.

Open up the GMAT GUI again and let's add in an `EclipseLocator` object. Nice to know that the GUI still works after we've edited the script manually. Pretty magical actually, take a look at the Mission tab and check out what you added. Now back on the Resources tab, all the way at the bottom of the tree right click on Event Locators and add an EclipseLocator.

* set Mars as the Occult Body
* select all three types of eclipses, Antumbra, Penumbra, and Umbra
* choose a filename for your eclipse.
* set Step Size to 10
* Click OK

Run your mission, and check out the file you generated, which is a table of all the eclipses. All the way at the bottom of the file should be a summary including the max eclipse time, which should be about 4803 seconds, or only 1 hour and 20 minutes long.

<!-- Also every year there are a couple of weeks where the Sun is between Mars and the Earth, which interferes with communication signals. We need to know when this is, though it really should be something of a public record and you wouldn't need to calculate it every time you were doing some analysis for a mission. Whoa. Hey. We can do that now. We can publish a list of all periods in which the Sun is between the Earth and Mars, make a website for it, and let people google it. SunMarsConjunctions.com, it's going to be great.

Instead of drawing diagrams and writing some buggy code where we fuck up some asines, let's use GMAT. Or another thing that we could do is look it up online and see if it exists because i really don't want to do this. -->

## Conclusions

We demonstrated the stable longitudes for a satellite in Mars stationary orbit. We plotted the coverage area in modern tools to see what possible sites for missions in the 2020's a single stationary satellite could support. A single Mars stationary satellite cannot support both the planned NASA and ESA mission sites in the 2020's. We calculated the eclipses for the satellite and determined that they were not as bad as the eclipses that Earth stationary satellites endure. My conclusion is that a Mars stationary satellite could be a good idea for the 3030's if there is more of a consensus around which part of Mars to explore and develop.

For further analysis, we could to determine the amount of fuel required to place a spacecraft in a Mars stationary orbit.

### Interesting Links

* [Stationkeeping in Mars orbit](http://www.planetary.org/blogs/emily-lakdawalla/2013/stationkeeping-in-mars-orbit.html) by Emily Lakdawalla
* [Optimal longitudes determination for the station keeping of areostationary satellites](http://www.sciencedirect.com/science/article/pii/S0032063313000044) by Juan J. Silvaa and Pilar Romero


### License

Source code is licensed under the [MIT license](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/LICENSE_MIT), and tutorial written content is licensed under the [Creative Commons Attribution license](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/LICENSE_CC) by Peter Brandt.

To cite this tutorial, you could do something like this:

> "Mars Stationary Satellite" originally written by Peter Brandt and originally published at [https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/Mars_Stationary_Satellite.md](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/Mars_Stationary_Satellite.md)
