# 一休冥想 EverEasy 2.0

这是根据原 App Store 产品重新建立的原生 iOS 工程。源代码使用 SwiftUI，包名沿用旧 App 的 `com.health.yixiu`，用于后续继续维护和提交更新。

## 已实现

- “如水晨光”首页与中英双语优先级切换
- 晨雾、雨声、海浪、溪流四种本地自然声
- 15 / 30 / 60 分钟倒计时
- 后台音频播放能力
- 一分钟水波呼吸练习
- 聆听、静心、我的三页导航
- 语言、时长和上次场景的本机持久化
- 从旧 App Store 截图恢复的品牌图标

所有声音都由 `AVAudioEngine` 在设备上实时合成，不依赖账号、服务器或网络。

## 打开与运行

1. 用 Xcode 打开 `YixiuMeditation.xcodeproj`。
2. 在 Target → Signing & Capabilities 中选择你的 Apple Developer Team。
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

## App Store 更新前

- 当前版本号：`2.0 (1)`
- Bundle ID：`com.health.yixiu`
- 最低系统：iOS 17
- 需要在 Xcode 选择开发者 Team 并确认签名证书
- 建议在正式上传前重新绘制 1024 × 1024 品牌图标；当前图标由旧 App Store 截图恢复，身份一致但原始分辨率有限
- 用真机验证锁屏、来电打断、蓝牙耳机和后台播放
- 在 App Store Connect 完成隐私问卷、年龄分级和新的中英文截图
