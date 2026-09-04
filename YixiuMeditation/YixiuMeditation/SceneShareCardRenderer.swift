import CoreImage
import CoreImage.CIFilterBuiltins
import Foundation
import UIKit

struct SceneSharePayload: Identifiable {
    let id = UUID()
    let image: UIImage
    let url: URL
}

enum SceneShareCardRenderer {
    private static let size = CGSize(width: 1080, height: 1350)

    static func render(scene: MeditationScene, language: AppLanguage) -> UIImage? {
        guard let background = UIImage(named: scene.assetName),
              let qrImage = qrCode(for: scene.shareURL(language: language))
        else {
            return nil
        }

        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        format.opaque = true
        return UIGraphicsImageRenderer(size: size, format: format).image { renderer in
            let context = renderer.cgContext
            drawAspectFill(background, in: CGRect(origin: .zero, size: size))
            drawWaterShade(in: context)
            drawIdentity(scene: scene, language: language)
            drawQRCode(qrImage, in: context)
        }
    }

    private static func drawAspectFill(_ image: UIImage, in bounds: CGRect) {
        let sourceRatio = image.size.width / image.size.height
        let targetRatio = bounds.width / bounds.height
        let drawSize = sourceRatio > targetRatio
            ? CGSize(width: bounds.height * sourceRatio, height: bounds.height)
            : CGSize(width: bounds.width, height: bounds.width / sourceRatio)
        let rect = CGRect(
            x: bounds.midX - drawSize.width / 2,
            y: bounds.midY - drawSize.height / 2,
            width: drawSize.width,
            height: drawSize.height
        )
        image.draw(in: rect)
    }

    private static func drawWaterShade(in context: CGContext) {
        let colors = [
            UIColor(red: 0, green: 0.06, blue: 0.10, alpha: 0.08).cgColor,
            UIColor(red: 0, green: 0.07, blue: 0.11, alpha: 0.22).cgColor,
            UIColor(red: 0, green: 0.04, blue: 0.07, alpha: 0.96).cgColor,
        ] as CFArray
        guard let gradient = CGGradient(
            colorsSpace: CGColorSpaceCreateDeviceRGB(),
            colors: colors,
            locations: [0, 0.48, 1]
        ) else { return }
        context.drawLinearGradient(
            gradient,
            start: CGPoint(x: size.width / 2, y: 0),
            end: CGPoint(x: size.width / 2, y: size.height),
            options: []
        )
    }

    private static func drawIdentity(scene: MeditationScene, language: AppLanguage) {
        let serif = UIFont(name: "NotoSerifSC-Regular", size: 78) ?? .systemFont(ofSize: 78, weight: .semibold)
        let serifSmall = UIFont(name: "NotoSerifSC-Regular", size: 38) ?? .systemFont(ofSize: 38, weight: .regular)
        let sans = UIFont(name: "NotoSansSC-Regular", size: 24) ?? .systemFont(ofSize: 24, weight: .regular)
        let brandFont = UIFont(name: "NotoSerifSC-SemiBold", size: 46) ?? .systemFont(ofSize: 46, weight: .semibold)
        let moon = UIColor(red: 0.93, green: 0.97, blue: 0.95, alpha: 0.98)
        let mist = UIColor(red: 0.70, green: 0.86, blue: 0.85, alpha: 0.78)

        let brand = language.text(zh: "一休", en: "YIXIU")
        brand.draw(
            at: CGPoint(x: 72, y: 58),
            withAttributes: [.font: brandFont, .foregroundColor: moon]
        )
        language.text(zh: "YIXIU", en: "一休").draw(
            at: CGPoint(x: 74, y: 116),
            withAttributes: [.font: UIFont.systemFont(ofSize: 21, weight: .medium), .foregroundColor: mist]
        )

        let primary = language.text(zh: scene.zhName, en: scene.enName.uppercased())
        primary.draw(
            in: CGRect(x: 72, y: 820, width: 700, height: 110),
            withAttributes: [.font: serif, .foregroundColor: moon]
        )
        language.text(zh: scene.enName.uppercased(), en: scene.zhName).draw(
            in: CGRect(x: 74, y: 920, width: 680, height: 50),
            withAttributes: [.font: sans, .foregroundColor: mist]
        )

        language.text(zh: "真实自己，流动人生。", en: "True to yourself, flow with life.").draw(
            in: CGRect(x: 72, y: 1010, width: 680, height: 58),
            withAttributes: [.font: serifSmall, .foregroundColor: moon]
        )
        language.text(zh: "扫码聆听这一刻", en: "Scan to listen to this moment").draw(
            in: CGRect(x: 74, y: 1080, width: 620, height: 44),
            withAttributes: [.font: UIFont.systemFont(ofSize: 22), .foregroundColor: mist]
        )
    }

    private static func qrCode(for url: URL) -> CGImage? {
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(url.absoluteString.utf8)
        filter.correctionLevel = "M"
        guard let output = filter.outputImage else { return nil }

        let scale = 12.0
        let transformed = output.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
        return CIContext(options: [.useSoftwareRenderer: false]).createCGImage(transformed, from: transformed.extent)
    }

    private static func drawQRCode(_ image: CGImage, in context: CGContext) {
        let panel = CGRect(x: 800, y: 1060, width: 220, height: 220)
        UIColor(red: 0.96, green: 0.99, blue: 0.98, alpha: 0.98).setFill()
        UIBezierPath(roundedRect: panel, cornerRadius: 28).fill()

        context.saveGState()
        context.interpolationQuality = .none
        context.translateBy(x: 0, y: size.height)
        context.scaleBy(x: 1, y: -1)
        context.draw(image, in: CGRect(x: 816, y: size.height - 1264, width: 188, height: 188))
        context.restoreGState()
    }
}
