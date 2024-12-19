'use strict';

function get_text_api_wmcloud(title, callback) {
	var url = 'https://medwiki.toolforge.org/get_html/rest_v1_page.php?wmcloud=1&title=' + title

	const options = {
		method: 'GET',
		dataType: 'json',
	};
	return fetch(url, options)
		.then(response => response.json())
		.then(data => data.text)
		.then(result => callback(result))
}

function get_text_api_new(title, callback) {
	var url = 'https://medwiki.toolforge.org/get_html/rest_v1_page.php?title=' + title

	const options = {
		method: 'GET',
		dataType: 'json',
	};
	return fetch(url, options)
		.then(response => response.json())
		.then(data => data.text)
		.then(result => callback(result))
}

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
	get_text_api_new,
	get_text_new,
	get_text_api_wmcloud
};
