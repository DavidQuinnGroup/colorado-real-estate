"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SEOImage;
const image_1 = __importDefault(require("next/image"));
function SEOImage({ src, city, neighborhood, width = 1200, height = 800, }) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    const altText = neighborhood
        ? `${neighborhood} ${cityName} Colorado homes and real estate`
        : `${cityName} Colorado real estate and homes`;
    return (<image_1.default src={src} alt={altText} width={width} height={height} className="rounded-lg"/>);
}
