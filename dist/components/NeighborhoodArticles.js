"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NeighborhoodArticles;
const link_1 = __importDefault(require("next/link"));
const blogTopics_1 = require("@/data/blogTopics");
function NeighborhoodArticles({ city, }) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    return (<section className="mt-12">

      <h2 className="text-2xl mb-4">
        Related {cityName} Articles
      </h2>

      <ul className="space-y-2">

        {blogTopics_1.blogTopics.slice(0, 5).map((topic) => {
            const topicName = topic
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
            return (<li key={topic}>

              <link_1.default href={`/blog/${city}/${topic}`} className="underline hover:text-white">
                {topicName} in {cityName}
              </link_1.default>

            </li>);
        })}

      </ul>

    </section>);
}
