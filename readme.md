Ampule.js: A small audio synthesis library
---

Ampule.js is a library that returns a function that can play simple melodies when evaluated. This library is *not* intended to be replete with features; the only feature here is size (after minification and compression of course). This was written a while ago for fun, and targets the Chrome browser (any other browser compatibility is purely coincidental).

##How to Use:

Simply pass a melody object (more on that in a minute) to the ampule() function.

##Melody Object

A melody object is an array of maps. Each map is a note. It looks like this:

```javascript
[
	{
		note: 440,
		duration: 500 //ms
	},
	{
		note: 563,
		duration: 250
	},
	...
];
```

This is the structure for each note map (as of this commit):

```javascript
{
	//Required
	note: x 	//frequency (Hz)
	duration: y	//length of the note (ms)

	//Optional
	shape: z	//Number {1: sine, 2: sawtooth, 3: square}
}
```
