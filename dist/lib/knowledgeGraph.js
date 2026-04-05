"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedNodes = getRelatedNodes;
const knowledgeGraph_1 = require("@/data/knowledgeGraph");
function getRelatedNodes(nodeId) {
    const node = knowledgeGraph_1.knowledgeGraph.find(n => n.id === nodeId);
    if (!node || !node.related)
        return [];
    return knowledgeGraph_1.knowledgeGraph.filter(n => node.related?.includes(n.id));
}
