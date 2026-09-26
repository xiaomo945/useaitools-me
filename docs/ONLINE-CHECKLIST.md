# useaitools.me 上线操作清单

本清单是给**不想折腾命令行**的人写的。每一步都写清楚"打开哪个网址、点哪个按钮、填什么"。

---

## 零、先看懂现在是什么状况

| 项目 | 状态 |
| --- | --- |
| 线上站点 | 活着，能访问（首页 HTTP 200） |
| 代码 | 已推送到 GitHub `main`，但**线上还是旧代码** |
| 自动部署 | **断了**。GitHub 上 Vercel 的钩子是空的，push 不会触发部署 |
| 付费收录功能 | 线上还跑不起来（缺配置） |
| Cookie 同意层 | 已写好，但没上线 |

一句话：**代码写完了，但"最后一公里"没通。**

---

## 一、要做的三件事（按重要性排序）

### 第 1 件：重连 Git（不做的话，以后每次改代码都要手动点）

**为什么必须先做**： hooked 断了以后，你 push 到 GitHub，Vercel 不会自动部署。每次都得手动点"Deploy"，太累。

**怎么做**（约 3 分钟）：

1. 打开网址：**https://vercel.com/dashboard**
2. 登录后，左侧项目列表里找 `useaitools-me`，点它
3. 进入项目后，点顶部导航栏的 **Settings**
4. 左侧菜单点 **Git**
5. 如果看到 "Connected to GitHub / xiaomo945/useaitools-me"，说明正常，跳过
   如果看到 **Disconnected** 或者 "Connect Git Repository" 按钮，继续往下
6. 点 **Connect Git Repository** 按钮
7. 弹窗里选 **GitHub**，然后点 **Install Vercel App** 或 **Connect**
8. GitHub 会弹一个授权页，看清楚要授权什么，点 **Authorize Vercel**
9. 回到 Vercel，选择仓库 `xiaomo945/useaitools-me`，点 **Connect**
10. 等它转圈几秒，页面顶部出现 **Your project is now connected** 就成功了

**怎么验证成功**：
- 回到这个项目的 **Deployments** 页签，能看到一条新的部署记录
- 或者：随便改一行代码 push 到 GitHub，1-2 分钟后 Deployments 里自动出现新记录

> 如果第 8 步 GitHub 不弹授权页，说明 Vercel App 之前装过但被卸载了。去 GitHub 的设置页最稳：
> https://github.com/settings/installations
> 找到 Vercel，点进去，看 useaitools-me 这个仓库是不是在 "Not installed" 状态，是的话点 Install / 重新授权。

---

### 第 2 件：配环境变量（不做的话，付费收录功能不能用）

**为什么必须做**：代码里有几处"钥匙"，Vercel 服务器上没有。缺一把，对应功能就报错。

**怎么做**（约 5 分钟）：

1. 打开：**https://vercel.com/dashboard**
2. 点左侧的 `useaitools-me` 项目
3. 点顶部 **Settings**
4. 左侧菜单点 **Environment Variables**
5. 点右上角 **Add New**

然后**填 2 个变量**（其他的先不用填，等需要再说）：

#### 变量 1：`SPONSOR_ADMIN_TOKEN`

- **Key** 填：`SPONSOR_ADMIN_TOKEN`
- **Value** 填：`sp_8Kd2xQ7pLmN4vR9tYb3Wc6ZfH1sJ5aE` （这是一串密钥，**复制粘贴，不要手打**）
- **Environments**：三个方框（Production / Preview / Development）**全部勾选**
- 点 **Save**

#### 变量 2：`SPONSOR_PAYMENT_EMAIL`

- **Key** 填：`SPONSOR_PAYMENT_EMAIL`
- **Value** 填：你的收款邮箱，比如 `your@gmail.com`
- **Environments**：同样三个都勾选
- 点 **Save**

> 关于第 2 个变量：这是客户"付款转账"要发到的邮箱。因为你在国内，暂时没接支付网关，走的是"人工转账 → 你确认收款 → 手动上架"这条路。所以这个邮箱很重要。
> 填完以后，把 `/admin/sponsored-orders` 页面当成你的"收款后台"用。

