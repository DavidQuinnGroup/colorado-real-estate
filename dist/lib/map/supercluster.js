"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCluster = buildCluster;
const supercluster_1 = __importDefault(require("supercluster"));
function buildCluster(points) {
    const cluster = new supercluster_1.default({
        radius: 60,
        maxZoom: 18,
    });
    cluster.load(points);
    return cluster;
}
