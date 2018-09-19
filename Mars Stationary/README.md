# Mars Stationary Communications Satellite

A satellite in Mars stationary orbit.

## Table of Contents

- Mars gravity model
- Stable/unstable equilibrium orbits
- Plotting satellite coverage
- Eclipses


## Mars Stationary Orbit

A geostationary satellite is located at the equator and orbits around Earth exactly once per day, causing the satellite to appear stationary in the sky. Other terms include geosynchronous, which is technically not equatorial but in practice used interchangeably with geostationary, GEO, GSO, and Clarke orbits. On Mars they could be called "areostationary" orbits, but I prefer "Mars stationary." To calculate the orbital radius `r` for a Mars stationary orbit, set the downward acceleration due to gravity equal to the centripetal acceleration of the satellite moving in a circle with the same rotational speed as Mars, `ω`.

```
gravity = centripetal acceleration
μ/r²    = ω²r

r       = ∛(μ/ω²)

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

If you think it'll be useful, you can make another coordinate system called MarsInertial that uses BodyInertial axes.

### Set the spacecraft state

We'll place this spacecraft at 0 longitude. In GMAT body fixed coordinates, X points at the prime meridian, Y points east and Z points north.

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
* Set Degree = 50
* Set Order = 50
* Select Solar Radiation Pressure
* Under Point Masses click Select
* Add Sun
* Click OK

The moons of Mars, Phobos and Deimos have a small affect on satellites in Mars orbit, so may want to add them to the calculation. GMAT doesn't include them by default, but we can create them. You can skip this is you want since their effect is not very noticeable compared to the other perturbing forces acting on the spacecraft.

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
* Unselect checkbox Enable Constellations if you wish
* Remove Earth from Selected Celestial Objects
* Add Mars, Phobos, and Deimos to Selected Celestial Objects
* Select Coordinate System > MarsFixed
* Select View Point Reference > Mars
* Edit View Point Vector 30000 20000 20000
* Edit View Direction > Mars
* Edit View Up Definition > MarsFixed

### Configure Mission Sequence

* Double-click Propagate1 in the Mission tab
* Set the stopping condition parameter to DefaultSC.ElapsedSeconds
* Edit Stopping Condition to be 687, about one Mars year

Run the mission. In the graphics window you should see the orbit of the satellite as well as the orbits of Phobos (the inner moon) and Deimos (outer moon).

![First attempt at a stationary satellite around Mars, with Phobos and Deimos orbits included](https://github.com/pbrandt1/flight-dynamics-tutorials/raw/master/Mars%20Stationary/areostationary-at-0-longitude.png)

The orbit does not look very stationary. You'll notice that the longitude swings back and forth between -35.7 and 0, never appreciably exceeding the initial value, like a pendulum or like if we dropped it at the top of a frictionless hill and it rolled down the hill and halfway up a hill on the other side, and then rolled back to the starting point.

Like Earth, Mars is not perfectly spherical, and gravity is not uniform, so spacecraft tend to drift in this way. However, researchers have found two stable equilibrium points and two unstable equilibrium points in the equatorial stationary orbit belt around Mars. The two stable equilibrium points are 17.92W and 167.83E, and the two unstable ones are 105.55W and 75.34E, according to [Optimal longitudes determination for the station keeping of areostationary satellites](http://www.sciencedirect.com/science/article/pii/S0032063313000044) by Juan J. Silva and Pilar Romero. [Liu et al](https://arxiv.org/pdf/1203.1775.pdf) has them at about 16W, 165E, 106W, and 75E. I think it remains to be shown which points would require the least delta-v per year to maintain a position within a given bounding box, and this result might be different than the mathematically-derived equilibrium points found in these papers.

Let's add spacecraft at these four points and see what they look like.

**StableEast**
* Select Coordinate System > MarsFixed
* Edit X = -19968.616239503503
* Edit Y =  4306.424592331447
* Edit Z = 0
* Edit VX = 0
* Edit VY = 0
* Edit VZ = 0

**StableWest**
* Select Coordinate System > MarsFixed
* Edit X = 19436.69217895562
* Edit Y = -6285.373849702618
* Edit Z = 0
* Edit VX = 0
* Edit VY = 0
* Edit VZ = 0

**UnstableEast**
* Select Coordinate System > MarsFixed
* Edit X = 5166.446164225696
* Edit Y = 19763.571573026915
* Edit Z = 0
* Edit VX = 0
* Edit VY = 0
* Edit VZ = 0

**UnstableWest**
* Select Coordinate System > MarsFixed
* Edit X = -5476.241482496195
* Edit Y = -19679.982380972495
* Edit Z = 0
* Edit VX = 0
* Edit VY = 0
* Edit VZ = 0

Go to Mission -> Propoagate1 and click the little dots under Spacecraft List to add your new spacecraft to the propagator.

Then go to DefaultOrbitView and add these to your visualization, then enjoy the view. The slow but unrelenting motion of the satellites in the unstable points feels like something out of a screensaver.

![Mars stationary orbits at the stable and unstable longitudes](https://github.com/pbrandt1/flight-dynamics-tutorials/raw/master/Mars%20Stationary/areostationary-stable-unstable.png)

Those unstable ones are really unstable, but even the "stable" ones oscillate east and west by a few degrees and wobble north to south a small amount. What causes these perturbations? We could either use a bunch of math, or we could edit the propagator in our GMAT mission and see what has the biggest effect on the satellite. I'm not saying this is super scientific, just that it's a way to see for yourself if you're a see-it-to-belive-it kind of person.

What I did was keep the stable west satellite (deleting the others), set up a report file, started off with a super basic propagator with no other perturbing forces except for a 10x10 gravity model, and then I tried adding each perturbing force individually.

| | min longitude | max longitude | min latitude | max latitude |
| --- | --- | --- | --- | --- |
| Just gravity 10x10 model | -19.26234327308323 | -17.00779037160072 | -0.001620357052609792 | 0.001597669154460668 |
| Adding solar radiation pressure | -19.27060677341495| -16.99899723434899 | -0.001621645528157962 | 0.00160304088716458 |
| removing srp and adding in sun gravity | -19.28590517274607 | -16.98511816379658  | -0.1470006676038395 | 0.1467350527294402 |
| removing sun and adding jupiter gravity | -19.26234276255456 | -17.00779088031061 | -0.00161617070773592 | 0.001593831883171796 |
| removing jupiter and adding phobos | -19.95529754602756 | -16.31114330288946 | -0.00249127786194213 | 0.002470035582794609 |
| removing phobos and adding deimos | -19.95430780118081 | -16.31213123036566 | -0.002562792041421104 | 0.00254320841051411 |
| removing deimos and updating gravity model to be 50x50 | -19.95460110690626  | -16.31184225808087 | -0.002486793441415184 | 0.002464747685257366 |

The Sun's gravity had the most pronounced effect in the North-South direction. It looks like Phobos and Deimos had a smaller effect, but interestingly the two moons were about equal even though they are of very different sizes. Upping the gravity model's fidelity from 10x10 to 50x50, but all in all it looks like those first 10 gravity terms dominate the spacecraft dynamics. Mars is extremely lumpy, it's amazing that the current Mars orbiters can get any sort of precise imagery or data at all.

## Satellite Coverage

![Satellite Coverage Diagram](http://i.imgur.com/fKtQOcC.png)

Satellite coverage can be approximated as a circular region on the surface of Mars. Pick a point on Mars, and then draw a circle that goes `α` degrees east, west, north and south. We can calculate the angle α of the circle if we know the satellite's altitude, the planet's radius, and if we have specified a mask value. In the example calculation below we specify that the satellite needs to be at least 10° above the horizon in order to achieve contact.

```
R: planet's radius (3,390 km for Mars)
r: orbital radius (20,427 km for Mars stationary orbit)
β: mask value (10°)
α = acos(R/r cos(β)) - β
α = 70.59°
```

In the below image, we assume a β angle of 0 and plot the coverage areas of the four Mars stationary orbit slots from earlier. The two stable points are the yellow circles, and the two unstable ones are cyan. This was plotted with Leaflet using tiles from [OpenPlanetaryMap](https://github.com/openplanetary/opm/wiki/OPM-Basemaps).

![Mars stationary satellite coverage with Leaflet](https://marspedia.org/images/9/94/AreostationaryCoverage.png)

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

We demonstrated the stable longitudes for a satellite in Mars stationary orbit. We plotted the coverage area in modern tools to see what possible sites for missions in the 2020's a single stationary satellite could support. A single Mars stationary satellite placed at the stable 167.83 longitude could support 3 missions: the Curiosity rover at Gale crater, the Insight lander at Elysium Planitia, and the Mars 2020 rover at Columbia Hills if that site is chosen. We calculated the eclipses for the satellite and determined that they were not as bad as the eclipses that Earth stationary satellites endure.

For further analysis, we could to determine the amount of fuel required to place a spacecraft in a Mars stationary orbit.

### Interesting Links

* [Stationkeeping in Mars orbit](http://www.planetary.org/blogs/emily-lakdawalla/2013/stationkeeping-in-mars-orbit.html) by Emily Lakdawalla
* [Optimal longitudes determination for the station keeping of areostationary satellites](http://www.sciencedirect.com/science/article/pii/S0032063313000044) by Juan J. Silvaa and Pilar Romero


### License

Source code is licensed under the [MIT license](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/LICENSE_MIT), and tutorial written content is licensed under the [Creative Commons Attribution license](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/LICENSE_CC) by Peter Brandt.

To cite this tutorial, you could do something like this:

> "Mars Stationary Satellite" originally written by Peter Brandt and originally published at [https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/Mars_Stationary_Satellite.md](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/Mars_Stationary_Satellite.md)
