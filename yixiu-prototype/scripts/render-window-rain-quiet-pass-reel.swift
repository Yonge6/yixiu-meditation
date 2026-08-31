import AppKit
import AVFoundation
import CoreVideo

let args = CommandLine.arguments
guard args.count == 6 else {
    fputs("usage: render-window-rain-quiet-pass-reel.swift IMAGE AUDIO OUTPUT COVER QA_DIRECTORY\n", stderr)
    exit(2)
}

let imageURL = URL(fileURLWithPath: args[1])
let audioURL = URL(fileURLWithPath: args[2])
let outputURL = URL(fileURLWithPath: args[3])
let coverURL = URL(fileURLWithPath: args[4])
let qaDirectory = URL(fileURLWithPath: args[5], isDirectory: true)
let silentURL = outputURL.deletingPathExtension().appendingPathExtension("silent.mp4")
let fileManager = FileManager.default

try fileManager.createDirectory(at: qaDirectory, withIntermediateDirectories: true)
[outputURL, coverURL, silentURL].forEach { try? fileManager.removeItem(at: $0) }

guard let sourceImage = NSImage(contentsOf: imageURL) else {
    fputs("unable to load image\n", stderr)
    exit(3)
}

let width = 1080
let height = 1920
let fps: Int32 = 30
let durationSeconds = 15
let frameCount = Int(fps) * durationSeconds
let mist = NSColor(calibratedRed: 0.78, green: 0.93, blue: 0.96, alpha: 1)

func font(_ size: CGFloat, weight: NSFont.Weight = .regular, serif: Bool = false) -> NSFont {
    if serif {
        return NSFont(name: "Iowan Old Style", size: size)
            ?? NSFont(name: "Times New Roman", size: size)
            ?? NSFont.systemFont(ofSize: size)
    }
    return NSFont.systemFont(ofSize: size, weight: weight)
}

func drawCentered(
    _ text: String,
    y: CGFloat,
    size: CGFloat,
    color: NSColor,
    weight: NSFont.Weight = .regular,
    tracking: CGFloat = 0,
    serif: Bool = false,
    height boxHeight: CGFloat = 360
) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = .center
    paragraph.lineSpacing = size * 0.16
    let attributed = NSAttributedString(
        string: text,
        attributes: [
            .font: font(size, weight: weight, serif: serif),
            .foregroundColor: color,
            .kern: tracking,
            .paragraphStyle: paragraph
        ]
    )
    attributed.draw(in: NSRect(x: 88, y: y, width: CGFloat(width - 176), height: boxHeight))
}

func smoothFade(_ second: Double, start: Double, end: Double, edge: Double = 0.38) -> CGFloat {
    let fadeIn = max(0, min(1, (second - start) / edge))
    let fadeOut = max(0, min(1, (end - second) / edge))
    return CGFloat(min(fadeIn, fadeOut))
}

