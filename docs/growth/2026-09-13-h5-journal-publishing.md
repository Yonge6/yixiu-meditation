# 一休日常 H5 内容同步

用户 2026-09-13 授权：有合适内容同步 H5，放到抽屉里增加栏目。入口为首页书页按钮和「我的 → 一休日常」，均打开阅读抽屉。独立栏目为 /journal/（英文）与 /journal/zh/（中文）；每篇使用同一个稳定 slug 的对应语言路径。

## 编辑标准

每天晚间社媒批次检查两组内容，挑选 0–1 篇适合长期保留的文章。没有合适内容可以跳过 H5，不能为填满栏目机械搬运或重复改写。H5 不抵扣每天各平台两篇图文或隔日视频。

适合：具体生活时刻、真实操作说明、声音选择方法、回答真实产品问题。每篇应有独立阅读价值、两段以上完整内容、事实核验的试听/练习入口、已授权图片。英中文都必须完整自然，不能用英文填中文槽位。不收录空泛励志句、时效性促销、无依据效果承诺或没有可用目标的广告。

数据源为 yixiu-prototype/src/data/quiet-journal.json。每条含稳定 slug、真实 date、category、scene、action、image 及实际宽高、sourceContentIds，以及 zh/en 的 title、summary、category、readTime、cta、sections。更新既有文章沿用 slug，保持原发表日期；实质修订需要另外记录更新日期，不能每天伪装新文章。新文章放到数据列表前部。

如来源于已发布社媒，在运营日志中记录真实平台永久 URL、content_id 与 H5 URL 的映射；尚未公开的稿件不伪称来源帖已发布。

## 发布步骤

1. 读取远程 main、线上栏目与运营日志确认不重复，隔离工作区并保留其他修改。不要在较旧主 checkout 直接整体覆盖生产。
2. 编辑 JSON 并核验当前 Free/Plus、场景名称和图片/录音许可。文章里的自有体验必须在当前 H5 可执行，不用文章入口绕过会员。
3. 在 yixiu-prototype 执行 npm run build:journal，生成双语索引和正文、sitemap.xml 与 llms.txt。脚本只维护带 quiet-journal 标记的索引区段。
4. 执行 npm run build、npm run test:sites、npm run test:journal，检查生成前后无重复 URL、链接与版权事实。新界面行为变化时运行相关回归测试。
5. 检查抽屉能读到新文章、切换分类/返回/关闭正常、阅读不中断原声音；两种独立正文页面均能通过 CTA 进入正确语言和场景。只有必要代码或内容发生变化才构建和部署。
6. 提交本次相关文件并合并，按已有 scripts/deploy-production-nginx.sh 使用固定 release 与 SHA-256、备份、nginx 检查发布到阿里云一休目录。不要修改其他网站、域名、账号或价格。
7. 回读正式域名的索引、双语正文、图片、canonical/hreflang、CTA 和抽屉内容。公开地址含正文且 UI 验收后才记 published_verified；文件生成、CI 完成或部署命令返回不能单独当作公开验收。
8. 追加既有 yixiu-growth-ops-log.md：H5 选稿结果、来源内容 ID、文章 slug、双语公开 URL、部署/回滚位置、验收和真实效果数据。缺失数据为 null。

无需为了 H5 同步新增独立自动化。把这一流程纳入 style-atlas-analytics 原职责 B 的晚间批次，保持其社媒频次、职责 A/C、目标任务和通知偏好。
