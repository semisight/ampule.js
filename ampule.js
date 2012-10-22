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

		for(var i=0; i<melody.length; i++) {
			var note = melody[i];
			var freq = note.note;
			var duration = note.duration * 44.100;

			for (var samp=0; samp<duration; samp++) {
				genData[samp+currentFloat] = Math.sin(samp / (K / freq));
			}

			currentFloat += duration;
		}

		console.log("Current float: " + currentFloat);
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