func drawFrame(_ context: CGContext, second: Double) {
    context.setFillColor(NSColor(calibratedRed: 0.015, green: 0.06, blue: 0.08, alpha: 1).cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))

    let imageSize = sourceImage.size
    let progress = CGFloat(second / Double(durationSeconds))
    let zoom = 1.035 + (0.045 * progress)
    let scale = max(CGFloat(width) / imageSize.width, CGFloat(height) / imageSize.height) * zoom
    let drawWidth = imageSize.width * scale
    let drawHeight = imageSize.height * scale
    let imageRect = CGRect(
        x: (CGFloat(width) - drawWidth) / 2 - 18 * progress,
        y: (CGFloat(height) - drawHeight) / 2 + 10 * progress,
        width: drawWidth,
        height: drawHeight
    )
    sourceImage.draw(in: imageRect, from: .zero, operation: .sourceOver, fraction: 1)

    let overlay = NSColor(calibratedRed: 0.015, green: 0.09, blue: 0.13, alpha: 0.52)
    context.setFillColor(overlay.cgColor)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))

    let topShade = CGGradient(
        colorsSpace: CGColorSpaceCreateDeviceRGB(),
        colors: [
            NSColor.black.withAlphaComponent(0.68).cgColor,
            NSColor.black.withAlphaComponent(0.06).cgColor
        ] as CFArray,
        locations: [0, 1]
    )!
    context.drawLinearGradient(
        topShade,
        start: CGPoint(x: 0, y: height),
        end: CGPoint(x: 0, y: 1040),
        options: []
    )

    let bottomShade = CGGradient(
        colorsSpace: CGColorSpaceCreateDeviceRGB(),
        colors: [
            NSColor.black.withAlphaComponent(0.72).cgColor,
            NSColor.black.withAlphaComponent(0.08).cgColor
        ] as CFArray,
        locations: [0, 1]
    )!
    context.drawLinearGradient(
        bottomShade,
        start: CGPoint(x: 0, y: 0),
        end: CGPoint(x: 0, y: 780),
        options: []
    )

    drawCentered(
        "YIXIU  /  WINDOW RAIN",
        y: 1642,
        size: 24,
        color: mist.withAlphaComponent(0.9),
        weight: .semibold,
        tracking: 4.5,
        height: 70
    )

    context.setStrokeColor(mist.withAlphaComponent(0.34).cgColor)
    context.setLineWidth(1.5)
    context.move(to: CGPoint(x: 190, y: 1608))
    context.addLine(to: CGPoint(x: 890, y: 1608))
    context.strokePath()

    if second < 3.7 {
        let alpha = smoothFade(second, start: 0, end: 3.7, edge: 0.5)
        drawCentered(
            "SOMEONE CAME\nTO MIND?",
            y: 970,
            size: 78,
            color: NSColor.white.withAlphaComponent(alpha),
            weight: .bold,
            tracking: 0.8
        )
        drawCentered(
            "A QUIET MOMENT CAN TRAVEL",
            y: 812,
            size: 24,
            color: mist.withAlphaComponent(alpha * 0.82),
            weight: .medium,
            tracking: 3.3,
            height: 64
        )
    } else if second < 7.5 {
        let alpha = smoothFade(second, start: 3.7, end: 7.5)
        drawCentered(
            "LISTEN FOR ONE\nQUIET MINUTE",
            y: 968,
            size: 70,
            color: NSColor.white.withAlphaComponent(alpha),
            weight: .bold,
            tracking: 0.5
        )
        drawCentered(
            "WINDOW RAIN · REAL AUDIO",
            y: 812,
            size: 24,
            color: mist.withAlphaComponent(alpha * 0.82),
            weight: .medium,
            tracking: 3.4,
            height: 64
        )
    } else if second < 11.5 {
        let alpha = smoothFade(second, start: 7.5, end: 11.5)
        drawCentered(
            "SEND THEM\n96 SECONDS OF\nWINDOW RAIN",
            y: 905,
            size: 65,
            color: NSColor.white.withAlphaComponent(alpha),
            weight: .bold,
            tracking: 0.3,
            height: 420
        )
        drawCentered(
            "A COMPLETE QUIET PASS",
            y: 780,
            size: 24,
            color: mist.withAlphaComponent(alpha * 0.82),
            weight: .medium,
            tracking: 3.5,
            height: 64
        )
    } else {
        let alpha = smoothFade(second, start: 11.5, end: 15, edge: 0.46)
        drawCentered(
            "FREE  ·  NO ACCOUNT",
            y: 1050,
            size: 57,
            color: NSColor.white.withAlphaComponent(alpha),
            weight: .bold,
            tracking: 1.2,
            height: 110
        )
        drawCentered(
            "LINK IN BIO",
            y: 900,
            size: 64,
            color: mist.withAlphaComponent(alpha),
            weight: .semibold,
            tracking: 2.5,
            height: 120
        )
        drawCentered(
            "OPEN SLEEP SOUNDS · CHOOSE WINDOW RAIN",
            y: 806,
            size: 20,
            color: NSColor.white.withAlphaComponent(alpha * 0.66),
            weight: .medium,
            tracking: 2.1,
            height: 62
        )
    }

    context.setFillColor(NSColor.white.withAlphaComponent(0.2).cgColor)
    context.fill(CGRect(x: 120, y: 250, width: 840, height: 3))
    context.setFillColor(mist.withAlphaComponent(0.92).cgColor)
    context.fill(CGRect(x: 120, y: 250, width: max(8, 840 * progress), height: 3))

    drawCentered(
        "96 SEC · SHARE AFTER 60 SEC",
        y: 190,
        size: 19,
        color: NSColor.white.withAlphaComponent(0.56),
        weight: .medium,
        tracking: 3.2,
        height: 60
    )
}

let writer = try AVAssetWriter(outputURL: silentURL, fileType: .mp4)
let videoInput = AVAssetWriterInput(
    mediaType: .video,
    outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 5_000_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2
        ]
    ]
)
videoInput.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: videoInput,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
        kCVPixelBufferIOSurfacePropertiesKey as String: [:]
    ]
)

guard writer.canAdd(videoInput) else { fatalError("cannot add video input") }
writer.add(videoInput)
guard writer.startWriting() else { fatalError(writer.error?.localizedDescription ?? "writer start failed") }
writer.startSession(atSourceTime: .zero)

