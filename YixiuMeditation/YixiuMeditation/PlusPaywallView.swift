import StoreKit
import SwiftUI

struct PlusPaywallView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var subscriptionStore: SubscriptionStore
    @Environment(\.dismiss) private var dismiss
    @Environment(\.openURL) private var openURL
    @State private var selectedPlan: YixiuPlusPlan = .yearly
    @State private var resultMessage: String?

    private var language: AppLanguage { appState.language }

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 22) {
                    hero
                    planPicker
                    purchaseButton
                    benefits
                    legacyNote
                    footer
                }
                .padding(.horizontal, 20)
                .padding(.top, 18)
                .padding(.bottom, 34)
            }
            .background(background)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(YixiuTheme.moon)
                            .frame(width: 36, height: 36)
                            .background(Circle().fill(YixiuTheme.deepWaterSoft.opacity(0.74)))
                    }
                    .accessibilityLabel(language.text(zh: "关闭", en: "Close"))
                }
            }
            .toolbarBackground(.hidden, for: .navigationBar)
        }
        .preferredColorScheme(.dark)
        .task {
            if subscriptionStore.products.isEmpty {
                await subscriptionStore.loadProducts()
            }
        }
        .onChange(of: subscriptionStore.hasPlus) { _, hasPlus in
            if hasPlus { dismiss() }
        }
    }

    private var background: some View {
        ZStack {
            Image("UnderwaterEcho")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()
            LinearGradient(
                colors: [YixiuTheme.deepWater.opacity(0.58), YixiuTheme.deepWater.opacity(0.99)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
        }
    }

    private var hero: some View {
        VStack(spacing: 10) {
            Image(systemName: "drop.fill")
                .font(.system(size: 31, weight: .light))
                .foregroundStyle(YixiuTheme.aquaStrong)
                .frame(width: 70, height: 70)
                .background(Circle().fill(YixiuTheme.aqua.opacity(0.10)))
                .overlay(Circle().stroke(YixiuTheme.aqua.opacity(0.38), lineWidth: 0.8))

            Text("YIXIU PLUS")
                .yixiuSecondary(10)
            Text(language.text(zh: "让安静持续生长", en: "Let quiet keep growing"))
                .font(language == .zh ? YixiuTheme.chineseDisplay(30) : YixiuTheme.englishSerif(29))
                .foregroundStyle(YixiuTheme.moon)
            Text(language.text(
                zh: "订阅支持我们持续采集自然声、创作流动画面与新的静心练习。",
                en: "Your subscription funds new field recordings, flowing scenes, and quiet practices."
            ))
            .font(YixiuTheme.sans(13))
            .foregroundStyle(YixiuTheme.mist)
            .multilineTextAlignment(.center)
            .lineSpacing(5)
        }
    }

    private var benefits: some View {
        VStack(spacing: 0) {
            benefit("waveform", zh: "全部 14 种自然声与 10 首冥想音乐", en: "All 14 nature sounds and 10 meditation tracks")
            Divider().overlay(YixiuTheme.hairline)
            benefit("timer", zh: "60 分钟与不限时聆听", en: "60-minute and unlimited listening")
            Divider().overlay(YixiuTheme.hairline)
            benefit("circle.circle", zh: "5 / 10 分钟水之呼吸", en: "5 / 10-minute water breathing")
            Divider().overlay(YixiuTheme.hairline)
            benefit("sparkles", zh: "未来混音与日常静心练习", en: "Future mixes and daily practices")
        }
        .padding(.horizontal, 16)
        .yixiuPanel()
    }

    private func benefit(_ icon: String, zh: String, en: String) -> some View {
        HStack(spacing: 13) {
            Image(systemName: icon)
                .font(.system(size: 15, weight: .light))
                .foregroundStyle(YixiuTheme.aquaStrong)
                .frame(width: 28)
            Text(language.text(zh: zh, en: en))
                .font(YixiuTheme.sans(14, weight: .medium))
                .foregroundStyle(YixiuTheme.moon)
            Spacer()
            Image(systemName: "checkmark")
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(YixiuTheme.aqua)
        }
        .frame(minHeight: 52)
    }

    private var planPicker: some View {
        VStack(spacing: 10) {
            planCard(.yearly)
            planCard(.monthly)
        }
    }

    private func planCard(_ plan: YixiuPlusPlan) -> some View {
        Button {
            selectedPlan = plan
        } label: {
            VStack(alignment: .leading, spacing: 9) {
                HStack(alignment: .firstTextBaseline, spacing: 12) {
                    HStack(spacing: 10) {
                        Image(systemName: selectedPlan == plan ? "checkmark.circle.fill" : "circle")
                            .font(.system(size: 20, weight: .light))
                            .foregroundStyle(selectedPlan == plan ? YixiuTheme.aquaStrong : YixiuTheme.mist)
                        Text(plan == .yearly
                             ? language.text(zh: "连续包年", en: "Annual")
                             : language.text(zh: "连续包月", en: "Monthly"))
                            .font(YixiuTheme.sans(14, weight: .medium))
                            .foregroundStyle(YixiuTheme.moon)
                    }
                    Spacer()
                    if plan == .yearly && subscriptionStore.annualTrialEligible {
                        Text(language.text(zh: "含 7 天试用", en: "7-day trial"))
                            .font(YixiuTheme.sans(9, weight: .medium))
                            .foregroundStyle(YixiuTheme.aqua)
                    }
                }

                HStack(alignment: .firstTextBaseline, spacing: 7) {
                    Text(price(for: plan))
                        .font(YixiuTheme.englishSerif(28, weight: .semibold))
                        .monospacedDigit()
                    Text(plan == .yearly
                         ? language.text(zh: "/ 年", en: "/ year")
                         : language.text(zh: "/ 月", en: "/ month"))
                        .font(YixiuTheme.sans(13, weight: .medium))
                        .foregroundStyle(YixiuTheme.mist)
                }
                .foregroundStyle(YixiuTheme.moon)

                Text(planSubtitle(plan))
                    .font(YixiuTheme.sans(11))
                    .foregroundStyle(YixiuTheme.mist)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity, minHeight: 108, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 19, style: .continuous)
                    .fill(YixiuTheme.deepWaterSoft.opacity(selectedPlan == plan ? 0.88 : 0.56))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 19, style: .continuous)
                    .stroke(selectedPlan == plan ? YixiuTheme.aqua : YixiuTheme.hairline, lineWidth: 0.9)
            )
        }
        .buttonStyle(.plain)
    }

    private func planSubtitle(_ plan: YixiuPlusPlan) -> String {
        if plan == .yearly {
            if subscriptionStore.annualTrialEligible {
                return language.text(
                    zh: "7 天免费试用，之后每年 \(price(for: plan)) 自动续订，可随时取消。",
                    en: "7-day free trial, then \(price(for: plan)) per year. Renews automatically until canceled."
                )
            }
            return language.text(
                zh: "每年 \(price(for: plan)) 自动续订，可随时取消。",
                en: "\(price(for: plan)) per year. Renews automatically until canceled."
            )
        }
        return language.text(
            zh: "每月 \(price(for: plan)) 自动续订，可随时取消。",
            en: "\(price(for: plan)) per month. Renews automatically until canceled."
        )
    }

    private func price(for plan: YixiuPlusPlan) -> String {
        subscriptionStore.product(for: plan)?.displayPrice ?? language.text(zh: "所示价格", en: "the displayed price")
    }

    private var purchaseButton: some View {
        VStack(spacing: 10) {
            Button {
                Task {
                    resultMessage = message(for: await subscriptionStore.purchase(selectedPlan))
                }
            } label: {
                HStack(spacing: 9) {
                    if subscriptionStore.isBusy {
                        ProgressView().tint(YixiuTheme.deepWater)
                    }
                    Text(language.text(zh: "继续", en: "Continue"))
                }
                .font(YixiuTheme.sans(15, weight: .semibold))
                .foregroundStyle(YixiuTheme.deepWater)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(Capsule().fill(YixiuTheme.aquaStrong))
                .shadow(color: YixiuTheme.aqua.opacity(0.18), radius: 18, y: 8)
            }
            .buttonStyle(.plain)
            .disabled(subscriptionStore.isBusy || subscriptionStore.product(for: selectedPlan) == nil)

            Text(purchaseDisclosure)
                .font(YixiuTheme.sans(11, weight: .medium))
                .foregroundStyle(YixiuTheme.moon.opacity(0.92))
                .multilineTextAlignment(.center)
                .lineSpacing(3)
                .fixedSize(horizontal: false, vertical: true)

            if subscriptionStore.productsUnavailable {
                Button {
                    Task { await subscriptionStore.loadProducts() }
                } label: {
                    Text(language.text(zh: "价格暂时未载入，点此重试", en: "Prices unavailable. Tap to retry."))
                        .font(YixiuTheme.sans(11))
                        .foregroundStyle(YixiuTheme.aqua)
                }
                .buttonStyle(.plain)
            } else if let resultMessage {
                Text(resultMessage)
                    .font(YixiuTheme.sans(11))
                    .foregroundStyle(YixiuTheme.mist)
                    .multilineTextAlignment(.center)
            }
        }
    }

    private var purchaseDisclosure: String {
        if selectedPlan == .yearly && subscriptionStore.annualTrialEligible {
            return language.text(
                zh: "7 天免费试用，之后每年 \(price(for: .yearly)) 自动续订，取消前持续有效。",
                en: "7-day free trial, then \(price(for: .yearly)) per year. Automatically renews until canceled."
            )
        }
        return selectedPlan == .yearly
            ? language.text(
                zh: "每年 \(price(for: .yearly)) 自动续订，取消前持续有效。",
                en: "\(price(for: .yearly)) per year. Automatically renews until canceled."
            )
            : language.text(
                zh: "每月 \(price(for: .monthly)) 自动续订，取消前持续有效。",
                en: "\(price(for: .monthly)) per month. Automatically renews until canceled."
            )
    }

    private var legacyNote: some View {
        Text(language.text(
            zh: "已拥有一休 1.2 或更早版本的用户，原有 14 种自然声与功能继续保留；2 首冥想音乐同样免费，其余新音乐属于 Plus。",
            en: "If you owned Yixiu 1.2 or earlier, all 14 original nature sounds remain yours. Two meditation tracks are also free; the other new tracks require Plus."
        ))
        .font(YixiuTheme.sans(11))
        .foregroundStyle(YixiuTheme.mist.opacity(0.78))
        .multilineTextAlignment(.center)
        .lineSpacing(4)
        .padding(.horizontal, 8)
    }

    private var footer: some View {
        VStack(spacing: 13) {
            Button {
                Task { resultMessage = message(for: await subscriptionStore.restorePurchases()) }
            } label: {
                Text(language.text(zh: "恢复购买", en: "Restore Purchases"))
            }

            HStack(spacing: 18) {
                Link(language.text(zh: "隐私说明", en: "Privacy"), destination: URL(string: "https://yixiu.wonderelian.com/privacy.html")!)
                Link(language.text(zh: "使用条款", en: "Terms"), destination: URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!)
                Button(language.text(zh: "管理订阅", en: "Manage")) {
                    openURL(URL(string: "https://apps.apple.com/account/subscriptions")!)
                }
            }
            .font(YixiuTheme.sans(10))
        }
        .font(YixiuTheme.sans(12, weight: .medium))
        .foregroundStyle(YixiuTheme.mist)
        .buttonStyle(.plain)
    }

    private func message(for result: SubscriptionActionResult) -> String? {
        switch result {
        case .purchased:
            language.text(zh: "欢迎来到一休 Plus。", en: "Welcome to Yixiu Plus.")
        case .restored:
            language.text(zh: "已恢复你的权益。", en: "Your access has been restored.")
        case .nothingToRestore:
            language.text(zh: "没有找到可恢复的订阅。", en: "No subscription was found to restore.")
        case .pending:
            language.text(zh: "购买等待确认，完成后会自动解锁。", en: "Purchase pending. Access will unlock after approval.")
        case .unavailable:
            language.text(zh: "商店暂时不可用，请稍后重试。", en: "The store is temporarily unavailable.")
        case .failed:
            language.text(zh: "购买未完成，请稍后重试。", en: "The purchase could not be completed.")
        case .cancelled:
            nil
        }
    }
}
