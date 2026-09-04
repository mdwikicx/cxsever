
'use strict';

const segments_main = require('./lib/d/segments_main.js');

let input = '';

process.stdin.setEncoding('utf-8');
process.stdin.on('data', (chunk) => {
    input += chunk;
});

process.stdin.on('end', () => {
    try {
        const parsed = JSON.parse(input);
        const html = parsed.html;

        if (!html || html.trim().length === 0) {
            process.stdout.write(JSON.stringify({ error: 'Content for translate is not given or is empty' }));
            process.exit(1);
        }

        const result = segments_main.HtmltoSegments(html);
        process.stdout.write(JSON.stringify({ result: result }));
    } catch (err) {
        process.stdout.write(JSON.stringify({ error: err.message }));
        process.exit(1);
    }
});
