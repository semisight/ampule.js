var ampule = function(melody) {
	var context, node, K, buffer, genData;
	var pointer;

	function init() {
		context = new webkitAudioContext();
		node = context.createJavaScriptNode(1024, 0, 1);
		node.onaudioprocess = process;
		K = context.sampleRate / (2 * Math.PI);
		pointer = 0;

		var totalDuration = 0;

		for (var i in melody) {
			totalDuration += melody[i].duration;
		}

		totalDuration = Math.ceil(totalDuration * 44.100);

		console.log(totalDuration);

		buffer = new ArrayBuffer(4 * totalDuration);
		genData = new Float32Array(buffer);
	}

	function fillData() {
		var currentFloat = 0;

		for(var i in melody) {
			var note = melody[i];
			var freq = note.note;
			var duration = note.duration * 44.100;

			for (var samp = currentFloat; samp < (currentFloat + duration); samp++) {
				genData[samp] = Math.sin(samp / (K / freq));
			};
		}
	}

	function process(e) {
		var data = e.outputBuffer.getChannelData(0);

		for(var i=0; (i<data.length && pointer < genData.length); ++i) {
			data[i] = genData[pointer++];
		}

		console.log(pointer, data);

		if(pointer == genData.length) {
			pause();
		}
	};

	function play() {
		node.connect(context.destination);
	}

	function pause() {
		node.disconnect();
	}

	init();
	fillData();

	return {
		play: play,
		pause: pause,
		arr: genData
	};
};