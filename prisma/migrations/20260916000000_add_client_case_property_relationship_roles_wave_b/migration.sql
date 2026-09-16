-- PROJECT_ATLAS_CLIENT_INFORMATION_WAVE_B_PROPERTY_RELATIONSHIP_EXPANSION_V1
-- Additive relationship-role foundation. No destructive operations.

CREATE TYPE "ClientCasePropertyRelationshipRoleType" AS ENUM (
  'CURRENT_HOME',
  'TARGET_PRIMARY',
  'INVESTMENT_PROPERTY',
  'SALE_RELEVANT',
  'OTHER'
);

CREATE TYPE "ClientCasePropertyRelationshipRoleStatus" AS ENUM (
  'ACTIVE',
  'ENDED'
);

CREATE TABLE "ClientCasePropertyRelationshipRole" (
  "id" TEXT NOT NULL,
  "clientCasePropertyId" TEXT NOT NULL,
  "role" "ClientCasePropertyRelationshipRoleType" NOT NULL,
  "status" "ClientCasePropertyRelationshipRoleStatus" NOT NULL DEFAULT 'ACTIVE',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ClientCasePropertyRelationshipRole_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ClientCasePropertyRelationshipRole"
  ADD CONSTRAINT "ClientCasePropertyRelationshipRole_clientCasePropertyId_fkey"
  FOREIGN KEY ("clientCasePropertyId") REFERENCES "ClientCaseProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "CCPRR_active_property_role_uq"
  ON "ClientCasePropertyRelationshipRole"("clientCasePropertyId", "role")
  WHERE "status" = 'ACTIVE';

CREATE INDEX "CCPRR_property_status_idx"
  ON "ClientCasePropertyRelationshipRole"("clientCasePropertyId", "status");

CREATE INDEX "CCPRR_role_status_idx"
  ON "ClientCasePropertyRelationshipRole"("role", "status");

INSERT INTO "ClientCasePropertyRelationshipRole" (
  "id",
  "clientCasePropertyId",
  "role",
  "status",
  "startedAt",
  "createdBySubject",
  "createdAt",
  "updatedAt"
)
SELECT
  'ccprr_wave_b_' || "ClientCaseProperty"."id",
  "ClientCaseProperty"."id",
  CASE "ClientCaseProperty"."role"
    WHEN 'CURRENT_HOME' THEN 'CURRENT_HOME'::"ClientCasePropertyRelationshipRoleType"
    WHEN 'NEW_PRIMARY' THEN 'TARGET_PRIMARY'::"ClientCasePropertyRelationshipRoleType"
    WHEN 'INVESTMENT_PROPERTY' THEN 'INVESTMENT_PROPERTY'::"ClientCasePropertyRelationshipRoleType"
    WHEN 'SALE_PROPERTY' THEN 'SALE_RELEVANT'::"ClientCasePropertyRelationshipRoleType"
    WHEN 'OTHER' THEN 'OTHER'::"ClientCasePropertyRelationshipRoleType"
  END,
  'ACTIVE'::"ClientCasePropertyRelationshipRoleStatus",
  "ClientCaseProperty"."createdAt",
  "ClientCase"."createdBySubject",
  "ClientCaseProperty"."createdAt",
  "ClientCaseProperty"."updatedAt"
FROM "ClientCaseProperty"
JOIN "ClientCase" ON "ClientCase"."id" = "ClientCaseProperty"."clientCaseId"
WHERE NOT EXISTS (
  SELECT 1
  FROM "ClientCasePropertyRelationshipRole" existing
  WHERE existing."clientCasePropertyId" = "ClientCaseProperty"."id"
    AND existing."role" = CASE "ClientCaseProperty"."role"
      WHEN 'CURRENT_HOME' THEN 'CURRENT_HOME'::"ClientCasePropertyRelationshipRoleType"
      WHEN 'NEW_PRIMARY' THEN 'TARGET_PRIMARY'::"ClientCasePropertyRelationshipRoleType"
      WHEN 'INVESTMENT_PROPERTY' THEN 'INVESTMENT_PROPERTY'::"ClientCasePropertyRelationshipRoleType"
      WHEN 'SALE_PROPERTY' THEN 'SALE_RELEVANT'::"ClientCasePropertyRelationshipRoleType"
      WHEN 'OTHER' THEN 'OTHER'::"ClientCasePropertyRelationshipRoleType"
    END
    AND existing."status" = 'ACTIVE'::"ClientCasePropertyRelationshipRoleStatus"
);
