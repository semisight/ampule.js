var ampule = function(melody) {
	var context, node, S, pointer, totalDuration, buffer, genData, currentFloat;

	//Initialize the variables (build the context, node, etc.)
	context = new webkitAudioContext();
	node = context.createJavaScriptNode(1024, 0, 1);
	node.onaudioprocess = process;
	S = context.sampleRate;
	pointer = totalDuration = currentFloat = 0;

	for (var i in melody) {
		totalDuration += melody[i].duration;
	}

	totalDuration = Math.ceil(totalDuration * 44.100);

	buffer = new ArrayBuffer(4 * totalDuration);
	genData = new Float32Array(buffer);

	//Fill the genData buffer with the rendered music.
	for(var i=0; i<melody.length; i++) {
		var note = melody[i];
		var freq = note.note;
		var duration = note.duration * 44.100;
		var shape = note.shape || 1;

		for (var samp=currentFloat; samp<(duration + currentFloat); samp++) {
			var modSamp = samp%(S/freq), maxSamp = S/freq;
			if(shape == 1)
				genData[samp] = Math.sin(samp*freq*2*Math.PI / S);
			if(shape == 2)
				genData[samp] = 2*(modSamp / maxSamp) - 1;
			if(shape == 3)
				genData[samp] = modSamp > maxSamp*.5 ? 1.0 : -1.0;
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

	return {
		play: function() {node.connect(context.destination)},
		pause: node.disconnect,
		arr: genData
	};
};
