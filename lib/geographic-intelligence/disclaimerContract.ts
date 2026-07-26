export type GisDisclaimerRecord = Readonly<{
  disclaimerId: string;
  datasetOrService: "Colorado Landslide Inventory";
  accuracyLimitation: string;
  completenessLimitation: string;
  temporalLimitation: string;
  scaleLimitation: string;
  hazardOrSafetyLimitation: string;
  legalRelianceLimitation: string;
  professionalAdviceLimitation: string;
  propertySpecificUseLimitation: string;
  requiredWordingOrFaithfulSummary: string;
  applicableOutputTypes: readonly string[];
  evidenceReferences: readonly string[];
  unresolvedQuestions: readonly string[];
}>;
