"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RealEstateAgentSchema;
function RealEstateAgentSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "David Quinn Real Estate",
        "areaServed": "Boulder County, Colorado",
        "url": "https://yourdomain.com",
        "description": "Helping buyers and sellers navigate the Boulder County real estate market including Boulder, Louisville, Lafayette, Superior, Erie, Longmont, and Broomfield.",
    };
    return (<script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
        }}/>);
}
