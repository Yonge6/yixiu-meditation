// Mirrors SubscriptionAccessPolicy.swift. H5 has no Apple entitlement verifier;
// never infer Plus/legacy from local storage, a download click or an old timer.
export const canUseFreeFocus = (minutes: number): boolean => minutes === 1;
export const canUseFreeTimer = (minutes: number): boolean => [5, 15, 30].includes(minutes);
