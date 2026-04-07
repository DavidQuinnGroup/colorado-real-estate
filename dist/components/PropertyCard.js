"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertyCard;
function PropertyCard({ property }) {
    const photo = property.photos?.[0]?.url || "/placeholder-home.jpg";
    return (<div className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">

      <img src={photo} alt={property.address} className="w-full h-56 object-cover"/>

      <div className="p-4">

        <p className="text-xl font-bold">
          ${property.price?.toLocaleString()}
        </p>

        <p className="text-gray-700">
          {property.address}
        </p>

        <p className="text-gray-500 text-sm mb-2">
          {property.city}, {property.state}
        </p>

        <p className="text-sm text-gray-700">
          {property.bedrooms} beds • {property.bathrooms} baths • {property.sqft} sqft
        </p>

      </div>
    </div>);
}
