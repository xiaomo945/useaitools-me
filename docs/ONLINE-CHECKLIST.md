# useaitools.me 上线操作清单

本清单是给**不想折腾命令行**的人写的。每一步都写清楚"打开哪个网址、点哪个按钮、填什么"。

---

## 零、现在是什么状况

| 项目 | 状态 |
| --- | --- |
| 线上站点 | 活着，能访问 |
| 代码 | 已推送到 GitHub `main`（最新 `417410c`） |
| 线上版本 | **已是新版**。新版销售页标题、Cookie 同意层都在线上生效了 |
| Git 连接 | **正常**，仓库 `xiaomo945/useaitools-me` 已连接 |
| 付费收录功能 | **不能用**。线上数据库读出来是空数组，订单存不下来 |

一句话：**代码上线了，但"收钱那条路"还堵着。**

### 为什么代码上线了，还要看这份清单

线上确实已经是新版代码。但有一件事没配：

```
https://useaitools.me/api/sponsored-packages
→ {"success":true,"packages":[]}
```

接口是通的，但**数据是空的**。页面上显示的 `$50 / $150 / $300` 是代码里写死的兜底内容，不是真数据。真实后果是：

- 客户在 `/sponsored` 下单，订单**存不进数据库**，你的 `/admin/sponsored-orders` 里看不到
- `/admin/sponsored` 的广告位管理也是空的

也就是说，**广告位卖不出去**。这不是"缓一缓"的事。

---

## 一、要做的两件事

### 第 1 件：配环境变量（不做的话，管理后台打不开）

**为什么必须做**：代码里有几处"钥匙"，Vercel 服务器上没有。缺一把，对应功能就报错。

**怎么做**（约 5 分钟）：

1. 打开：**https://vercel.com/xiaomo945/useaitools-me-9tcz**（进项目页）
2. 点顶部 **Settings**
3. 左侧菜单点 **Environment Variables**
4. 点右上角 **Add New**

先说**两个下拉框怎么选**（这是最容易填错的地方）：

- **类型（Type）**：下拉框，两个选项
  - **秘密（Sensitive）** = 保存后看不到值，只有有权限的成员能看
  - **配置（Plain）** = 谁都能看
- **环境（Environments）**：下面一排方框，** Production / Preview / Development 三个必须全部勾上**。
  只勾 Production 的后果：以后每次 git push 生成的预览版都是坏的（管理接口一律 401），上线前没法测试。
  数量不用担心，Hobby 计划离上限还很远。

然后**填 2 个必须的变量**（还有一个可选的，见后面）：

#### 变量 1：`SPONSOR_ADMIN_TOKEN`

- **Key** 填：`SPONSOR_ADMIN_TOKEN`
- **Value** 填：`sp_8Kd2xQ7pLmN4vR9tYb3Wc6ZfH1sJ5aE`（这是一串密钥，**复制粘贴，不要手打**）
- **类型**：选 **秘密**
- **Environments**：三个方框（Production / Preview / Development）**全部勾选**
- 点 **Save**

> ⚠️ 因为选了「秘密」，保存以后点开只显示一排 `•`，**再也看不到原值**。所以点 Save 之前，最后看一眼 Value 是不是上面那串完整的。填错了只能删掉重加。

#### 变量 2：`SPONSOR_PAYMENT_EMAIL`

- **Key** 填：`SPONSOR_PAYMENT_EMAIL`
- **Value** 填：你的收款邮箱，比如 `your@gmail.com`
- **类型**：选 **配置**
- **Environments**：同样三个都勾选
- 点 **Save**

> 为什么这个选「配置」而不是「秘密」：这个值是要**显示在页面上**给客户看的（生成 `mailto:` 地址），本身就是公开信息，藏起来没有意义。
> 这是客户"付款转账"要发到的邮箱。因为暂时没接支付网关，走的是"人工转账 → 你确认收款 → 手动上架"这条路。填完以后，把 `/admin/sponsored-orders` 页面当成你的"收款后台"用。

#### 变量 3（可选）：`SPONSOR_PAYMENT_URL`

- **Key** 填：`SPONSOR_PAYMENT_URL`
- **Value** 填：一个收款页链接，比如 Ko-fi / PayPal / Polar 的页面地址
- **类型**：选 **配置**
- **Environments**：三个都勾选

> 这个**不填也能跑**——不填的话，页面上给客户显示的就是"直接发邮件到上面的收款邮箱"。
> 填了的话，页面上就变成一个"去付款页"的按钮，客户点一下就能付，你少收一封邮件。等你回头去 Ko-fi / PayPal 建好收款页，随时可以回来加。

### ⚠️ 保存完还差最后一步：重新部署

**环境变量填完不会自动作用到线上。** 已存在的旧部署还是用旧配置，必须触发一次新的部署才会生效：

- 最省事：跟我说一声，我推一个空提交，Vercel 会自动重新构建
- 或者：Vercel 项目页 → **Deployments** → 找到最新那条 → 点右边的 **⋯** → **Redeploy**

部署**完成**以后（一定要注意看状态变成 Ready，不是 Building），再做下面的验证。

