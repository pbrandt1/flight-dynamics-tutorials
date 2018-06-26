# GMAT Simulation of Project Echo

A GMAT flight dynamics tutorial.

![Echo II](https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Echo_II.jpg/1280px-Echo_II.jpg)

<div class="caption">Echo II, the largest inflatable satellite ever flown</div>

## Table of Contents

* [About Echo](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md#about-echo)
* [Installing GMAT](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md#installing-gmat)
* [Simulating Echo I's First Orbit](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md#simulating-echo-is-first-orbit)
* [Plotting the Ground Track with Plot.ly](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md#plotting-the-ground-track-with-plotly)
* [Propagating for 150 days](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md#propagating-for-150-days)
* [Comparison with Echo I Observations](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md#comparison-with-echo-1-observations)
* [Conclusions](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md#conclusions)

## About Echo

Echo 1 was launched at 5:39 AM EDT on 12 August 1960, and at 7:41 AM it reflected its first message from Los Angeles to New Jersey while still on its first orbit. It was a recorded message that went like this.

It was packed into a tiny spherical capsule that looked like this

![Echo 1 inside its launch capsule](https://i.imgur.com/k1KdFQv.png)

It inflated in space not with compressed air, but with sublimating powders. [This video](https://www.youtube.com/watch?v=qz3-b7sB9CA) shows what Echo II's inflation looked like. Below is a short gif from the video.

![Echo II Satelloon Inflation, 1964](https://i.makeagif.com/media/6-23-2018/hrXdhv.gif)

Hopefully you're thinking right now that the Echo satellites were pretty cool. You could see it from anywhere in the world, though apparently at least my own grandparents didn't look up. It looks like there was too much other stuff going on in the news that day: Discoverer XIII's capsule was recovered from space on the same day and also the captured U2 pilot Gary Powers was on trial in Moscow for espionage or something. In the newspaper archives for the following day, I didn't see much relating to Echo I, but I did see one funny headline reading "Next Task for Discoverer Capsule: Bring a Space Monkey Back Alive." What a wild time to be alive that must have been.

Echo was scientifically important for creating accurate atmospheric and gravity models in addition to its role as a passive communications satellite. Another reason I personally like the project is that the second message transmitted via Echo originated a couple blocks from where I grew up, at the Collins Radio Company in Cedar Rapids, IA.

## Installing GMAT

You can download GMAT and view instructions for installing on your system [here](https://sourceforge.net/projects/gmat/files/GMAT/GMAT-R2016a/).

**Windows**

Download and launch [gmat-winInstaller-i586-R2016a.exe](https://sourceforge.net/projects/gmat/files/GMAT/GMAT-R2016a/gmat-winInstaller-i586-R2016a.exe/download), and run GMAT from the start menu.

**Mac**

Download [gmat-macosx-x64-R2016a.zip](https://sourceforge.net/projects/gmat/files/GMAT/GMAT-R2016a/gmat-macosx-x64-R2016a.zip/download), unzip it with `unzip gmat-macosx-x64-R2016a.zip` and then find GMAT_Beta.app in the bin folder and run `open GMAT_Beta.app` to launch GMAT.

**Linux**

I'm fairly confident you can do this yourself. Here's a troubleshooting tip if you need it, though:
> If on linux and you get the following error `./GMAT-R2016a: error while loading shared libraries: libpng12.so.0: cannot open shared object file: No such file or directory`, then you have to find libpng12 somewhere. You can try to find it with `locate libpng12`. On my computer, Steam had installed its own version of libpng12, so I copied that over to /usr/lib with `sudo cp ~/.local/share/Steam/ubuntu12_32/steam-runtime/amd64/lib/x86_64-linux-gnu/libpng12.so.0 /usr/lib`. If `locate libpng12` doesn't show any results for you, then you'll have to try something different, maybe with backports. Just copying your libpng**16** object to libpng**12** won't work.

## Simulating Echo I's First Orbit

We'll start by simulating the first orbit of the first Echo satellite. This first part is pretty much the same as the first tutorial from the [GMAT docs](http://gmat.sourceforge.net/docs/R2018a/help.html). Bookmark that page because it's impossible to find.

To do this we will need its initial orbital parameters and the satellite's physical characteristics.

| | |
| --- | --- |
| Launch Date | Aug 12, 1960 |
| Eccentricity | 0.01029 |
| Perigee altitude | 1,527 km |
| Inclination | 47.232° |
| Orbital Period | 118 min |
| Argument of perigee (ω) | 17.685° |
| Right ascension of the ascending node (Ω) | 254.987° |
| True Anomaly | 137.652° |
| Diameter | 30.5 m |
| Mass | 71.4 kg |

We will not simulate the ascent phase of the vehicle, just the free-flying satellite trajectory. To get these initial conditions, I took the recorded position of the satellite at 12:00 UTC on Aug 12 (obtained from [Zadunaisky et al](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/reference/1961%20Zadunaisky%20-%20Experimental%20and%20theoretical%20results%20on%20the%20orbit%20of%20Echo%20I.pdf)) and back-propagated to the approximate moment of orbital insertion, 09:49 UTC on Aug 12.  We'll skip learning backwards propagation for now, but at least you know it's an option.

In the first part of this tutorial we'll use the GUI to create a GMAT mission plan. In later sections we'll drop the GUI in favor of text scripting (the GUI is great though and you can always return to it).

### Set the spacecraft state

Fire up GMAT and open up a new mission.

Double click on Spacecraft > DefaultSC in the Resources tree.

* Select Epoch Format > TAIModJulian
* Edit Epoch = 7158.90787
* Select State Type > Keplerian
* Edit SMA = 7980
* Edit ECC = 0.01029
* Edit INC = 47.232
* Edit RAAN = 254.987
* Edit AOP = 17.685
* Edit TA = 137.652

Switch over to the Ballistic/Mass tab.

* Edit Dry Mass = 71.4
* Keep Coefficient of Drag = 2.2
* Edit Coefficient of Reflectivity = 1.0 (for a sphere)
* Edit Drag Area = 730
* Edit SRP Area = 730

Click OK, then go ahead and save your work with File > Save and save this mission as `Echo-first-orbit.mission` or whatever you want.

### Configure the propagator

Double click on Propagators > DefaultProp in the Resources tree.

* On the right hand side, Edit Gravity Degree = 10
* Edit Gravity Order = 10
* Click the Select button under Point Masses, then select Sun and Luna (the Moon)
* Select checkbox "Use Solar Radiation Pressure"

Before configuring the atmosphere model in the propagator settings, download the 1957-present space weather file from [Celestrak](https://celestrak.com/SpaceData/).

* Select Atmosphere Model > JacchiaRoberts
* Click Setup
* Under Model Selection, Historic/Near Term, Select CSSISpaceWeatherFile
* Under Files, CSSISpaceWeatherFile, point to the sw19571001.txt file you downloaded
* Under SchattenPredict, point to GMAT/R2018a/data/atmosphere/earth/SchattenPredict.txt
* Click OK to confirm the atmosphere settings
* Click OK to confirm the propagator settings

There are a couple of common questions about this part, one is why we chose the Jacchia Roberts atmosphere model. The short answer is because nothing better is available for initial prototyping. The Jacchia model computes atmospheric density using latitudinal, seasonal, geomagnetic, and solar effects. This model is valid only for altitudes over 100 km, so it should not be used for the launch phase (fine for us). It's great for the early phases of a project, before you have observational data to validate your model. Once the satellite is in the operations phase you can try different models (Jacchia, MSISE, CIRA) and see which one better predicts the observed behavior of your spacecraft, but in general there is no way to predict beforehand which one will perform better for any particular mission. Soon we will have real-time atmospheric measurements deduced from GPS signal measurements in space, which could make operational flight dynamics models more accurate. Right now it's unclear if these measurements will be provided for a fee from a commercial company or provided for free from the government, but either way it's not available yet and so we should stick with the statistical Jacchia and MSISE-2000 models.

The models need a space weather file, which we downloaded from [Celestrak](https://celestrak.com/SpaceData/).

Then next question is about solar radiation pressure. Solar radiation pressure is like solar wind driving a solar sail, and since the Echo satellites are so big and so light, solar radiation pressure definitely plays role in flight dynamics. You can see the difference too by toggling it on and off and observing the results. There are other effects related to heating and cooling caused by the sun which we won't model: the Yarkovsky effect which requires knowledge of the rotation of the spacecraft (which we don't have), and Poynting–Robertson drag, which effects space _dust_ not space _craft_.

We use kind of a basic gravity model because cranking up the fidelity of gravity gives us diminishing returns. Atmospheric drag and spacecraft deflation uncertainties account for the highest loss of precision over time, but you need to know about gravity anyway. For quick prototyping, it's best to use a lower-fidelity model so that mission run times are manageable, like JGM-2 with degree and order values of 10. For high accuracy, you can use EGM-96 with degree and order of 360. EGM-2008 is not available in GMAT yet, but that would allow degree 2190 and order 2159. Keep in mind that higher fidelity gravity models take longer to compute, and that gravitational effects are more pronounced for some mission profiles, like repeating ground track missions in low earth orbit, where the spacecraft is closest to Earth's bulges and tides which repeatedly pull the satellite this way and that. Gravity is also important for geosynchronous operations.

### Configure outputs

Double click on Output > DefaultOrbitView in the Resources tree. Graphical output is one of the weak points of GMAT, especially on Linux, so we won't do too much with it, but hey let's try it!

* Unselect checkbox Enable Stars (or leave selected if you like)
* Set the view point to be 15000, 15000, 10000

Click OK and save.

### Configure the propagate command

In the tree view, select the Mission tab instead of Resources tab. Double click Propagate1. We will set the propagator to stop after one full orbit of 118 minutes, or 7094 seconds.

* Edit the Condition under Stopping Conditions to be 7094.

Click OK and save.

### Run the mission

Click the big play button to run the mission. If you're on windows, everything should look pretty nice. If on Linux, things probably won't look right, for instance the Ground Track plot doesn't show up and in the Orbit View the Earth is rendered inside-out. You can then click the Animation Start button (the little play button) to watch Echo jerkily propagate through its orbit.

Congratulations, you've completed a simulation of a historical spacecraft using a modern, validated tool. Now you no longer have to rely on custom, un-vetted Matlab scripts for satellite flight dynamics.

## Plotting the Ground Track with Plot.ly

So since GMAT's ground track view doesn't work out of the box on my linux machine, I decided to make my own ground track using [plotly](https://plot.ly). For this, we will need to write the orbital data to a CSV report file.

### Configure Report File

Right click on Outputs and choose Add > Report File. In this report file, we will save the latitude and longitude of the spacecraft, which we need for plotting the ground track. We will also save the date in the UTCGregorian format, which is the date format we are all familiar with today. UTCModJulian, the default, is like for ye olde astronomers.

* Unselect checkbox Fixed Width
* Pick Delimiter = comma
* Click Edit under the parameter list and add:
* Latitude
* Longitude
* UTCGregorian (the familiar "12 Aug 1960 09:47:20.034" format)
* Click Browse and make it save data as `Echo-first-orbit.csv` in the `output` folder of this directory if you cloned this repo.

Save and run the mission, and you should now have a fresh CSV file in the output folder.

### Using Plot.ly

Plotly is a javascript library, so we are going to run a small web server to run an index.html web page that will plot the satellite's ground track in a web browser. I used [node.js](https://github.com/mklement0/n-install) and [budo](https://www.npmjs.com/package/budo) when developing the web page, but you can just use python to serve it, since everybody has python.

Type the following in a terminal.

```sh
python -m SimpleHTTPServer 9966
```

Then go to http://localhost:9966/Echo.html to view the plot. It should look something like this, which I saved to my computer using the convenient "Save as png" button that plotly provides.

![Echo's ground track plotted with plot.ly](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/output/Echo-ground-track.png)

Feel free to read through index.html and index.js to see how it all works. Explaining plotly is out of the scope of this tutorial, but get in touch with me via linkedin or facebook (links at [peterbrandt.space](https://peterbrandt.space)) if you'd like to learn more.

Next we will tackle slightly more advanced concepts, like editing the mission sequence script directly and modeling changes in spacecraft mass throughout propagation.

## Propagating for 150 days

For longer propagations, we'll want to cut out the computations that we don't care about so that the simulation completes before too long. We will also add another plot in plot.ly to see how the orbital parameters change over time.

### Edit Script for Speed

Previously, we were only propagating the spacecraft for one orbit, 118 minutes. Run times should be almost unnoticeable for this duration, but propagating for six months might take several minutes if we leave the mission unchanged. So the first thing we will do is attempt to make the simulation run a little faster by removing the GUI output components completely and running the mission in headless mode from the command line. For this, we will edit the mission file with a regular text editor.

Save the mission plan to a new file, `Echo-150-days.mission`. Open it up in your favorite editor (I'm using [atom](https://github.com/atom/atom)), and scroll down to the Subscribers section. Remove the hunks of code that create the orbit view and the ground track, but leave the report file.

We will modify the report file part in the following ways.

* Change the file name from `Echo-first-orbit.csv` to `Echo-150-days.csv`
* Change the line that specifies the reported properties to `GMAT ReportFile1.Add = {DefaultSC.UTCGregorian, DefaultSC.Earth.ECC};`
* Change `GMAT ReportFile1.WriteReport = true;` to `GMAT ReportFile1.WriteReport = false;` because we will manually write to the report file rather than write for every propagation step
* Change `GMAT ReportFile1.WriteHeaders = true;` to `GMAT ReportFile1.WriteHeaders = false;` because we will manually write the headers as a workaround for a bug in GMAT

### Model Mass Losses

One important thing to simulate when propagating the spacecraft over a long period of time is the change in mass. According to [Zadunaisky et al](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/reference/1961%20Zadunaisky%20-%20Experimental%20and%20theoretical%20results%20on%20the%20orbit%20of%20Echo%20I.pdf), submlimating powders used for inflation made up 21% of the spacecraft mass, and holes punctured in the balloon by micrometeoroids allowed that gas to escape, gradually reducing the spacecraft mass over time. The authors found that a good model was that the balloon's total mass decreased by 0.64 lb/day for the first 13 days, and 0.16 lb/day after that.

To model the decreasing mass, we will make a couple of propagation loops where the mass is reduced by a small fraction each day. In your script file, replace the existing mission sequence part (at the very end) with this.

```c
%----------------------------------------
%---------- Mission Sequence
%----------------------------------------

% Create all variables before BeginMissionSequence
Create Variable ONE_DAY T SEGMENT_END MIN_MASS
Create String CSV_HEADER
CSV_HEADER = 'DefaultSC.UTCGregorian,DefaultSC.Earth.ECC'

BeginMissionSequence

% After BeginMissionSequence you can do math, though you cannot in-line them
ONE_DAY = 24 * 60 * 60
T = 0

% MIN_MASS is the minimum mass of echo I, which is 79% of the initial mass because 21% is the inflation gas
MIN_MASS = 0.79 * DefaultSC.DryMass

% initialize report
Report ReportFile1 CSV_HEADER
Report ReportFile1 DefaultSC.UTCGregorian DefaultSC.Earth.ECC

% Propogate the the first 13 days losing 0.3 kg/day
SEGMENT_END = ONE_DAY * 13
While T < SEGMENT_END
  Propagate DefaultProp(DefaultSC) {DefaultSC.ElapsedSecs = ONE_DAY}
  T = T + ONE_DAY
  DefaultSC.DryMass = DefaultSC.DryMass - 0.3
  Report ReportFile1 DefaultSC.UTCGregorian DefaultSC.Earth.ECC
EndWhile

% Propogate until day 150 losing 0.07 kg/day until all gas is depleted
SEGMENT_END = ONE_DAY * 150
While T < SEGMENT_END
  Propagate DefaultProp(DefaultSC) {DefaultSC.ElapsedSecs = ONE_DAY}
  T = T + ONE_DAY
  If DefaultSC.DryMass > MIN_MASS
    DefaultSC.DryMass = DefaultSC.DryMass - 0.07
  EndIf
  Report ReportFile1 DefaultSC.UTCGregorian DefaultSC.Earth.ECC
EndWhile
```

There are more things that we could try to model, like how the balloon deformed as the pressurizing gas escaped. But for this tutorial our model assumes that the drag area, SRP area, and importantly the coefficients of drag and reflectivity remain constant, which would not be true as Echo deforms and becomes wrinkly due to deflation. Hopefully our model is good enough, so let's run it from the terminal.

```sh
GMAT-R2016a -m -x -r Echo-150-days.mission
```

On my computer (Intel Core i7-6500U CPU @ 2.50GHz running the linux build of GMAT), the run took 50 seconds.

## Comparison with Echo 1 Observations

Just like before, make sure you have `python -m SimpleHTTPServer 9966` running in a terminal and then go to (or refresh) http://localhost:9966/Echo.html. If you saved the report file csv output correctly, then more plots should appear.

![Echo eccentricity plotted with plotly](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/output/Echo-eccentricity.png)

Pretty ok.

## Conclusions

I found it was easiest to put together the basic components of a mission using the GUI first, and then edit the script manually from then on. I preferred using a report file and plotly for data visualization over the native visualization capabilities of GMAT.

The GMAT simulation accurately captured the change in orbital parameters over time. Unmodeled changes in satellite shape and mass over time likely caused our simulated model to drift off the observed trajectory a bit.

### Interesting Links

* [Launch Video of Echo 1](https://youtu.be/NO2LkmBDle4?t=1m30s)
* [The Odyssey of Project Echo](https://history.nasa.gov/SP-4308/ch6.htm)
* [KSP and GMAT github projectT](https://github.com/bryan-lunt/KSP_GMAT)
* [Julia GMAT bindings](https://github.com/JuliaAstrodynamics/GMAT.jl)
* [GMAT docs](http://gmat.sourceforge.net/docs/R2018a/help.html)

### License

Source code is licensed under the [MIT license](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/LICENSE_MIT), and tutorial written content is licensed under the [Creative Commons Attribution license](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/LICENSE_CC) by Peter Brandt.

To cite this tutorial, you could do something like this:

> "GMAT Simulation of Project Echo" originally written by Peter Brandt and originally published at [https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md](https://github.com/pbrandt1/flight-dynamics-tutorials/blob/master/GMAT_Simulation_of_Project_Echo.md)
