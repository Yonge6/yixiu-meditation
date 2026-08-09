import SwiftUI

enum YixiuTheme {
    static let deepWater = Color(red: 3 / 255, green: 23 / 255, blue: 33 / 255)
    static let deepWaterSoft = Color(red: 9 / 255, green: 44 / 255, blue: 56 / 255)
    static let moon = Color(red: 244 / 255, green: 248 / 255, blue: 248 / 255)
    static let mist = Color(red: 168 / 255, green: 192 / 255, blue: 197 / 255)
    static let aqua = Color(red: 143 / 255, green: 214 / 255, blue: 220 / 255)
    static let aquaStrong = Color(red: 185 / 255, green: 245 / 255, blue: 247 / 255)
    static let panel = deepWater.opacity(0.88)
    static let hairline = aqua.opacity(0.30)

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
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .stroke(YixiuTheme.hairline, lineWidth: 0.8)
                )
                .shadow(color: .black.opacity(0.22), radius: 24, y: 14)
        )
    }
}
