"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typesense_1 = __importDefault(require("typesense"));
const client = new typesense_1.default.Client({
    nodes: [
        {
            host: "localhost",
            port: 8108,
            protocol: "http",
        },
    ],
    apiKey: process.env.TYPESENSE_API_KEY || "xyz",
});
async function init() {
    try {
        await client.collections("listings").delete();
    }
    catch (e) { }
    await client.collections().create({
        name: "listings",
        fields: [
            { name: "id", type: "string" },
            { name: "address", type: "string" },
            { name: "city", type: "string", facet: true },
            { name: "price", type: "int32", facet: true },
            { name: "beds", type: "int32", facet: true },
            { name: "baths", type: "float" },
            { name: "lat", type: "float" },
            { name: "lng", type: "float" },
            { name: "property_type", type: "string", facet: true },
            { name: "location", type: "geopoint" },
            { name: "updated_at", type: "int64" },
        ],
        default_sorting_field: "updated_at",
    });
    console.log("✅ Typesense collection created");
}
init();
