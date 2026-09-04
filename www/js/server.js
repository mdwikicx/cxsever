var express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
var segments_main = require('./lib/d/segments_main.js');
var pa = require('./lib/d/pa.js');

var app = express();

// app.use(cors({ origin: ['http://localhost:300']}));

app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.get("/page/:title", function (req, res) {
	const title = req.params.title;

	pa.get_text_new(title, 'mdwiki.org', function (text) {
		const result = segments_main.HtmltoSegments(text);
		res.send({
			title: title,
			result: result
		});
	});
});

app.get("/textwmcloud/:title", function (req, res) {
	const title = req.params.title;

	pa.get_text_new(title, 'mdwiki.wmcloud.org', function (text) {
		res.send({
			title: title,
			result: text
		});
	}
	);
});

app.get("/pagetext/:title", function (req, res) {
	const title = req.params.title;

	pa.get_text_new(title, 'mdwiki.org', function (text) {
		res.send({
			title: title,
			result: text
		});
	}
	);
});

app.get("/PageHtmlDomain/:domain/:title", function (req, res) {
	const title = req.params.title;
	const domain = req.params.domain;

	pa.get_text_new(title, domain, function (text) {
		res.send({
			title: title,
			result: text
		});
	}
	);
});

app.post(["/HtmltoSegments", "/textp"], (req, res) => {
	const sourceHtml = req.body.html;

	if (!sourceHtml || sourceHtml.trim().length === 0) {
		res.send({
			result: 'Content for translate is not given or is empty'
		});
		res.status(500).end();
		return;
	}
	try {
		const processedText = segments_main.HtmltoSegments(sourceHtml);
		res.send({ result: processedText });
	} catch (error) {
		console.error(error);
		res.send({
			result: error.message
		});
		res.status(500).end();
	}
	// res.send(processedText);

});

app.get('/', (req, res) => {

	res.sendFile(__dirname + '/pos/index.html');
});

app.get('/js.js', (req, res) => {
	res.sendFile(__dirname + '/pos/js.js');
});

app.listen(process.env.PORT || 8000, function () {
	console.log("Node.js app is listening on port " + (process.env.PORT || 8000));
});

