# 模型星图 · Model Atlas

1943–2026 年 AI 模型发布档案馆。单文件静态站点（HTML / CSS / 原生 JS，无外部依赖，图标全部内联）。

**在线地址：** https://citynanflower.github.io/model-atlas/

## 收录口径

- 共 **621 条**代表性模型与里程碑，覆盖 11 个领域：起源·里程碑、语言大模型、多模态理解、图像生成、视频生成、语音与音乐、代码模型、科学智能、3D 生成、世界模型。
- **60 家**机构 / 厂商：OpenAI、Anthropic、Google DeepMind、Meta、xAI、Microsoft、Amazon、NVIDIA、Mistral、DeepSeek、阿里通义、字节 Seed、智谱、月之暗面、MiniMax、腾讯混元、百度文心、华为盘古、Cursor、Tripo、World Labs 等。
- 只收「独立公开发布」：同代多尺寸合并为一条；量化、微调与 API 快照不单列。
- 发布日期优先取官方公告 / 论文 / 模型文档；只能确认到月或年的记录保留月 / 年级精度，不做日级推测。
- 开放程度按发布时的公开许可归纳：`开源`（Apache-2.0 / MIT 等）、`开放权重`（可下载但附条款）、`闭源`（仅 API / 产品）、`未注明`。
- 「✓ 已核验」＝构建期对照过官方公告、论文或权威百科；「未核验」仅作编年参考。

**数据截至 2026-11-26。** 静态档案、非实时；发布后新版本需重新构建。

## 目录

```
build.py          # 构建脚本：src/* → 单文件 index.html
src/
  shell.html      # 页面骨架（含 __CSS__ / __ICONS__ / __META__ / __DATA__ / __APP__ 占位符）
  styles.css      # 全部样式（亮 / 暗双主题）
  icons.js        # 92 个内联 SVG 品牌 / 产品图标（CUSTOM_ICONS + ICONIFY_ICONS）
  meta.js         # 领域、开放程度、60 家厂商字典
  data-*.js       # 621 条记录，按领域分文件
  app.js          # 交互：搜索、筛选、年度柱图、三种视图、详情弹窗、收藏
index.html        # 构建产物（直接部署这一个文件即可）
```

## 构建

```bash
python build.py
```

无第三方依赖，仅需 Python 3 与标准库。

## 部署

`index.html` 为完全自包含的单文件，放到任意静态托管根目录即可（本仓库使用 GitHub Pages：`main` 分支根目录）。

## 说明

- 商标与模型标识归各自权利人所有；部分图标为简化绘制或官方单色路径，仅用于识别。
- 数据来自各厂商官方发布记录、模型文档与权威百科；纠错与补档请提交 issue。
