var ampule = function(melody) {
	var context, node, S, K, buffer, genData;
	var pointer;

	function init() {
		context = new webkitAudioContext();
		node = context.createJavaScriptNode(1024, 0, 1);
		node.onaudioprocess = process;
		S = context.sampleRate;
		K = S / (2 * Math.PI);
		pointer = 0;

		var totalDuration = 0;

		for (var i in melody) {
			totalDuration += melody[i].duration;
		}

		totalDuration = Math.ceil(totalDuration * 44.100);

		buffer = new ArrayBuffer(4 * totalDuration);
		genData = new Float32Array(buffer);
	}

	function fillData() {
		var currentFloat = 0;

		for(var i=0; i<melody.length; i++) {
			var note = melody[i];
			var freq = note.note;
			var duration = note.duration * 44.100;
			var shape = 1;
			if("shape" in note) shape = note.shape;

			for (var samp=currentFloat; samp<(duration + currentFloat); samp++) {
				var modSamp = samp%(S/freq), maxSamp = S/freq;
				if(shape == 1) {
					genData[samp] = Math.sin(samp*freq / K);
				}
				if(shape == 2) {
					genData[samp] = modSamp / maxSamp;
				}
				if(shape == 3) {
					genData[samp] = modSamp > maxSamp*.5 ? 1.0 : -1.0;
				}
			}

			currentFloat += duration;
		}

		console.log(genData);
	}

	function process(e) {
		var data = e.outputBuffer.getChannelData(0);

		for(var i=0; i<data.length && pointer<genData.length; ++i) {
			data[i] = genData[pointer++];
		}

		if(pointer == genData.length)
			node.disconnect();
	};

	init();
	fillData();

	return {
		play: function() {node.connect(context.destination)},
		pause: node.disconnect,
		arr: genData
	};
};
