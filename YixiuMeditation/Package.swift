// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "YixiuActivityCore",
    platforms: [.macOS(.v14), .iOS(.v17)],
    products: [
        .library(name: "YixiuActivityCore", targets: ["YixiuActivityCore"]),
    ],
    targets: [
        .target(
            name: "YixiuActivityCore",
            path: "Shared"
        ),
        .testTarget(
            name: "YixiuActivityCoreTests",
            dependencies: ["YixiuActivityCore"],
            path: "Tests/YixiuActivityCoreTests"
        ),
    ]
)
