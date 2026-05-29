# GCP 部署說明（專案 `lucky-497805`）

## 線上網址

https://lucky-draw-u5bq4dbqdq-de.a.run.app

## 架構

- **GCP 專案**：`lucky-497805`
- **區域**：`asia-east1`（台灣近端）
- **服務**：Cloud Run `lucky-draw`
- **建置**：Cloud Build + Nginx 靜態站（`out/`）

## 一鍵部署

```bash
npm run deploy
```

流程：本機 `npm run build` → 上傳 `out/` → Cloud Build 建 Docker → 部署 Cloud Run

## 環境變數

`.env.production`：

```env
NEXT_PUBLIC_SITE_URL=https://lucky-draw-u5bq4dbqdq-de.a.run.app
```

## 自訂網域（選用）

```bash
gcloud run domain-mappings create --service lucky-draw --domain 你的網域 --region asia-east1 --project lucky-497805
```

並在 DNS 依 GCP 指示設定 CNAME。

## Firebase Hosting（備選）

若已將 GCP 專案連結 Firebase，可使用：

```bash
firebase login
firebase deploy --only hosting --project lucky-497805
```

目前正式環境使用 **Cloud Run**。
