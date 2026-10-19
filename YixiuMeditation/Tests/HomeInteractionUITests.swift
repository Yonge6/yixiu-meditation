import XCTest

final class HomeInteractionUITests: XCTestCase {
    private var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        XCUIDevice.shared.orientation = .portrait
        app = XCUIApplication()
        app.launchArguments = ["-language", "en", "-scene", "ocean", "-volume", "0.72"]
        app.launch()
        XCTAssertTrue(app.buttons["listen.library"].waitForExistence(timeout: 15))
    }

    override func tearDownWithError() throws {
        XCUIDevice.shared.orientation = .portrait
        app.terminate()
    }

    private func capture(_ name: String) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    private func drag(_ from: CGVector, _ to: CGVector) {
        app.coordinate(withNormalizedOffset: from).press(forDuration: 0.1, thenDragTo: app.coordinate(withNormalizedOffset: to))
    }

    private func expectScene(_ name: String, file: StaticString = #filePath, line: UInt = #line) {
        let title = app.staticTexts["listen.sceneTitle"]
        let match = XCTNSPredicateExpectation(predicate: NSPredicate(format: "label ==[c] %@", name), object: title)
        XCTAssertEqual(XCTWaiter.wait(for: [match], timeout: 4), .completed,
                       "Expected \(name); actual title: \(title.label)", file: file, line: line)
    }

    private func selectTab(_ name: String) {
        // iPadOS exposes floating tabs as cells, not a TabBar container.
        let tab = app.descendants(matching: .any).matching(NSPredicate(format: "label == %@", name)).firstMatch
        XCTAssertTrue(tab.waitForExistence(timeout: 3))
        tab.tap()
    }

    func testBilingualBrandLockupAndHeaderActions() {
        let brand = app.descendants(matching: .any).matching(identifier: "listen.brandLockup").firstMatch
        XCTAssertTrue(brand.waitForExistence(timeout: 5))
        XCTAssertTrue(brand.label.contains("Yixiu Meditation"))
        XCTAssertTrue(brand.label.contains("Rest, Sleep & Calm"))
        XCTAssertGreaterThanOrEqual(brand.frame.minX, 0)
        XCTAssertLessThanOrEqual(brand.frame.maxX, app.frame.width)
        XCTAssertTrue(app.buttons["Share Ocean Waves"].isHittable)
        capture("brand-en")
        app.buttons["Switch to Chinese"].tap()
        XCTAssertTrue(brand.label.contains("一休冥想"))
        XCTAssertTrue(brand.label.contains("休息、睡眠与静心"))
        XCTAssertTrue(app.buttons["切换到英文"].isHittable)
        capture("brand-zh")
    }

    func testPortraitGesturesAndLowControls() {
        expectScene("Ocean Waves")
        let play = app.buttons["Play"]
        XCTAssertTrue(play.isHittable)
        XCTAssertGreaterThan(play.frame.midY, app.frame.height * 0.62)
        capture("portrait-low-controls")
        drag(CGVector(dx: 0.8, dy: 0.3), CGVector(dx: 0.2, dy: 0.3))
        expectScene("Rain on Eaves")
        drag(CGVector(dx: 0.2, dy: 0.3), CGVector(dx: 0.8, dy: 0.3))
        expectScene("Ocean Waves")
        drag(CGVector(dx: 0.5, dy: 0.4), CGVector(dx: 0.5, dy: 0.2))
        if app.scrollViews["listen.scrollFallback"].exists {
            // Short windows reserve vertical swipes for scrolling; the library
            // remains reachable through its explicit button.
            let library = app.buttons["listen.library"]
            for _ in 0..<6 where !library.isHittable { app.swipeUp() }
            XCTAssertTrue(library.isHittable)
            library.tap()
        }
        XCTAssertTrue(app.staticTexts["Sound Library"].waitForExistence(timeout: 3))
        capture("swipe-up-library")
    }

    func testVolumeAndTimerDoNotSwitchScenes() {
        let volume = app.sliders["Volume"]
        let before = volume.value as? String
        volume.adjust(toNormalizedSliderPosition: 0.25)
        XCTAssertNotEqual(volume.value as? String, before)
        expectScene("Ocean Waves")
        app.buttons["Timer"].tap()
        XCTAssertTrue(app.buttons["Done"].waitForExistence(timeout: 3))
        app.buttons["Done"].tap()
        XCTAssertTrue(app.buttons["Play"].waitForExistence(timeout: 3))
    }

    func testLandscapeControlsRemainReachable() {
        XCUIDevice.shared.orientation = .landscapeLeft
        let library = app.buttons["listen.library"]
        // Start inside page content, not the persistent bottom tab bar.
        for _ in 0..<6 where !library.isHittable {
            print("LIBRARY_BEFORE_SCROLL \(library.frame)")
            drag(CGVector(dx: 0.85, dy: 0.65), CGVector(dx: 0.85, dy: 0.15))
        }
        print("LIBRARY_AFTER_SCROLL \(library.frame)")
        capture("landscape-after-scroll")
        XCTAssertTrue(library.isHittable)
        capture("landscape-controls")
        library.tap()
        XCTAssertTrue(app.staticTexts["Sound Library"].waitForExistence(timeout: 3))
    }

    func testPlaybackSurvivesWindowOrientationChanges() {
        app.buttons["Play"].tap()
        XCTAssertTrue(app.buttons["Pause"].waitForExistence(timeout: 5))
        for orientation in [UIDeviceOrientation.landscapeLeft, .portrait, .landscapeRight, .portrait] {
            XCUIDevice.shared.orientation = orientation
            expectScene("Ocean Waves")
            XCTAssertTrue(app.buttons["Pause"].waitForExistence(timeout: 5),
                          "Resizing must preserve active playback")
        }
        capture("playback-after-resizing")
    }

    func testSwipeIntoPremiumSceneShowsPaywall() {
        // Mozart Andante is the last free scene in the free-first home order.
        // The next scene (Forest Falls) must remain behind the entitlement gate.
        app.terminate()
        app.launchArguments = ["-language", "en", "-scene", "mozartAndante", "-volume", "0.72"]
        app.launch()
        XCTAssertTrue(app.buttons["listen.library"].waitForExistence(timeout: 15))
        drag(CGVector(dx: 0.8, dy: 0.3), CGVector(dx: 0.2, dy: 0.3))
        XCTAssertTrue(app.staticTexts["YIXIU PLUS"].waitForExistence(timeout: 3))
        capture("premium-swipe-entitlement-preserved")
    }

    func testLandscapeSceneSwipe() {
        XCUIDevice.shared.orientation = .landscapeLeft
        let title = app.staticTexts["listen.sceneTitle"]
        title.swipeLeft()
        expectScene("Rain on Eaves")
        title.swipeRight()
        expectScene("Ocean Waves")
    }

    func testFocusFollowsSelectedSceneAndPreservesPlayback() {
        drag(CGVector(dx: 0.8, dy: 0.3), CGVector(dx: 0.2, dy: 0.3))
        expectScene("Rain on Eaves")
        selectTab("Focus")
        XCTAssertEqual(app.staticTexts["focus.sceneTitle"].label, "Rain on Eaves")
        let sound = app.buttons["focus.sceneSound"]
        XCTAssertEqual(sound.label, "Scene sound: Rain on Eaves")
        capture("focus-rain-shared-scene")
        selectTab("Sounds")
        XCTAssertTrue(app.buttons["Play"].exists)
        app.buttons["Play"].tap()
        selectTab("Focus")
        if sound.value as? String != "On" { sound.tap() }
        app.buttons["focus.start"].tap()
        selectTab("Sounds")
        XCTAssertTrue(app.buttons["Pause"].exists)
        drag(CGVector(dx: 0.8, dy: 0.3), CGVector(dx: 0.2, dy: 0.3))
        expectScene("Spring Creek")
        selectTab("Focus")
        XCTAssertEqual(app.staticTexts["focus.sceneTitle"].label, "Spring Creek")
        XCTAssertTrue(app.buttons["focus.start"].exists)
    }

    func testQuickBreathingKeepsHomeScene() {
        selectTab("Focus")
        let soundBeforePractice = app.buttons["focus.sceneSound"].value as? String
        let breathe = app.buttons["focus.preset.work_break"]
        for _ in 0..<5 where !breathe.isHittable { app.swipeUp() }
        XCTAssertTrue(breathe.isHittable)
        breathe.tap()
        XCTAssertEqual(app.staticTexts["focus.sceneTitle"].label, "Ocean Waves")
        XCTAssertEqual(app.buttons["focus.sceneSound"].value as? String, soundBeforePractice, "A quick breathing practice must preserve the scene-sound preference")
        selectTab("Sounds")
        expectScene("Ocean Waves")
        XCTAssertTrue(app.buttons["Play"].exists)
    }

    func testFocusFreePresetsStayInFocusAndPauseListening() {
        app.terminate()
        app.launchArguments = ["-language", "en", "-scene", "ocean", "-volume", "0.72", "-focusSoundEnabled", "NO", "-YixiuForceFreeAccess"]
        app.launch()
        XCTAssertTrue(app.buttons["listen.library"].waitForExistence(timeout: 15))
        selectTab("Focus")
        func tapPreset(_ id: String) {
            let preset = app.buttons[id]
            for _ in 0..<7 where !preset.isHittable { app.swipeUp() }
            XCTAssertTrue(preset.isHittable)
            preset.tap()
        }
        tapPreset("focus.preset.lunch")
        let countdown = app.staticTexts["focus.listeningCountdown"]
        XCTAssertTrue(countdown.waitForExistence(timeout: 5))
        XCTAssertEqual(app.staticTexts["focus.sceneTitle"].label, "Morning Lake")
        XCTAssertTrue(app.staticTexts["focus.restTitle"].isHittable, "A newly chosen rest must open from the top, not retain the preset-list scroll offset")
        XCTAssertTrue(app.buttons["focus.listeningPlayback"].exists)
        XCTAssertFalse(app.staticTexts["YIXIU PLUS"].exists)
        for _ in 0..<6 where !app.buttons["focus.listeningPlayback"].isHittable { app.swipeDown() }
        capture("everyday-rest-en-lunch-focus")
        app.buttons["focus.listeningPlayback"].tap()
        let paused = countdown.label
        sleep(2)
        XCTAssertEqual(countdown.label, paused)
        app.buttons["focus.listeningPlayback"].tap()
        sleep(2)
        XCTAssertNotEqual(countdown.label, paused)

        tapPreset("focus.preset.night_waking")
        XCTAssertTrue(countdown.waitForExistence(timeout: 5))
        XCTAssertEqual(app.staticTexts["focus.sceneTitle"].label, "Window Rain")
        XCTAssertTrue(app.staticTexts["focus.restTitle"].isHittable)
        XCTAssertFalse(app.staticTexts["YIXIU PLUS"].exists)
        for _ in 0..<6 where !app.buttons["focus.listeningPlayback"].isHittable { app.swipeDown() }
        capture("everyday-rest-en-night-focus")
        tapPreset("focus.preset.work_break")
        XCTAssertTrue(app.staticTexts["focus-countdown"].waitForExistence(timeout: 5))
        XCTAssertEqual(app.buttons["focus.sceneSound"].value as? String, "Off")
        XCTAssertFalse(app.staticTexts["YIXIU PLUS"].exists)
        capture("everyday-rest-en-work-break")
    }

    func testEverydayRestChineseScreensAndLifestyleBack() {
        app.terminate()
        app.launchArguments = ["-language", "zh", "-scene", "rain", "-volume", "0.72", "-focusSoundEnabled", "NO", "-YixiuForceFreeAccess"]
        app.launch()
        XCTAssertTrue(app.buttons["listen.library"].waitForExistence(timeout: 15))
        selectTab("静心")
        let lunch = app.buttons["focus.preset.lunch"]
        for _ in 0..<7 where !lunch.isHittable { app.swipeUp() }
        lunch.tap()
        XCTAssertTrue(app.staticTexts["focus.listeningCountdown"].waitForExistence(timeout: 5))
        XCTAssertEqual(app.staticTexts["focus.sceneTitle"].label, "晨雾湖岸")
        XCTAssertTrue(app.staticTexts["focus.restTitle"].isHittable)
        capture("everyday-rest-zh-lunch-focus")
        let night = app.buttons["focus.preset.night_waking"]
        for _ in 0..<7 where !night.isHittable { app.swipeUp() }
        night.tap()
        XCTAssertEqual(app.staticTexts["focus.sceneTitle"].label, "窗边夜雨")
        XCTAssertTrue(app.staticTexts["focus.restTitle"].isHittable)
        capture("everyday-rest-zh-night-focus")
        selectTab("我的")
        capture("everyday-rest-zh-me-continue-first")
        let lifestyle = app.buttons.matching(NSPredicate(format: "label CONTAINS %@", "慢慢探索，其他用心的作品")).firstMatch
        for _ in 0..<15 where !lifestyle.isHittable { app.swipeUp() }
        XCTAssertTrue(lifestyle.isHittable)
        lifestyle.tap()
        XCTAssertTrue(app.buttons["me.detail.back"].waitForExistence(timeout: 4))
        capture("everyday-rest-zh-lifestyle-detail")
        app.buttons["me.detail.back"].tap()
        XCTAssertFalse(app.buttons["me.detail.back"].exists)
    }

    func testFocusPauseFreezesCountdownAndResumes() {
        selectTab("Focus")
        let start = app.buttons["focus.start"]
        XCTAssertTrue(start.waitForExistence(timeout: 15))
        start.tap()
        let countdown = app.staticTexts["focus-countdown"]
        let pause = app.buttons["Pause"]
        XCTAssertTrue(pause.waitForExistence(timeout: 3))
        sleep(3)
        pause.tap()
        let remainingWhilePaused = countdown.label
        sleep(2)
        XCTAssertEqual(countdown.label, remainingWhilePaused, "A paused practice must not keep counting")
        let resume = app.buttons["Continue"]
        XCTAssertTrue(resume.exists)
        resume.tap()
        sleep(2)
        XCTAssertNotEqual(countdown.label, remainingWhilePaused, "An explicit resume must continue the practice")
        capture("focus-pause-resume-countdown")
    }

    func testLibraryFreeSearchEmptyResetAndStickyControls() {
        app.buttons["listen.library"].tap()
        let scopeMenu = app.buttons["library.scope.menu"]
        XCTAssertTrue(scopeMenu.waitForExistence(timeout: 4))
        scopeMenu.tap()
        let free = app.buttons["Free"]
        XCTAssertTrue(free.waitForExistence(timeout: 2))
        free.tap()
        let beforeScroll = scopeMenu.frame.minY
        app.scrollViews["library.results"].swipeUp()
        XCTAssertTrue(scopeMenu.isHittable)
        XCTAssertEqual(scopeMenu.frame.minY, beforeScroll, accuracy: 1, "Library scopes must remain above the scrolling cards")
        app.buttons["library.type.menu"].tap()
        app.buttons["Classical"].tap()
        app.buttons["library.search.toggle"].tap()
        let search = app.textFields["library.search"]
        search.tap()
        search.typeText("debussy\n")
        XCTAssertTrue(app.buttons["Switch to Clair de lune"].waitForExistence(timeout: 3))
        XCTAssertFalse(app.buttons["Nocturne Op. 9 No. 2, Yixiu Plus"].exists)
        capture("library-free-composer-search")
        app.buttons["Clear search"].tap()
        search.tap()
        search.typeText("zzzz-no-match\n")
        XCTAssertTrue(app.staticTexts["No matching sounds"].waitForExistence(timeout: 3))
        app.buttons["library.reset"].tap()
        XCTAssertTrue(app.buttons["Switch to Ocean Waves"].waitForExistence(timeout: 3))
        capture("library-reset-fixed-controls")
    }

    func testUsageConsentDefaultsOffPersistsAndCanBeWithdrawn() {
        // Run on a fresh, dedicated simulator. Simulator installs are excluded
        // by ProductAnalytics, so this never sends test activity to production.
        func consentSwitch() -> XCUIElement {
            selectTab("Me")
            let control = app.switches.matching(NSPredicate(format: "label CONTAINS %@", "Help improve Yixiu")).firstMatch
            for _ in 0..<15 where !control.isHittable { app.swipeUp() }
            XCTAssertTrue(control.isHittable)
            return control
        }
        let consent = consentSwitch()
        XCTAssertEqual(consent.value as? String, "0")
        capture("analytics-default-off")
        consent.tap()
        XCTAssertEqual(consent.value as? String, "1")
        app.terminate()
        app.launch()
        let restored = consentSwitch()
        XCTAssertEqual(restored.value as? String, "1")
        restored.tap()
        XCTAssertEqual(restored.value as? String, "0")
        capture("analytics-withdrawn")
        app.terminate()
        app.launch()
        XCTAssertEqual(consentSwitch().value as? String, "0")
    }

    func testExplicitReviewButtonOpensExternalStoreOrShowsFailure() {
        selectTab("Me")
        let rate = app.buttons["me.writeReview"]
        for _ in 0..<20 where !rate.isHittable { app.swipeUp() }
        XCTAssertTrue(rate.isHittable)
        rate.tap()
        // No review is written or submitted by this test. The simulator has no
        // production App Store; verify navigation or visible failure feedback.
        let browser = XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
        let store = XCUIApplication(bundleIdentifier: "com.apple.AppStore")
        XCTAssertTrue(browser.wait(for: .runningForeground, timeout: 5)
                      || store.state == .runningForeground
                      || app.alerts["Could not open the App Store"].exists)
    }
}
