# 一休「安静陪伴增强版」实施计划

**目标：** 在不增加账号、内容流或使用压力的前提下，让一休更快开始、更稳定聆听、更容易重复回来。

**架构：** H5 继续以 React 单页播放器和本机存储为核心；iOS 继续使用 SwiftUI、`AppState` 与 `AVFoundation`。两端共享相同的场景分类、最近聆听、1/3 分钟静心和文案逻辑；系统锁屏与控制中心能力只在 iOS 实现。

**技术栈：** React 19、TypeScript、Vite、Playwright、SwiftUI、AVFoundation、MediaPlayer、UserDefaults。

---

## 范围与边界

本版包含：

1. 场景切换约 0.6 秒交叉淡化。
2. iOS 锁屏与控制中心的播放、暂停、上一首、下一首和当前声音信息。
3. 静心支持 1 分钟与 3 分钟，可选择保留当前自然声或静音。
4. 声音库增加全部、睡眠、专注、清晨、放松分类。
5. 保存最多 4 个最近聆听场景，并在“我的”中快速继续。
6. H5 声音库使用轻量缩略图，预加载当前场景前后相邻图片。
7. 中英文、VoiceOver/ARIA、减少动态效果和现有手势保持可用。

本版不包含：账号、云同步、连续签到、内容流、订阅、多轨混音、Widget、Siri Shortcut。Widget 与 Siri 作为下一阶段独立任务，避免本次扩展工程和签名范围。

## Task 1：共享场景模型和最近聆听

**修改：**

- `YixiuMeditation/YixiuMeditation/Models.swift`
- `YixiuMeditation/YixiuMeditation/AppState.swift`
- `yixiu-prototype/src/Prototype.tsx`
- `yixiu-prototype/tests/v1-product.spec.ts`

**验收：** 分类结果一致；最近聆听去重、最新优先、最多 4 个，重启后保留。

## Task 2：音频交叉淡化和系统控制

**修改：**

- `YixiuMeditation/YixiuMeditation/AmbientAudioEngine.swift`
- `YixiuMeditation/YixiuMeditation/AppState.swift`
- `yixiu-prototype/src/Prototype.tsx`

**验收：** 播放中切换场景没有突兀断音；iOS 锁屏显示当前场景，并可播放、暂停、上一首、下一首。

## Task 3：静心增强

**修改：**

- `YixiuMeditation/YixiuMeditation/FocusView.swift`
- `yixiu-prototype/src/Prototype.tsx`
- `yixiu-prototype/src/prototype.css`
- `yixiu-prototype/tests/v1-product.spec.ts`

**验收：** 1/3 分钟选择持久化；倒计时按所选时长运行；自然声开关不会错误中断原播放器状态；暂停、继续、重来、完成均正确。

## Task 4：声音库分类和最近聆听

**修改：**

- `YixiuMeditation/YixiuMeditation/ListenView.swift`
- `YixiuMeditation/YixiuMeditation/MeView.swift`
- `yixiu-prototype/src/Prototype.tsx`
- `yixiu-prototype/src/prototype.css`
- `yixiu-prototype/tests/v1-product.spec.ts`

**验收：** 分类切换一步生效；选择声音后立即返回播放器；最近聆听可一点继续；没有历史时不显示空卡片。

## Task 5：H5 图片性能

**创建：**

- `yixiu-prototype/public/assets/yixiu/thumbs/*.jpg`

**修改：**

- `yixiu-prototype/src/Prototype.tsx`
- `yixiu-prototype/tests/v1-product.spec.ts`

**验收：** 声音库不再请求原始大图；缩略图单张目标小于 120 KB；当前和相邻场景图片被预加载；彩色色块仍作为加载前占位。当前 macOS 图像工具不提供 WebP 编码，因此首版缩略图使用高质量渐进式 JPEG。

## Task 6：验证与发布

1. `npm run build`
2. `npm run test:sites`
3. `npm run test:runtime -- tests/v1-product.spec.ts --workers=1`
4. iPhone 模拟器 Debug 构建。
5. iPhone 真机 Debug 构建、安装与启动。
6. 390 × 844 视觉检查声音、静心、我的与声音库。
7. 只提交本版范围内的文件，保留其他用户文件。
8. 推送 `main`，等待部署成功，并核验 `https://yixiu.wonderelian.com/`。
