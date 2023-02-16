const worker = new Worker(new URL(Deno.args[0], import.meta.url).href, { type: "module" });

worker.addEventListener('message', function (e) {
	console.log(e.data.points.join(',') + '\n');
}, false);