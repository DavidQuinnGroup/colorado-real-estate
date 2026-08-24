import { resolveIresCityId, type IresCityIdResolution } from './iresCityIdEvidence';

export const IRES_CITYID_FIXTURES: Readonly<Record<string, IresCityIdResolution>> = {
  boulder: resolveIresCityId('9'),
  broomfield: resolveIresCityId('12'),
  erie: resolveIresCityId('24'),
  lafayette: resolveIresCityId('53'),
  longmont: resolveIresCityId('60'),
  louisville: resolveIresCityId('61'),
  superior: resolveIresCityId('93'),
  westminster: resolveIresCityId('101'),
  denver: resolveIresCityId('19'),
  niwot: resolveIresCityId('70'),
  unknownFutureValue: resolveIresCityId('999999'),
  nonEquivalentLeadingZeroValue: resolveIresCityId('009'),
  missing: resolveIresCityId(null),
} as const;
