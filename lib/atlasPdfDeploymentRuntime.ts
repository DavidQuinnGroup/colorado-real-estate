import { createRequire } from 'node:module';

import sparticuzChromium from '@sparticuz/chromium';
import { chromium as playwrightCoreChromium } from 'playwright-core';

export const ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_VERSION = 'ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_V1' as const;
export const ATLAS_PDF_DEPLOYMENT_ADAPTER_VERSION = 'PLAYWRIGHT_CORE_SPARTICUZ_CHROMIUM_ADAPTER_V1' as const;
export const ATLAS_PDF_DEPLOYMENT_CHROMIUM_PACKAGE = '@sparticuz/chromium@149.0.0' as const;
export const ATLAS_PDF_DEPLOYMENT_PLAYWRIGHT_CORE_VERSION = '1.62.1' as const;

export type AtlasPdfRuntimeEnvironment = 'LOCAL_DEVELOPMENT' | 'TEST' | 'DEPLOYED_SERVER';

export type AtlasPdfChromiumLaunchConfig = Readonly<{
  environment: AtlasPdfRuntimeEnvironment;
  executablePath: string;
  args: readonly string[];
  headless: true;
  source: 'PLAYWRIGHT_BUNDLED_CHROMIUM' | 'SPARTICUZ_CHROMIUM';
  chromiumPackage: 'playwright@1.62.1' | typeof ATLAS_PDF_DEPLOYMENT_CHROMIUM_PACKAGE;
  configVersion: typeof ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_VERSION;
}>;

export type AtlasPdfRuntimeVersion = Readonly<{
  adapterVersion: typeof ATLAS_PDF_DEPLOYMENT_ADAPTER_VERSION;
  playwrightVersion: string;
  chromiumVersion: string;
  chromiumPackage: AtlasPdfChromiumLaunchConfig['chromiumPackage'];
  nodeRuntime: string;
  deploymentRuntime: AtlasPdfRuntimeEnvironment;
  configVersion: typeof ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_VERSION;
}>;

const requireFromRuntime = createRequire(import.meta.url);

export function resolveAtlasPdfRuntimeEnvironment(environment: Readonly<Record<string, string | undefined>> = process.env): AtlasPdfRuntimeEnvironment {
  const override = environment.ATLAS_PDF_RUNTIME_OVERRIDE?.trim();
  if (override === 'LOCAL_DEVELOPMENT' || override === 'TEST' || override === 'DEPLOYED_SERVER') return override;
  if (environment.VERCEL === '1') return 'DEPLOYED_SERVER';
  if (environment.NODE_ENV === 'test') return 'TEST';
  return 'LOCAL_DEVELOPMENT';
}

export async function resolveAtlasPdfChromiumExecutable(
  environment: AtlasPdfRuntimeEnvironment = resolveAtlasPdfRuntimeEnvironment(),
): Promise<AtlasPdfChromiumLaunchConfig> {
  if (environment === 'DEPLOYED_SERVER') {
    const executablePath = await sparticuzChromium.executablePath();
    return Object.freeze({
      environment,
      executablePath,
      args: Object.freeze([...sparticuzChromium.args]),
      headless: true,
      source: 'SPARTICUZ_CHROMIUM',
      chromiumPackage: ATLAS_PDF_DEPLOYMENT_CHROMIUM_PACKAGE,
      configVersion: ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_VERSION,
    });
  }

  const { chromium } = requireFromRuntime('playwright') as { chromium: { executablePath(): string } };
  return Object.freeze({
    environment,
    executablePath: chromium.executablePath(),
    args: Object.freeze([]),
    headless: true,
    source: 'PLAYWRIGHT_BUNDLED_CHROMIUM',
    chromiumPackage: 'playwright@1.62.1',
    configVersion: ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_VERSION,
  });
}

export function resolveAtlasPdfPlaywrightChromium(environment: AtlasPdfRuntimeEnvironment = resolveAtlasPdfRuntimeEnvironment()) {
  if (environment === 'DEPLOYED_SERVER') return { chromium: playwrightCoreChromium };
  return requireFromRuntime('playwright') as {
    chromium: {
      launch(options: { headless: true; executablePath: string; args: readonly string[]; timeout: number }): Promise<unknown>;
    };
  };
}

export function buildAtlasPdfRuntimeVersion(input: {
  environment: AtlasPdfRuntimeEnvironment;
  chromiumPackage: AtlasPdfChromiumLaunchConfig['chromiumPackage'];
  chromiumVersion: string;
  playwrightVersion: string;
}): AtlasPdfRuntimeVersion {
  return Object.freeze({
    adapterVersion: ATLAS_PDF_DEPLOYMENT_ADAPTER_VERSION,
    playwrightVersion: input.playwrightVersion,
    chromiumVersion: input.chromiumVersion,
    chromiumPackage: input.chromiumPackage,
    nodeRuntime: process.version,
    deploymentRuntime: input.environment,
    configVersion: ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_VERSION,
  });
}
