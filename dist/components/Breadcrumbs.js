"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Breadcrumbs;
const link_1 = __importDefault(require("next/link"));
function Breadcrumbs({ items }) {
    return (<nav className="text-sm text-gray-400 mb-6">

      <ol className="flex flex-wrap items-center space-x-2">

        {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": items.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.name,
                    "item": item.href
                        ? `https://yourdomain.com${item.href}`
                        : undefined,
                })),
            };
            return (<li key={index} className="flex items-center">

              {item.href && !isLast ? (<link_1.default href={item.href} className="hover:text-white underline">
                  {item.name}
                </link_1.default>) : (<span className="text-gray-200">
                  {item.name}
                </span>)}

              {!isLast && (<span className="mx-2">›</span>)}

            <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}/>

            </li>);
        })}

      </ol>

    </nav>);
}
