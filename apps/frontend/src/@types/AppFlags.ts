export type AppFlags = {
  questionPoolGridLayout: boolean | null
  questionBlockExperiments: boolean | null
}

export interface FeatureFlags {
  flags: AppFlags
}

export interface PageWithFeatureFlags {
  featureFlags: FeatureFlags
}
