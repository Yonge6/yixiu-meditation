# 一休 GEO / SEO / ASO 运营规范

## 实测基线 · 2026-09-13

- Search Console：已选资源 https://yixiu.wonderelian.com/ 。3 个月视图为 3 点击、117 曝光、CTR 2.6%、平均排名 26.9；图表可用日期 2026-08-23 至 2026-09-10。查询包括 yixiu（1 点击 / 9 曝光）、best sleep sound（0 / 5）、best sounds to sleep to（0 / 4）、best noises for sleep（0 / 3）。这不是月搜索量，也不是完整市场排名。
- 索引概况：27 已索引、1 未索引；核心网页指标无数据。不得把无数据写成通过。已有 sitemap.xml 状态成功、上次读取 2026-09-11、发现 27 页。
- 公开 HTTP 审计：原 sitemap 35 页均可访问，robots 允许抓取。privacy.html 缺 canonical，本次补齐；双语政策页的两个语言 H1 保留。其他页面均有独立 title 和 canonical。此前 26 个 App schema 仍写 1.5，本次按中国/美国官方查询均已公开的 1.13 修正。
- 商店：App Store Connect 显示 1.13（26）可分发。当前名称、副标题和关键词锁定，推广文本允许单独编辑。现有名称与副标题已覆盖品牌、白噪音、睡眠、自然声、专注、呼吸，暂不改变已有定位。

## 每次发文

在每日 20:30 的既有 H5 精选名额（0–1 篇）内，同时考虑社媒、真实搜索问题和商店使用疑问，不另加一份 SEO 发文配额。选题需有独立用户价值。优先更新已有意图页或文章，只有缺少答案时才新增稳定 slug。每篇正文开头直接回答问题，说明操作范围、Free/Plus 和网页/App 区别；引用可见、日期真实、中英完整、CTA 可执行。没有相关内容则跳过。

数据源 src/data/quiet-journal.json 支持 guide 分类、seoTitle、metaDescription、sources。references 目前限官方一休域名和 App Store；如确有必要增加第三方研究来源，先核验原文并有针对性扩展验证范围。栏目不放 GEO、SEO、ASO 内部报告、关键词清单或伪装的用户评价。

每次构建生成双语页面、Article、canonical/hreflang、社交卡片、sitemap 和带标题/摘要的 llms 目录。schema 不能声称不可见或未验证事实。更新产品版本时同时检查根页、26 个既有 App schema、机器摘要与商店事实，避免再次失配。不要改动训练抓取政策，不把 llms 当作 Google 必需文件。

## 每周一 08:30 复盘

仍使用 style-atlas-analytics 原任务，不新增自动化。保留职责 A/C，社媒每日每平台两篇图文、隔日视频不变。

1. 读取最新完整的 Search Console 28 天及前 28 天查询/页面、索引、站点地图。数据量不足时记录事实，不用一两次曝光判断胜者。对已有曝光但点击弱的页面，优先改善标题与答案匹配。
2. GEO：检查产品事实和来源是否仍一致；如官方搜索后台提供独立生成式 AI 报告，原样记录，否则不推算 AI 曝光或引用。GA4 的已识别 AI 来源单独记录；直接访问不冒充 AI 引流。
3. ASO：核对中美公开版本与两种语言文案、真实免费范围、截屏一致性。可编辑推广文本按场景与价值优化。名称/副标题/关键词有实质改进时整理候选和字符校验；随下一次已授权版本提交，不为填字段创建虚构版本、移除在审版本或改构建。现有截图准确时不为凑数量造图。
4. 看 App Store 搜索曝光 → 产品页浏览 → 首次下载；H5 的访问 → 播放 → 下载点击分别统计。缺失指标用 null，下载点击不算已下载。推广文本服务于转化，不当作关键词排名字段。
5. 对实质新增/更新页面执行正常发布和生产验证，然后更新已有 sitemap；Google 提交受理、实际抓取、索引、AI 引用是不同状态。不要每天对未变化 URL 重复申请收录。
6. 在 yixiu-growth-ops-log.md 记录日期、来源、修改、公开链接、验收、阻碍与下一次实验；完成/失败或需要用户操作时通知，重复无变化检查保持安静。

## 依据

- Google AI features：https://developers.google.com/search/docs/appearance/ai-features 。正常 SEO 基础同样适用，不需要特殊 AI 标记或文件，也不保证收录。
- Google generative content：https://developers.google.com/search/docs/fundamentals/using-gen-ai-content 。AI 内容仍须为用户提供实际价值。
- Apple product page：https://developer.apple.com/app-store/product-page/ 。名称/副标题各 30 字符，关键词共 100 字符，推广文本 170 字符；推广文本不影响搜索排名。
- Apple version metadata：https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/ 。以具体版本状态和可编辑字段为准。
