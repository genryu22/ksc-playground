const worker = new Worker(new URL("./mps.js", import.meta.url).href, { type: "module" });

worker.addEventListener('message', function (e) {
	console.log(e.data.points);
}, false);