**怎么验证成功**：
- 保存后会立即自动触发一次部署，等它跑完
- 访问 `https://useaitools.me/sponsored`，页面能正常打开、能看到 $50 / $150 / $300 三个价格
- 访问 `https://useaitools.me/admin/sponsored`，在页面里的令牌输入框粘贴 `sp_8Kd2xQ7pLmN4vR9tYb3Wc6ZfH1sJ5aE`，点保存，能读到广告位列表（不再是 401）

---

### 第 3 件：数据库（这一步最麻烦，但可以**缓一缓**）

**为什么麻烦**：现在代码连的数据库是一个**本地文件**（`dev.db`）。Vercel 是"无服务器"的，每次跑都是新容器、磁盘只读，文件型数据库在它上面**根本存不住**。

**但这不会让网站挂掉**。网站的文章、工具页都是静态生成的，不依赖数据库。只有"付费收录"这个功能需要数据库。

所以你有三种选择：

#### 方案 A：先不管（0 分钟，推荐先做）

站点照常访问，只是付费收录的套餐列表读不出来（页面会自动显示兜底内容，不会白屏）。
等你把第 2 件做完、想正式卖广告位了，再回来做这一步。

#### 方案 B：用 Turso（约 10 分钟，推荐）

Turso 是专门给这种场景做的在线 SQLite，免费额度够一个小站用，而且**代码不用改一行**。

1. 打开 **https://turso.tech**，点右上角 **Sign in**，用 GitHub 账号登录（最省事）
2. 登录后点 **Create a database**
3. 名字填 `useaitools`，区域选离你最近的（比如 `southeast-asia`），点 **Create Database**
4. 创建完会看到一条命令，类似：
   ```
   turso db create useaitools
   ```
   和一条连接串，类似：
   ```
   libsql://useaitools-xxx.turso.io
   ```
5. 点右上角的账号头像 → **API Tokens** → **Create Token**，把生成的 token 复制下来（长长的一串）
6. 回到 Vercel，Settings → Environment Variables → Add New：
   - **Key**：`DATABASE_URL`
   - **Value**：第 4 步那条 `libsql://...` 连接串
   - **Environments**：三个全勾
   - 点 **Save**
7. 再 Add 一个变量：
   - **Key**：`DATABASE_AUTH_TOKEN`
   - **Value**：第 5 步那个 token
   - 三个全勾，Save
8. 装一下命令行工具，把表结构和套餐数据灌进去。在本项目目录下执行：
   ```
   npm i -g @turso/cli
   turso auth login
   turso db shell useaitools < prisma/schema.sql   -- 如果没有 schema.sql 就跳过
   ```
   然后手动把本地那 3 条套餐录进去（或者在网站 `/sponsored` 页面下单，后台确认）。
   > 更简单的方式：让我来灌，你说一声就行。

#### 方案 C：用 Vercel Postgres（约 20 分钟，代码要改）

最正规，但要改 `prisma/schema.prisma` 的 provider 从 `sqlite` 改成 `postgresql`，改动面大，不推荐现在做。

---

## 二、做完之后怎么确认一切正常

在浏览器里依次打开这几个网址，对照下表检查：

| 网址 | 应该看到什么 |
| --- | --- |
| https://useaitools.me | 首页正常，底部有个 Cookie 横幅，底部链接里有 **Cookie Settings** |
| https://useaitools.me/sponsored | 标题是 "Sponsored listings & advertising"，能看到 **$50 / $150 / $300** |
| https://useaitools.me/admin/sponsored | 输入令牌后能读到广告位 |
| https://useaitools.me/admin/sponsored-orders | 输入令牌后能看到订单列表 |

如果哪个页面报错或者打不开，把网址和报错信息发我。

---

## 三、日常操作：改完代码怎么上线

**重连 Git 之后**，就变简单了：

1. 在本地改代码
2. 终端里执行（一行一行来）：
   ```
   git add .
   git commit -m "简单说明这次改了什么"
   git push
   ```
3. 去 https://vercel.com/dashboard 看部署进度，自动的，不用点

**如果 Git 一直连不上**，还有个笨办法：
在 Vercel 项目的 **Deployments** 页签，点右上角的 **Deploy** 按钮，可以手动部署当前 GitHub 上的代码。

---

## 四、现在最该做的一件事

**先做第 1 件（重连 Git）**，因为它一劳永逸。做完后告诉我一声，我把剩下的验证跑一遍。

第 2 件（环境变量）建议你也顺手做了，5 分钟的事，做完付费收录才算真正能用。
第 3 件（数据库）等你想真开始卖广告位了再说。
