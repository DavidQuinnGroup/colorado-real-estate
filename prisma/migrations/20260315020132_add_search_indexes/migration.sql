-- CreateIndex
CREATE INDEX "OpenHouse_propertyId_idx" ON "OpenHouse"("propertyId");

-- CreateIndex
CREATE INDEX "OpenHouse_startTime_idx" ON "OpenHouse"("startTime");

-- CreateIndex
CREATE INDEX "PriceHistory_propertyId_idx" ON "PriceHistory"("propertyId");

-- CreateIndex
CREATE INDEX "PriceHistory_date_idx" ON "PriceHistory"("date");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_price_idx" ON "Property"("price");

-- CreateIndex
CREATE INDEX "Property_beds_idx" ON "Property"("beds");

-- CreateIndex
CREATE INDEX "Property_baths_idx" ON "Property"("baths");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_lat_lng_idx" ON "Property"("lat", "lng");

-- CreateIndex
CREATE INDEX "PropertyPhoto_propertyId_idx" ON "PropertyPhoto"("propertyId");
