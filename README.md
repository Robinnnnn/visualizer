# 3D Music Visualizer
##### An interactive, 3D music visualizer built using Three.js and Web Audio API.

You can click + drag your mouse to move the camera, and use the scroll to zoom! You can also explore different shapes in the sidebar.

Currently the animation performs best on Chrome. It may take a moment to load if it's your first visit to the site.

<b><a href="http://bit.do/visualizer">Click me for a live demo!</a></b>

# Approach
### Audio

The track itself is stored on dropbox, because they were the only free service I could find that provided secure hotlinks to mp3 files -- this was browser requirement for making XMLHttpRequests.

I used the Web Audio API (WAA) to convert the music into frequency data, specifically as a Javascript <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a>. I then set up and connected three nodes to represent the audio buffer source, the script processor and the analyzer. Setting the analyzer's <a href="https://en.wikipedia.org/wiki/Fast_Fourier_transform">fast fourier transform</a> size to 2048 helped increase the frequency resolution, or the number of "bins" on the analysis window. I also set the buffer size to 2048 after some experimenting, which seemed to strike a nice balance between latency and audio quality.

<b>Eventually I had an array of frequencies where each value represented the amplitude of a unique frequency, and each index represented the amplitude's place on the frequency spectrum.</b> To give a crude example, an array of [100, 150, 100, 30, 35, 30, 125, 150, 150] would encapsulate high bass (100s), low mid (30s), and high highs (100s). It's important to note that an increase in index position didn't represent a constant increase in frequency, but rather a <a href="http://www.sengpielaudio.com/FrequenzspektrumAudioA.gif">logarithmic one</a>.

### Animation

##### Frequency Mapping
Once I had the audio data, my next task was to assign each frequency point to a corresponding 3D particle. <b>In other words, I wanted the amplitudes to reflect as the "height" of the particles</b>. Since the frequency array contained 512 elements, my array of particles had to be around the same length. I also had to scale each amplitude by a factor of 7 to emphasize the variation among frequencies.

##### Exponential Smoothing
When mapping raw sound data over the particles directly, the result was significantly shaky and rough on the eyes. Each individual particle would appear to be constantly flickering rather than moving smoothly. All forms of frequency data come riddled with noise, and I made the mistake of translating that noise directly onto the animation. So I implemented multiple layers of <a href="https://en.wikipedia.org/wiki/Linear_interpolation#Interpolation_of_a_data_set">linear interpolation</a> to the frequency array prior to applying it to the particles, which I found to be a <a href="http://acko.net/blog/animate-your-way-to-glory/">common practice in animation</a>.

##### Shapes
Creating visually striking shapes in 3D was one of the most difficult challenges of this project. I used a counter to keep track of the amount of frames that had been rendered, and used this number to represent the "time" variable in a set of parametric equations. I heavily utilized <a href="http://mathworld.wolfram.com/Sphere.html">Wolfram Alpha</a> to discover a variety of equations to apply to the animation.

I also discovered that a field of billowing sine waves, when viewed from a specific angle, produced an optical illusion that looked like a rotating helix. I used such perspective tricks to avoid having to <i>actually</i> program what the user thought they were seeing.

<img src="http://i.imgur.com/cikMgXJ.png" height="300" width="375"">
<img src="http://i.imgur.com/E6uCiAE.png" height="300" width="225">
<img src="http://i.imgur.com/bsty3Pn.png" height="300" width="300">
<img src="http://i.imgur.com/Ktxcjfr.png" height="300" width="300">

##### Color
I wanted to come up with a way for the colors to continuously change over time, while somehow avoiding "ugly" colors. After playing around with an <a href="http://www.calculatorcat.com/free_calculators/color_slider/rgb_hex_color_slider.phtml">RGB slider</a>, I discovered that incrementing between 0 and 1 for a specific color (R, G or B) while anchoring at least one other color at 1 helped keep the colors nice and pretty. There were 6 total states for this (3 colors * 2 possible positions for each color), so I developed an algorithm that triggered "color slides" between these states. I also created a helper function to manage the speed of the color shift simply by inputting a desired duration. Finally, I bumped up the slider scale to modulate between a range of 0.5 and 1.5 (as opposed to 0 and 1) to give them a lighter look.

##### Particle Size
The sizes of each particle were determined by trigonometric functions dependent on the frame count mentioned above, as well as their index in the array. This created a cascading effect of size shifting, as opposed to having all of the particles change size in unison.

##### Particle Material
I wanted each particle to be a miniature sphere. That said, generating and rendering hundreds of spheres in real time was taxing on the processor. Fortunately Three.js provided a material called a <i>sprite</i>, which was a 2D shape that always faced the user. This meant that the user always saw a circle despite changing his or her perspective, providing the illustion of a sphere without having to render any depth. 

# Major Challenges & Looking Forward
##### Optimized Linear Interpolation
Linear interpolation -- also known as <i>lerping</i> -- requires datasets from multiple time periods. In order to apply <i>n</i> layers of lerping to the frequency data at <i>t</i> = 0, I needed access to the datasets from <i>t</i>-1, <i>t</i>-2, <i>t</i>-3, ... , <i>t</i>-n. This led to two critical issues:
* It would be impossible to lerp the first <i>n</i> frames of data; nothing would render until the user was <i>n</i> frames into the animation.
* There would be an <i>n</i>-frame latency between the animation and the music. <b>There was a tradeoff between smoothing the animation and causing a perceived delay by the n-frame lag.</b>

I basically wanted to get away with applying as many lerps as possible before the animation looked noticeably sluggish. The magic number seemed to be 5.

In the future, I'd like to actually delay the animation and music playback according to the number of lerps I've applied to the data. This would provide an even smoother animation that is in perfect sync with the music. Though the animation would begin <i>n</i> frames later than usual, it would be negligible given the 60FPS framerate. 

##### Smart Color
Currently the colors are set to cycle through a basic series of RGB combinations. It would be great to have the colors a) change according to elements in the music, such as a downbeat, and b) represent the frequencies and amplitude of the music (e.g. red = bass, loud = bright).

##### Music Customization
Many users have requested a feature to hook up the visualizer to third-party webites such as YouTube or SoundCloud. This would be a major challenge given that I'm currenty playing and analyzing the music through an XMLHttpRequest that directly accesses a secure hotlink.

One solution would be to request access to the user's internal microphone. It's certainly possible to produce animations from the user's external mic. If I could somehow prompt the user to set their mic settings to internal, I could potentially render music not only playing from a website, but from an application such as iTunes or Spotify.

##### More Particles
The amount of frequency data I received from WAA limited me to animating ~512 particles. If I wanted to render a higher-resolution animation with the same number of frequency elements, I would create a new array with double or triple the original length, containing the original frequencies with newly calculated ones in between. Attempting this brute-force at 60FPS was too much for my processor so I'd have to come up with a more elegant algorithm.

##### Audio Manager / Player
Implement a player that displays the track title, artist, time length, and play / pause options.

##### Loading Animation
First-time users usually have to wait longer for the music to load because the track analysis hasn't been cached; this may cause some to feel like the app is broken.