for frame in 0..<frameCount {
    while !videoInput.isReadyForMoreMediaData { usleep(1_000) }
    guard let pool = adaptor.pixelBufferPool else { fatalError("pixel buffer pool unavailable") }
    var maybeBuffer: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool, &maybeBuffer)
    guard let buffer = maybeBuffer else { fatalError("pixel buffer allocation failed") }
    CVPixelBufferLockBaseAddress(buffer, [])
    guard let base = CVPixelBufferGetBaseAddress(buffer) else { fatalError("pixel buffer base unavailable") }
    let bytesPerRow = CVPixelBufferGetBytesPerRow(buffer)
    guard let context = CGContext(
        data: base,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: bytesPerRow,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
    ) else { fatalError("context creation failed") }

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)
    drawFrame(context, second: Double(frame) / Double(fps))
    NSGraphicsContext.restoreGraphicsState()

    CVPixelBufferUnlockBaseAddress(buffer, [])
    let time = CMTime(value: CMTimeValue(frame), timescale: fps)
    guard adaptor.append(buffer, withPresentationTime: time) else {
        fatalError(writer.error?.localizedDescription ?? "append failed")
    }
}

videoInput.markAsFinished()
let writerGroup = DispatchGroup()
writerGroup.enter()
writer.finishWriting { writerGroup.leave() }
writerGroup.wait()
guard writer.status == .completed else { fatalError(writer.error?.localizedDescription ?? "writer failed") }

let videoAsset = AVURLAsset(url: silentURL)
let audioAsset = AVURLAsset(url: audioURL)
guard let sourceVideoTrack = videoAsset.tracks(withMediaType: .video).first,
      let sourceAudioTrack = audioAsset.tracks(withMediaType: .audio).first else {
    fatalError("missing source tracks")
}

let composition = AVMutableComposition()
guard let videoTrack = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid),
      let audioTrack = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) else {
    fatalError("cannot create composition tracks")
}
let totalDuration = CMTime(seconds: Double(durationSeconds), preferredTimescale: 600)
try videoTrack.insertTimeRange(CMTimeRange(start: .zero, duration: totalDuration), of: sourceVideoTrack, at: .zero)

var audioCursor = CMTime.zero
while audioCursor < totalDuration {
    let remaining = CMTimeSubtract(totalDuration, audioCursor)
    let insertDuration = CMTimeMinimum(audioAsset.duration, remaining)
    try audioTrack.insertTimeRange(CMTimeRange(start: .zero, duration: insertDuration), of: sourceAudioTrack, at: audioCursor)
    audioCursor = CMTimeAdd(audioCursor, insertDuration)
}

guard let exporter = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetHighestQuality) else {
    fatalError("exporter unavailable")
}
exporter.outputURL = outputURL
exporter.outputFileType = .mp4
exporter.shouldOptimizeForNetworkUse = true
let exportGroup = DispatchGroup()
exportGroup.enter()
exporter.exportAsynchronously { exportGroup.leave() }
exportGroup.wait()
guard exporter.status == .completed else { fatalError(exporter.error?.localizedDescription ?? "export failed") }

let finalAsset = AVURLAsset(url: outputURL)
let generator = AVAssetImageGenerator(asset: finalAsset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

func writeJPEG(at second: Double, to destination: URL) throws {
    let image = try generator.copyCGImage(at: CMTime(seconds: second, preferredTimescale: 600), actualTime: nil)
    let bitmap = NSBitmapImageRep(cgImage: image)
    guard let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.92]) else {
        fatalError("jpeg encoding failed")
    }
    try jpeg.write(to: destination)
}

try writeJPEG(at: 1.5, to: coverURL)
for second in [1.5, 5.2, 9.2, 13.0, 14.4] {
    let name = String(format: "frame-%04.1f.jpg", second).replacingOccurrences(of: ".", with: "-")
    try writeJPEG(at: second, to: qaDirectory.appendingPathComponent(name))
}

try? fileManager.removeItem(at: silentURL)

let finalVideoTracks = finalAsset.tracks(withMediaType: .video)
let finalAudioTracks = finalAsset.tracks(withMediaType: .audio)
guard let finalVideo = finalVideoTracks.first else { fatalError("final video track missing") }
let size = finalVideo.naturalSize.applying(finalVideo.preferredTransform)
let dimensions = "\(Int(abs(size.width)))x\(Int(abs(size.height)))"
let seconds = CMTimeGetSeconds(finalAsset.duration)
let fileSize = (try? fileManager.attributesOfItem(atPath: outputURL.path)[.size] as? NSNumber)?.int64Value ?? -1

print("OUTPUT=\(outputURL.path)")
print("DIMENSIONS=\(dimensions)")
print(String(format: "DURATION=%.3f", seconds))
print("VIDEO_TRACKS=\(finalVideoTracks.count)")
print("AUDIO_TRACKS=\(finalAudioTracks.count)")
print("FILE_SIZE=\(fileSize)")
