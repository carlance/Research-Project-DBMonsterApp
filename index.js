var urls = {
	react: 'http://mathieuancelin.github.io/js-repaint-perfs/react/',
	angular: 'http://mathieuancelin.github.io/js-repaint-perfs/angular/',
	backbone: 'http://mathieuancelin.github.io/js-repaint-perfs/backbone/'
}
var browserPerf = require('browser-perf');
var FILE = 'data.json';
var fs = require('fs');
if (!fs.existsSync(FILE)) {
	fs.writeFileSync(FILE, JSON.stringify({}));
}

var frameworks = Object.keys(urls);
(function runTest(i) {
	if (i >= frameworks.length) {
		console.log('All tests done');
		return;
	}

	repeatTest(frameworks[i], function() {
		runTest(i + 1);
	});
}(0));


function repeatTest(framework, cb) {
	var REPEAT = 10;
	console.log('Running test for %s', framework);
	(function iterate(i) {
		if (i >= REPEAT) {
			console.log('All tests done for %s', framework);
			cb();
			return;
		}

		console.log('[%d|%d]', i, REPEAT);
		browserPerf(urls[framework], function(err, result) {
			if (err) {
				console.error(err);
			} else {
				var data = JSON.parse(fs.readFileSync(FILE));
				if (typeof data[framework] === 'undefined') {
					data[framework] = {};
				}
				result.forEach(function(res) {
					for (var metric in res) {
						if (typeof data[framework][metric] === 'undefined') {
							data[framework][metric] = [];
						}
						data[framework][metric].push(res[metric]);
					}
				});
				fs.writeFileSync(FILE, JSON.stringify(data));
			}
			iterate(i + 1);
		}, {
			selenium: 'http://localhost:9515',
			browsers: ['chrome']
		});

	}(0));
}