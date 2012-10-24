var ampule = function(melody, totalDuration) {
	//Initialize the variables (build the context, node, etc.)
	var context = new webkitAudioContext();
	var node = context.createJavaScriptNode(1024, 0, 1);
	node.onaudioprocess = process;
	var S = context.sampleRate;
	var pointer = currentFloat = 0;

	buffer = new ArrayBuffer(4 * Math.ceil(totalDuration * S/1000));
	genData = new Float32Array(buffer);

	//Fill the genData buffer with the rendered music.
	for(var i=0; i<melody.length; i++) {
		var note = melody[i];

		//Adding polyphony. If note is a single number then make it an array of 1.
		if(!note.note[0])
			note.note = [note.note];

		var duration = note.duration * S/1000;
		var ar = note.ar || 1;

		note.shape = note.shape || 1;
		if(!note.shape[0])
			note.shape = [note.shape];

		for (var samp=currentFloat; samp<(duration + currentFloat); samp++) {
			genData[samp] = 0;

			for(var n in note.note) {
				for(var s in note.shape) {
					var freq = 440*Math.pow(2, note.note[n]/12);
					var shape = note.shape[s];
					var modSamp = samp%(S/freq)
					var maxSamp = S/freq;

					//Render wave from given shape.
					if(shape == 0)
						genData[samp] += 0;
					if(shape == 1)
						genData[samp] += Math.sin(samp*freq*2*Math.PI / S);
					if(shape == 2)
						genData[samp] += 2*(modSamp / maxSamp) - 1;
					if(shape == 3)
						genData[samp] += modSamp > maxSamp*.5 ? 1.0 : -1.0;
					if(shape == 4)
						genData[samp] += 2*Math.random() - 1;
				}
			}

			//Scale wave to fit simple AR envelope
			genData[samp] *= Math.pow((duration-samp+currentFloat)/duration, ar);

			//Finally, scale the wave to the appropriate size
			genData[samp] /= (note.note.length * note.shape.length);
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

	return function() { node.connect(context.destination); };
};
