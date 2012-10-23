var ampule = function(melody, totalDuration) {
	var context, node, S, pointer, buffer, genData, currentFloat;

	//Initialize the variables (build the context, node, etc.)
	context = new webkitAudioContext();
	node = context.createJavaScriptNode(1024, 0, 1);
	node.onaudioprocess = process;
	S = context.sampleRate;
	pointer = currentFloat = 0;


	buffer = new ArrayBuffer(4 * Math.ceil(totalDuration * S/1000));
	genData = new Float32Array(buffer);

	//Fill the genData buffer with the rendered music.
	for(var i=0; i<melody.length; i++) {
		var note = melody[i];
		var freq = 440*Math.pow(2, note.note/12);
		var duration = note.duration * S/1000;
		var shape = note.shape || 0;
		var ar = note.ar || 2;

		for (var samp=currentFloat; samp<(duration + currentFloat); samp++) {
			var modSamp = samp%(S/freq), maxSamp = S/freq;

			//Render wave from given shape.
			if(shape == 0)
				genData[samp] = 0;
			if(shape == 1)
				genData[samp] = Math.sin(samp*freq*2*Math.PI / S);
			if(shape == 2)
				genData[samp] = 2*(modSamp / maxSamp) - 1;
			if(shape == 3)
				genData[samp] = modSamp > maxSamp*.5 ? 1.0 : -1.0;
			if(shape == 4)
				genData[samp] = 2*Math.random() - 1;

			//Scale wave to fit simple AR envelope
			genData[samp] *= Math.pow((duration-samp+currentFloat)/duration, ar);

			//Run the wave through a low-pass filter
			var temp = samp==0 ? genData[samp] : .5*genData[samp] + .5*genData[samp-1];

			//or, in the case of a drum, a high-pass filter
			genData[samp] = shape==4 ? genData[samp] - temp : temp;

			//optional: convert to "8-bit"
			//genData[samp] = Math.round(genData[samp]*128)/128;
		}

		currentFloat += duration;
	}

	function process(e) {
		var data = e.outputBuffer.getChannelData(0);

		for(var i=0; i<data.length && pointer<genData.length; ++i) {
			data[i] = genData[pointer++];
		}

		if(pointer == genData.length)
			node.disconnect();
	};

	console.log(genData);
	return function() { node.connect(context.destination); };
};
