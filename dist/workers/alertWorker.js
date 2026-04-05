"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const typesense_1 = __importDefault(require("typesense"));
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const typesense = new typesense_1.default.Client({
    nodes: [
        {
            host: process.env.TYPESENSE_HOST,
            port: Number(process.env.TYPESENSE_PORT),
            protocol: process.env.TYPESENSE_PROTOCOL,
        },
    ],
    apiKey: process.env.TYPESENSE_API_KEY,
    connectionTimeoutSeconds: 5,
});
async function runAlerts() {
    const { data: searches } = await supabase
        .from("saved_searches")
        .select("*");
    for (const search of searches || []) {
        const filters = search.filters;
        const results = await typesense
            .collections("listings")
            .documents()
            .search({
            q: "*",
            query_by: "address",
            filter_by: buildFilter(filters),
        });
        if (results.found > 0) {
            console.log(`📧 Send alert to ${search.email}`);
            // TODO: send email
        }
        await supabase
            .from("saved_searches")
            .update({ last_run: new Date().toISOString() })
            .eq("id", search.id);
    }
}
function buildFilter(filters) {
    let f = [];
    if (filters.minPrice)
        f.push(`price:>=${filters.minPrice}`);
    if (filters.maxPrice)
        f.push(`price:<=${filters.maxPrice}`);
    if (filters.beds)
        f.push(`beds:>=${filters.beds}`);
    return f.join(" && ");
}
runAlerts();
