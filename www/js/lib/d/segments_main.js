'use strict';

const Parser = require('../lineardoc/Parser')
const MwContextualizer = require('../lineardoc/MwContextualizer')
const CXSegmenter = require('../segmentation/CXSegmenter')

const removableSections = {
    "classes": [
        "ambox",
        "hatnote",
        "metadata",
        "navbar",
        "navbox",
        "sisterproject",
        "sistersitebox",
        "vertical-navbox"
    ],
    "rdfa": [
        "mw:Extension/indicator",
        "mw:Extension/templatestyles"
    ],
    "templates": [
        "/^pp(-.*)?$/",
        "/^Articles (for|with|needing|containing).*$/",
        "/^Engvar[AB]$/",
        "/^Use[\\sa-z]+(English|spelling|referencing)$/",
        "/^Use [DMY]+ dates$/",
        "/^Wikipedia articles (for|with|needing|containing).*$/",
        "Anchor",
        "DEFAULTSORT",
        "Esborrany",
        "Featured article",
        "FR",
        "Mdwiki revid",
        "mdwiki revid",
        "/^[Mm]dwiki[ _]revid$",
        "good article",
        "/^(.*-)?Stub$/",
        "Short description",
        "Void",
        "Italic title",
        "About",
        "See also",
        "Redirect",
        "Distinguish",
        "TOC limit",
        "/^#unlinkedwikibase:id=Q\\d+$/",
        "Other uses",
        "redirect"
    ]
};

/**
 * Converts HTML source into segmented HTML using a specific parser, contextualizer, and segmenter.
 *
 * @param {string} source_HTML - The source HTML string to be processed and segmented.
 * @returns {string} The resulting segmented HTML string.
 */
function HtmltoSegments(source_HTML) {

    const parser = new Parser(new MwContextualizer(
        { removableSections: removableSections }
    ), {
        wrapSections: true
    });

    parser.init();
    parser.write(source_HTML);
    let parsedDoc = parser.builder.doc;
    parsedDoc = parsedDoc.wrapSections();

    const segmentedDoc = new CXSegmenter().segment(parsedDoc, "en");

    const result = segmentedDoc.getHtml();

    return result;
}

module.exports = {
    HtmltoSegments: HtmltoSegments
};
