import SwiftUI

enum YixiuTheme {
    static let ink = Color(red: 23 / 255, green: 63 / 255, blue: 53 / 255)
    static let inkSoft = Color(red: 82 / 255, green: 112 / 255, blue: 102 / 255)
    static let ivory = Color(red: 248 / 255, green: 243 / 255, blue: 232 / 255)
    static let gold = Color(red: 184 / 255, green: 138 / 255, blue: 62 / 255)
    static let hairline = gold.opacity(0.42)

    static func chineseDisplay(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("Songti SC", size: size).weight(weight)
    }

    static func englishSerif(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("Baskerville", size: size).weight(weight)
    }
}

struct UppercaseSecondary: ViewModifier {
    let size: CGFloat

    func body(content: Content) -> some View {
        content
            .font(YixiuTheme.englishSerif(size, weight: .semibold))
            .tracking(size * 0.12)
            .foregroundStyle(YixiuTheme.gold)
            .textCase(.uppercase)
    }
}

extension View {
    func yixiuSecondary(_ size: CGFloat) -> some View {
        modifier(UppercaseSecondary(size: size))
    }
}
