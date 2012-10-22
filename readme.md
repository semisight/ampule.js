Ampule.js: A small audio synthesis library
---

Ampule.js is a library that returns access to a global object that can play simple melodies. This library is *not* intended to be replete with features; the only feature here is size (after minification and compression of course).

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