# 一休增长基础与自定产品页面

日期：2026-08-22

## 第一阶段：可衡量的增长基础

### H5 事件

| 事件 | 触发条件 | 关键参数 |
| --- | --- | --- |
| `yixiu_landing_view` | 首次打开 H5 | `landing_scene`、`landing_language`、`referrer_host`、UTM |
| `yixiu_playback_start` | 开始播放自然声 | `selected_scene` |
| `yixiu_scene_select` | 切换声音场景 | `selected_scene` |
| `yixiu_scene_share` | 成功调用系统分享或复制链接 | `shared_scene`、`share_method` |
| `yixiu_focus_start` | 开始静心练习 | `focus_minutes`、`nature_sound` |
| `yixiu_listening_complete` | 定时聆听完成 | `completed_scene`、`timer_minutes` |
| `yixiu_focus_complete` | 静心练习完成 | `focus_minutes`、`nature_sound` |
| `yixiu_download_click` | 点击 App Store 下载入口 | `placement` |
| `yixiu_tab_select` | 切换底部栏目 | `selected_tab` |
| `yixiu_language_change` | 切换中英文 | `selected_language` |

所有事件自动携带 `site_id`、`surface`、`language`、`scene`、`active_tab`、页面路径与 UTM。H5 仅在正式域名启用 GA4；关闭 Google Signals 与广告个性化，不收集账号身份。

### 原生 App

- App 名称按系统语言显示为“一休冥想”或“Yixiu”。
- 用户在至少两个不同日期完成三次有效聆听或静心后，系统才会请求 App Store 评分。
- 同一版本最多请求一次；Apple 仍决定是否实际显示评分弹窗。
- 参与度数据仅保存在设备本地，不接入第三方用户追踪 SDK。

### 每周经营看板

北极星指标：每周完成的有效安静时刻（完成定时聆听或静心）。

辅助指标：

1. 落地页访问 → 播放开始
2. 播放开始 → 3 分钟以上使用
3. 使用 → 场景分享
4. H5 → App Store 点击
5. App Store 产品页浏览 → 下载
6. 下载 → 首次有效聆听
7. 第 1、7、30 天留存
8. 商店评分数量与平均分

## 第二阶段：App Store 搜索与意图页面

### Sleep · 助眠

- 中文：雨声、海浪与夜潮，为睡前留一处安静空间。选择 15、30、60 分钟或不限时，支持后台播放；无需账号，没有广告，让自然声陪你慢慢入睡。
- English: Rain, ocean waves, and night tide create a quieter path to sleep. Choose a timer or listen without limits, with background playback and no ads.
- 公开链接：https://apps.apple.com/us/app/一休冥想-白噪音与静心/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752
- 产品页面 ID：`67cb8784-2b16-4849-b940-90fdf4d99752`

### Focus · 专注

- 中文：溪流、鸟鸣与竹林细雨，陪你阅读、学习和专注工作。按场景快速切换，支持定时与后台播放；没有歌词，不打断思考。
- English: Streams, birds, and bamboo rain help you read, study, and focus. Switch scenes in one tap, set a timer, and keep listening in the background.
- 公开链接：https://apps.apple.com/us/app/一休冥想-白噪音与静心/id1461182261?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759
- 产品页面 ID：`7890afd3-dd12-4215-a5c5-17f4ebc28759`

### One-Minute Reset · 一分钟静心

- 中文：忙乱时，先给自己一分钟。跟随吸气、停驻与呼气的水之节奏，把注意力带回身体和当下；可选择自然声温柔陪伴。
- English: When life gets loud, take one quiet minute. Follow a gentle rhythm of breathing in, pausing, and breathing out—with optional nature sound.
- 公开链接：https://apps.apple.com/us/app/一休冥想-白噪音与静心/id1461182261?ppid=6c015245-76ff-4266-8837-5a0ffc289b9c
- 产品页面 ID：`6c015245-76ff-4266-8837-5a0ffc289b9c`

每个页面均使用三张 6.5 英寸 iPhone 截图，提供简体中文和英语（美国）两套文案与关键词。推广投放必须分别使用对应链接和 UTM，禁止三种用户意图共用同一落地页。
