'use strict';

async function get_d_text(url) {
	let text = "";

	const usrAgent = 'WikiProjectMed Translation Dashboard/1.0 (https://medwiki.toolforge.org/; tools.medwiki@toolforge.org)';
	const options = {
		method: 'GET',
		headers: {
			'User-Agent': usrAgent
		},
		timeout: 15000 // Timeout in milliseconds
	};
	try {
		const response = await fetch(url, options);

		if (response.ok) {
			text = await response.text();
		} else {
			console.error(`Error: ${response.status} ${response.statusText}`);
			text = "";
		}
	} catch (error) {
		console.error(`Fetch error: ${error.message}`);
		text = "";
	}
	return text;
}

async function get_text_new(title, domain, callback) {
	// Replace " " with "_"
	title = title.replace(/ /g, "_");
	// Fix "/" in the title
	title = title.replace(/\//g, "%2F");

	const url = `https://${domain}/w/rest.php/v1/page/${title}/html`;

	let text = await get_d_text(url);

	callback(text);
}

module.exports = {
	get_text_new,
};
