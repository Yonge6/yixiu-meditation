# 一休冥想 EverEasy 2.0

一休冥想的原生 iOS V1 重建工程。界面以「深水沉浸播放器」为基准，使用 SwiftUI、AVFoundation 与本机持久化；Bundle ID 沿用旧版 `com.health.yixiu`，用于后续继续维护并作为旧 App 的正式更新。

## V1 已实现

- 大海、屋檐雨、山间溪流、晨雾湖岸、林间瀑布、夜潮 6 个水系场景
- 播放、暂停、上一首、下一首、收藏与音量控制
- 15 / 30 / 60 分钟及不计时播放，计时结束前柔和淡出
- 简体中文 / English 切换
- 上次场景、收藏、默认时长、语言、结束铃声与后台播放偏好的本机保存
- 1 分钟水之呼吸：4 秒吸气、2 秒停留、6 秒呼气，循环 5 次
- 聆听、静心、我的三个完整一级页面
- 来电等系统音频打断与耳机断开后的暂停处理
- 后台音频能力与深色状态栏适配
- 无账号、无广告、无需业务服务器

当前 6 种声音由 `AVAudioEngine` 在设备上实时合成，适合功能开发和交互验证。正式提交 App Store 前，应替换成具有商业授权、经过无缝循环和响度统一处理的真实水声录音。

## 打开与运行

1. 用 Xcode 打开 `YixiuMeditation.xcodeproj`。
2. 在 Target → Signing & Capabilities 中选择 Apple Developer Team。
3. 选择 iPhone 模拟器或真机，点击 Run。

命令行编译：

```sh
xcodebuild \
  -project YixiuMeditation.xcodeproj \
  -scheme YixiuMeditation \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO \
  build
```

## 当前验证

- iOS Simulator Debug 构建通过
- 原生首页已在 iPhone 模拟器启动并完成视觉检查
- 状态栏与顶部品牌已适配安全区
- H5 同步版本已通过 16 项 Playwright 测试

原生验收图：`yixiu-native-v1-sounds-fixed.png`。

## App Store 更新前

完整边界见 `../docs/plans/2026-08-09-yixiu-v1-release-checklist.md`。当前仍需完成真实授权音频、锁屏控制与媒体信息、开发者签名、真机蓝牙/耳机/来电/后台验证、正式图标、隐私与支持页面，以及中英文 App Store 素材。

- 当前版本号：`2.0 (1)`
- Bundle ID：`com.health.yixiu`
- 最低系统：iOS 17
