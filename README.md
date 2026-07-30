# 一休冥想 EverEasy

七年后重新建立的一休冥想 iOS 产品：真实自己，流动人生。

## 在线体验

<https://yonge6.github.io/yixiu-meditation/>

体验版支持：

- 中英双语切换
- 晨雾、雨声、海浪与溪流
- 15 / 30 / 60 分钟倒计时
- 一分钟水波呼吸练习
- 聆听、静心与我的三页导航

## 工程

- `yixiu-prototype/`：经过视觉验收的可交互产品原型
- `YixiuMeditation/`：原生 SwiftUI iOS 工程，Bundle ID 为 `com.health.yixiu`
- `design/`：视觉目标、运行截图和设计 QA 对照
- `docs/`：产品与实施设计文档

每次推送到 `main` 后，GitHub Actions 会重新验证移动端运行时并自动发布 GitHub Pages。
