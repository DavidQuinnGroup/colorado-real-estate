"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RelatedContent;
const link_1 = __importDefault(require("next/link"));
const knowledgeGraph_1 = require("@/lib/knowledgeGraph");
function RelatedContent({ nodeId }) {
    const related = (0, knowledgeGraph_1.getRelatedNodes)(nodeId);
    if (!related || related.length === 0)
        return null;
    return (<div className="mt-16 border-t border-gray-800 pt-10">

      <h3 className="text-xl mb-6">
        Related Real Estate Guides
      </h3>

      <div className="grid md:grid-cols-2 gap-4">

        {related.map((item) => (<link_1.default key={item.slug} href={item.slug} className="underline">
            {item.title}
          </link_1.default>))}

      </div>

    </div>);
}
