"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArticleSchema;
function ArticleSchema({ title, description, url, }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "mainEntityOfPage": url,
        "author": {
            "@type": "Person",
            "name": "David Quinn",
        },
        "publisher": {
            "@type": "Organization",
            "name": "David Quinn Real Estate",
        },
    };
    return (<script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
        }}/>);
}
