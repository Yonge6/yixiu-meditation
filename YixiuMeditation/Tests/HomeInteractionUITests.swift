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

    func testSwipeIntoPremiumSceneShowsPaywall() {
        for name in ["RAIN ON EAVES", "SPRING CREEK", "MORNING BIRDS", "MOUNTAIN STREAM"] {
            drag(CGVector(dx: 0.8, dy: 0.3), CGVector(dx: 0.2, dy: 0.3))
            expectScene(name)
        }
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

    func testExplicitReviewButtonOpensExternalStoreOrShowsFailure() {
        app.tabBars.buttons["Me"].tap()
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
