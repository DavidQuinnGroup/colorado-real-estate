"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RelatedArticles;
const link_1 = __importDefault(require("next/link"));
const articles_1 = require("@/lib/articles");
function RelatedArticles({ city, currentSlug, }) {
    const related = articles_1.articles
        .filter((a) => a.city === city && a.slug !== currentSlug)
        .slice(0, 4);
    if (related.length === 0)
        return null;
    return (<section className="mt-12">

      <h2 className="text-2xl font-semibold mb-4">
        Related {city.charAt(0).toUpperCase() + city.slice(1)} Articles
      </h2>

      <ul className="space-y-3">

        {related.map((article) => (<li key={article.slug}>
            <link_1.default href={`/blog/${city}/${article.slug}`} className="text-blue-600 hover:underline">
              {article.title}
            </link_1.default>
          </li>))}

      </ul>

    </section>);
}
