import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../YixiuMeditation/', import.meta.url);
const store = readFileSync(new URL('SubscriptionStore.swift', root), 'utf8');
const view = readFileSync(new URL('PlusPaywallView.swift', root), 'utf8');
assert.doesNotMatch(view, /7 天|7-day|annualTrialEligible/);
assert.match(store, /introEligiblePlans\.contains\(plan\), !isLoadingProducts, !productsUnavailable/);
assert.match(store, /subscription\.introductoryOffer != nil/);
assert.match(store, /await subscription\.isEligibleForIntroOffer/);
assert.match(store, /catch \{\s*introEligiblePlans = \[\]\s*products = \[:\]/);
for (const mode of ['freeTrial', 'payAsYouGo', 'payUpFront']) {
  assert.ok(view.includes(`case .${mode}:`), `${mode} must have accurate disclosure`);
}
assert.match(view, /offer\.periodCount/);
assert.match(view, /Then .*per .*auto-renewing until canceled/);
assert.match(view, /subscriptionStore\.isLoadingProducts \|\| subscriptionStore\.product/);
console.log('INTRO_OFFER_SOURCE_REGRESSION_PASS');