> 关于第 2 个变量：这是客户"付款转账"要发到的邮箱。因为你在国内，暂时没接支付网关，走的是"人工转账 → 你确认收款 → 手动上架"这条路。所以这个邮箱很重要。
> 填完以后，把 `/admin/sponsored-orders` 页面当成你的"收款后台"用。

**怎么验证**（做完第 1 件后告诉我，我来测，你不用自己敲命令）：

- **带令牌请求** → 期望返回 `200` 和一个空的广告位列表
  ```json
  {"slots":[],"success":true}
  ```
- **不带令牌请求** → 期望返回 `401`

> 注意这里有个"看着像成功其实是失败"的陷阱：**如果环境变量压根没配上，不带令牌也是 401**。
> 因为代码第 15 行写的是 `if (!token) return false` —— 没配令牌时它同样拒绝一切请求（fail-closed 是对的，但让你没法区分）。
> 所以**只有"带令牌返回 200"这一条才算真的配对了**。如果你已经重新部署完了，直接把这句话发我：「配好了」，我来验。

---

### 第 2 件：换掉本地数据库（不做的话，广告位卖不出去）

**为什么必须做**：现在代码连的数据库是一个**本地文件**（`dev.db`）。Vercel 是无服务器的，每次跑都是新容器、磁盘只读，文件型数据库在它上面**根本存不住**，所以线上读出来永远是空的。

**解决办法**：换一个在线数据库。推荐 **Turso** —— 它给的就是在线版 SQLite，而且**代码一行都不用改**，因为项目里已经接好了。

**怎么做**（约 10 分钟）：

1. 打开 **https://turso.tech**，点右上角 **Sign in**，用 GitHub 账号登录（最省事）
2. 登录后点 **Create a database**
3. 名字填 `useaitools`，区域选离你最近的（比如 `southeast-asia`），点 **Create Database**
4. 创建完会看到一条连接串，形如：
   ```
   libsql://useaitools-xxx.turso.io
   ```
   把它复制下来
5. 点右上角账号头像 → **API Tokens** → **Create Token**，复制生成的那串 token（很长，注意别漏字符）
6. 回到 Vercel（**https://vercel.com/xiaomo945/useaitools-me-9tcz**），Settings → Environment Variables → Add New：
   - **Key**：`DATABASE_URL`
   - **Value**：第 4 步那条 `libsql://...` 连接串
   - **Environments**：三个全勾
   - 点 **Save**
7. 再 Add 一个变量：
   - **Key**：`DATABASE_AUTH_TOKEN`
   - **Value**：第 5 步那个 token
   - 三个全勾，Save
8. **把表和数据灌进云端库**。在项目目录下执行两条命令：
   ```
   npx prisma db push
   npm run db:seed
   ```
   这两条命令会自动使用刚才配的 `DATABASE_URL`，灌的是 Turso 上的库，不是本地文件。

   > 如果第 8 步报错，最常见的原因是 token 复制少了字符。Turso 的 token 很长，建议整段复制。报错了把内容发我。

**怎么验证**：
- 打开 `https://useaitools.me/api/sponsored-packages`，返回内容里应该能看到真实的三个套餐（Essential / Featured / Enterprise），不再是 `[]`

> 不推荐用 Vercel Postgres：那要改 `prisma/schema.prisma` 的 provider，改动面大。Turso 省事得多。

---

## 关于页面上出现的 "Origin 团队"

如果你在 Vercel 的 Git 设置页看到 "联系 Origin 团队" 这类字样，不用管它，它通常只是一句提示，不是让你点的按钮。

Vercel 项目可以挂在个人账号下，也可以挂在团队下。你现在的操作全部在 **xiaomo945 个人账号**下，按个人账号来就好 —— 免费版本来就不适合团队管理，团队会带来额外的权限审批环节。

---

## 二、做完之后怎么确认一切正常

在浏览器里依次打开这几个网址，对照下表检查：

| 网址 | 应该看到什么 |
| --- | --- |
| https://useaitools.me | 首页正常，底部有个 Cookie 横幅，底部链接里有 **Cookie Settings** |
| https://useaitools.me/sponsored | 标题是 "Sponsored listings & advertising"，能看到 **$50 / $150 / $300** |
| https://useaitools.me/api/sponsored-packages | 返回内容里能看到 **Essential / Featured / Enterprise**，不是 `[]` |
| https://useaitools.me/admin/sponsored | 输入令牌后能读到广告位 |
| https://useaitools.me/admin/sponsored-orders | 输入令牌后能看到订单列表 |

如果哪个页面报错或者打不开，把网址和报错信息发我。

---

## 三、日常操作：改完代码怎么上线

Git 是通的，所以：

1. 在本地改代码
2. 终端里执行（一行一行来）：
   ```
   git add .
   git commit -m "简单说明这次改了什么"
   git push
   ```
3. 打开 **https://vercel.com/xiaomo945/useaitools-me-9tcz** 看部署进度，自动的，不用点

---

## 四、顺带说一句：别访问 vercel.com/dashboard

这个网址**已经不存在了**，打开会显示 404（"Page not found"）。

新版的正确入口是这个格式：

```
https://vercel.com/你的用户名/你的项目名
```

你这个站具体就是：

```
https://vercel.com/xiaomo945/useaitools-me-9tcz
```

记住这个，以后都从这里进。
