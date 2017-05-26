# Areostationary Communications Satellite

A satellite in Mars stationary orbit.

## Table of Contents

- Mars gravity model
- Plotting satellite coverage
- Deep space network communication
- Station keeping maneuvers


## Areostationary Orbit

A stationary orbit is one where a satellite rotates around the planet at the same speed at which the planet itself rotates. To calculate the orbital radius `r` for an areostationary orbit, set the downward acceleration due to gravity equal to the centripetal acceleration of the body moving in a circle with the same rotational speed as Mars, `ω`.

```
gravity = centripetal acceleration
   μ/r² = ω²r
      r = ∛(μ/ω²)
      r = 20427 km
```

Mars stationary orbit is above Phobos (9,376 km) and below Deimos (23,463 km).

### Define new coordinate systems

* In the Resources tree, right click the Coordinate Systems folder and select "Add Coordinate System"
* Name it MarsFixed
* Origin > Mars
* Axes Type > BodyFixed

Then make another coordinate system called MarsInertial that uses BodyInertial axes.

### Set the spacecraft state

* Double-click on DefaultSC
* Select Coordinate System > MarsFixed
* Edit X = 20427
* Edit Y = 0
* Edit Z = 0
* Edit VX = 0
* Edit VY = 0
* Edit VZ = 0

### Configure propagator

* Double-click on DefaultProp
* Select Central Body > Mars
* Select Primary Body > Mars
* Select Gravity Model > Mars-50C'

The moons of Mars, Phobos and Deimos, pass close to areostationary orbit, so we will need to add them to the calculation. GMAT doesn't have them by default, but we can create them.

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
* Switch to Orbit tab
* Set NAIF ID = 402

Now go back to the propagator properties

* Under Point Masses click Select
* Add Phobos and Deimos
* Click ok

Now you'll need ephemeris data for them. Go go https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/ and download mar097.bsp, or whatever is the most recent marxxx.bsp file (mar = Mars). Then:

* Double-click on the SolarSystem folder in the tree view
* Select Ephemeris Source > SPICE
* SPK Kernel > Select the marxxx.bsp file you just downloaded

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

![Areostationary satellite around Mars, with Phobos and Deimos orbits included](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/output/Areostationary+phobos+deimos.gif)
