# 📦 智能素材自动备份规则

## 🤖 触发条件（自然语言识别）
当用户在对话中包含以下任意关键词或短句时，自动触发备份流程：
- "下机"、"关机"、"下机了"、"走了"、"要走了"
- "备份"、"保存"、"存一下"、"备份素材"
- "保存今天的"、"存档"、"收工"、"今天结束了"
- "备份当前状态"

## 📁 备份来源
项目根目录下的 `.tmp` 文件夹。

## 🗂️ 备份目标
私有仓库 `devlog-private`，按照以下结构存放：
devlog-private/
└── assets/
    ├── logo/ # Logo相关图片
    ├── screenshots/ # 网页截图
    ├── affiliates/ # 联盟申请相关
    ├── submissions/ # 导航站提交截图
    ├── configs/ # 配置文件、环境变量
    └── others/ # 无法归类的素材

## ⚙️ 自动执行流程
1. **扫描**：检查 `.tmp` 文件夹下是否有文件。
2. **分类**：
   - 文件名包含 `logo`、`favicon`、`icon` → 存入 `assets/logo/`
   - 文件名包含 `screenshot`、`截图`、`screen`、`snip` → 存入 `assets/screenshots/`
   - 文件名包含 `affiliate`、`联盟`、`commission` → 存入 `assets/affiliates/`
   - 文件名包含 `submit`、`提交`、`launch`、`navigation` → 存入 `assets/submissions/`
   - 文件名包含 `config`、`env`、`dns`、`var` → 存入 `assets/configs/`
   - 其他无法归类的 → 存入 `assets/others/`
3. **重命名**：为防止重名，在每个文件名前加上时间戳（格式：`YYYY-MM-DD_`）。
4. **迁移提交**：
   - 将文件复制到 `devlog-private` 仓库的对应目录。
   - 执行 `git add . && git commit -m "备份：[日期] 素材归档" && git push origin main`。
5. **清理**：删除 `.tmp` 文件夹内的所有文件（保留 `README.md`）。
6. **反馈**：用简单的一句话告知用户："已备份 X 个文件到私有仓库，`.tmp` 已清空。"

## ⚠️ 重要原则
- **隐私第一**：所有备份存入 `devlog-private`，绝不可误传到公开仓库。
- **自动完成**：无需用户二次确认，触发后直接执行全部流程。
- **健壮性**：如果 `.tmp` 为空，则回复"`.tmp` 为空，无需备份。"。
