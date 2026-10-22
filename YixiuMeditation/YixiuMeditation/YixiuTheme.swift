import SwiftUI

/// Evaluate the live, safe-area-constrained container rather than a device model
/// or physical screen. AnyLayout keeps view identity and practice state intact
/// while the window changes size. Large accessibility text stays in one column.
enum YixiuAdaptiveLayout {
    static func usesColumns(
        size: CGSize,
        horizontalSizeClass: UserInterfaceSizeClass?,
        dynamicTypeSize: DynamicTypeSize,
        minimumColumnWidth: CGFloat
    ) -> Bool {
        guard !dynamicTypeSize.isAccessibilitySize,
              size.width >= minimumColumnWidth * 2 + 48 else { return false }
        // Compact landscape still benefits from columns in a short window.
        return horizontalSizeClass == .regular || size.height < 500
    }
}

enum YixiuTheme {
    static let deepWater = Color(red: 3 / 255, green: 23 / 255, blue: 33 / 255)
    static let deepWaterSoft = Color(red: 9 / 255, green: 44 / 255, blue: 56 / 255)
    static let moon = Color(red: 244 / 255, green: 248 / 255, blue: 248 / 255)
    static let mist = Color(red: 168 / 255, green: 192 / 255, blue: 197 / 255)
    static let aqua = Color(red: 143 / 255, green: 214 / 255, blue: 220 / 255)
    static let aquaStrong = Color(red: 185 / 255, green: 245 / 255, blue: 247 / 255)
    static let plusGold = Color(red: 255 / 255, green: 211 / 255, blue: 117 / 255)
    static let panel = deepWater.opacity(0.88)
    static let hairline = aqua.opacity(0.30)

    static func chineseDisplay(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("Noto Serif SC", size: size).weight(weight)
    }

    static func englishSerif(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("Noto Serif SC", size: size).weight(weight)
    }

    static func sans(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("Noto Sans SC", size: size).weight(weight)
    }
}

/// Shared with H5's 24 x 22 faceted mark; decorative, never an entitlement signal alone.
struct PremiumGemIcon: View {
    var body: some View {
        Canvas { context, size in
            func path(_ points: [(CGFloat, CGFloat)], closed: Bool = true) -> Path {
                var result = Path()
                for (index, point) in points.enumerated() {
                    let scaled = CGPoint(x: point.0 * size.width / 24, y: point.1 * size.height / 22)
                    if index == 0 { result.move(to: scaled) } else { result.addLine(to: scaled) }
                }
                if closed { result.closeSubpath() }
                return result
            }
            let facets: [([(CGFloat, CGFloat)], Color)] = [
                ([(1, 7), (6, 1), (12, 7)], Color(red: 255/255, green: 233/255, blue: 179/255)),
                ([(6, 1), (18, 1), (12, 7)], Color(red: 255/255, green: 222/255, blue: 145/255)),
                ([(18, 1), (23, 7), (12, 7)], Color(red: 245/255, green: 179/255, blue: 78/255)),
                ([(1, 7), (8, 7), (12, 21)], Color(red: 245/255, green: 172/255, blue: 61/255)),
                ([(8, 7), (16, 7), (12, 21)], YixiuTheme.plusGold),
                ([(16, 7), (23, 7), (12, 21)], Color(red: 223/255, green: 129/255, blue: 41/255))
            ]
            for (points, color) in facets { context.fill(path(points), with: .color(color)) }
            let highlight = Color(red: 255/255, green: 240/255, blue: 200/255)
            let scale = min(size.width / 24, size.height / 22)
            context.stroke(path([(1, 7), (6, 1), (18, 1), (23, 7), (12, 21)]),
                           with: .color(highlight), style: StrokeStyle(lineWidth: 0.85 * scale, lineJoin: .round))
            let seams: [[(CGFloat, CGFloat)]] = [
                [(1, 7), (23, 7)], [(6, 1), (12, 7), (18, 1)], [(8, 7), (12, 21), (16, 7)]
            ]
            for points in seams {
                context.stroke(path(points, closed: false), with: .color(highlight.opacity(0.65)),
                               style: StrokeStyle(lineWidth: 0.65 * scale, lineJoin: .round))
            }
        }
        .aspectRatio(24.0 / 22.0, contentMode: .fit)
        .accessibilityHidden(true)
    }
}

struct UppercaseSecondary: ViewModifier {
    let size: CGFloat

    func body(content: Content) -> some View {
        content
            .font(YixiuTheme.englishSerif(size, weight: .semibold))
            .tracking(size * 0.12)
            .foregroundStyle(YixiuTheme.aqua)
            .textCase(.uppercase)
    }
}

extension View {
    func yixiuSecondary(_ size: CGFloat) -> some View {
        modifier(UppercaseSecondary(size: size))
    }

    func yixiuPanel() -> some View {
        background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(YixiuTheme.panel)
                .overlay(
                    LinearGradient(
                        colors: [YixiuTheme.aqua.opacity(0.08), .clear],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .stroke(YixiuTheme.hairline, lineWidth: 0.8)
                )
                .shadow(color: .black.opacity(0.22), radius: 24, y: 14)
        )
    }
}
