import Foundation

@main
struct SoundLibraryFilterHarness {
    static func main() {
        func scenes(
            scope: SoundLibraryScope = .all,
            category: SceneCategory = .all,
            query: String = "",
            favorites: [MeditationScene] = [],
            recent: [MeditationScene] = []
        ) -> [MeditationScene] {
            SoundLibraryFilter.scenes(scope: scope, category: category, query: query, favorites: favorites, recent: recent)
        }

        precondition(scenes() == MeditationScene.availableScenes, "Default library must retain catalog order")
        precondition(Set(scenes(scope: .free)) == SubscriptionAccessPolicy.freeScenes, "Free scope must reflect catalog policy, not member entitlement")
        precondition(Set(scenes(scope: .free, category: .classical)) == SubscriptionAccessPolicy.freeClassicalScenes,
                     "Free and category must intersect")
        precondition(scenes(scope: .free, category: .classical, query: "Chopin") == [.raindrop, .waltzAMinor],
                     "Search, free scope and classical category must compose")
        precondition(scenes(scope: .favorites, favorites: [.rain, .clairDeLune, .rain, .quietOrbit]) == [.rain, .clairDeLune],
                     "Favorites must deduplicate and exclude retired tracks")
        precondition(scenes(scope: .favorites, category: .classical, favorites: [.rain, .clairDeLune]) == [.clairDeLune],
                     "Personal scopes must not replace category selection")
        precondition(scenes(scope: .recent, recent: [.canon, .rain, .quietOrbit, .clairDeLune, .canon]) == [.canon, .rain, .clairDeLune],
                     "Recent scope must preserve recency order and exclude retired entries")
        precondition(scenes(scope: .recent, category: .classical, query: "D", recent: [.rain, .canon, .clairDeLune]) == [.canon, .clairDeLune],
                     "Recent filtering must keep relative order")
        precondition(scenes(query: "  moONLIGHT  SONATA \n") == [.moonlightSonata], "Search must trim whitespace and ignore case")
        precondition(scenes(query: "巴赫") == [.preludeC, .goldbergAria], "Chinese composer search must work")
        precondition(scenes(query: "Claude Debussy") == [.clairDeLune], "English composer search must work")
        precondition(scenes(query: "Frederic Chopin") == scenes(query: "Frédéric Chopin"), "Search must ignore accents")
        precondition(scenes(query: "ＣＨＯＰＩＮ") == scenes(query: "chopin"), "Search must ignore full-width Latin differences")
        precondition(scenes(query: "Chopin raindrop") == [.raindrop], "Search words can match title and composer together")
        precondition(scenes(query: "no such track") == [], "Unknown queries must return empty results")
        precondition(scenes(scope: .favorites).isEmpty && scenes(scope: .recent).isEmpty, "Empty personal lists must stay empty")
        precondition(SoundLibraryFilter.scenes(in: [.rain, .canon], scope: .recent, category: .all, query: "",
                                             favorites: [], recent: [.ocean, .canon, .rain]) == [.canon, .rain],
                     "Recent results must stay within the active catalog")

        precondition(PaywallPriceState.resolve(isLoading: false, hasRequestedPrices: false, hasProduct: false) == .loading,
                     "Initial cards must not claim unavailable before the first fetch")
        precondition(PaywallPriceState.resolve(isLoading: true, hasRequestedPrices: true, hasProduct: true) == .loading,
                     "Reloading must wait for updated regional prices and offer eligibility")
        precondition(PaywallPriceState.resolve(isLoading: false, hasRequestedPrices: true, hasProduct: false) == .unavailable,
                     "Failed retrieval must provide the retry state")
        precondition(PaywallPriceState.resolve(isLoading: false, hasRequestedPrices: true, hasProduct: true) == .available,
                     "StoreKit products must make real prices available")
        precondition(PaywallPriceState.resolve(isLoading: false, hasRequestedPrices: false, hasProduct: true) == .available,
                     "Cached real products may render immediately")
        print("SOUND_LIBRARY_FILTER_PASS: scopes, categories, bilingual composer search, accents, recent ordering, retired tracks and Apple price states")
    }
}
