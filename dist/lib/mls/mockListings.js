"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockListings = void 0;
exports.mockListings = Array.from({ length: 500 }).map((_, i) => ({
    id: `mock-${i}`,
    price: 500000 + i * 1000,
    beds: 3,
    baths: 2,
    lat: 40.015 + Math.random() * 0.05,
    lng: -105.27 + Math.random() * 0.05,
    address: `Mock Address ${i}`,
}));
