# Mars Stationary Communications Satellite

A satellite in Mars stationary orbit.

## Table of Contents

- Mars gravity model
- Plotting satellite coverage
- Eclipses
- Occultations
- Deep space network communication
- Station keeping maneuvers


## Mars Stationary Orbit

A stationary orbit is one where a satellite orbits around the planet at the same speed at which the planet itself rotates, causing the satellite to appear stationary in the sky above one part of the planet. To calculate the orbital radius `r` for a Mars stationary orbit, set the downward acceleration due to gravity equal to the centripetal acceleration of the satellite moving in a circle with the same rotational speed as Mars, `ω`.

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
GMAT ReportFile1.Filename = '/home/peter/code/flight-dynamics-tutorials/output/Mars-stationary-year.csv';
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
MARS_DAY = 88775.222 % seconds
T = 0

% initialize report
Report ReportFile1 CSV_HEADER
Report ReportFile1 DefaultSC.UTCGregorian DefaultSC.Mars.Latitude DefaultSC.Mars.Longitude

SEGMENT_END = MARS_DAY * 200
While T < SEGMENT_END
  Propagate DefaultProp(DefaultSC) {DefaultSC.ElapsedSecs = MARS_DAY};
  T = T + MARS_DAY
  Report ReportFile1 DefaultSC.UTCGregorian DefaultSC.Mars.Latitude DefaultSC.Mars.Longitude
EndWhile
```

[yikes] the longitude changes a lot over time. Maybe we got the altitude wrong. We could try updating the altitude and see if that helps. In your mission plan, change `GMAT DefaultSC.X = 20448` to 20424.

there are stable longitudes for stationary orbits. Mars is lumpy like Earth, so there are gravitational hills and valleys. If you place a stationary orbit at the bottom of a valley or balance it on top of a hill, it's easier to keep the satellite in that same spot. The two valleys are 17.92W and 167.83E, and the two hills are 105.55W and 75.34E.

So it looks like we'll have to do some serious station keeping if we want to keep the satellite exactly at a specific latitude. Pardon my french, but fuck that. Let's see if the satellite can still cover what we want it to cover even if we let it freely wander off the nominal orbital slot. We have this liberty at Mars because there's nothing else there, but in Earth orbit this would never fly.


## Satellite Coverage

Satellite coverage is not super interesting for a Mars mission unless you know what you want to be covering. Let's use something I made along time ago: a catalog of the exploration zones propsed at a conference in 2016 (wow waaaay back). We'll see how many of the top candidates we can hit with one Mars stationary satellite.

![Satellite Coverage Diagram](http://i.imgur.com/fKtQOcC.png)

Satellite coverage can be approximated as a circular region on the surface of Mars. Pick a point on Mars, and then draw a circle that goes `α` degrees east, west, north and south. We can calculate the angle α of the circle if we know the satellite's altitude, the planet's radius, and if we have specified a mask value (like the satellite needs to be at least 10° above the horizon in order to work).

```
R: planet's radius (3,390 km for Mars)
r: orbital radius (20,427 km for Mars stationary orbit)
β: mask value (10°)
α = acos(R/r cos(β)) - β
α = 70.59°
```

## Eclipses

Geostationary satellites on earth have two eclipse seasons per year, with the longest continuous period of darkness being about seven hours long. Operators have to prepare the power systems for this mode of operation and then when the eclipse period is over they put the satellite back into normal mode for solstice season.
