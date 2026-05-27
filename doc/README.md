# BNI 商務例會抽獎系統（Lucky Draw）

專為 BNI（Business Network International）商務例會設計的**現場抽獎轉盤**網頁應用。主持人可在投影或大螢幕上操作：左側展示目前抽獎項目（圖片 + 標題），右側大轉盤從名單中抽出得獎者，並以彈窗與煙火效果慶祝。

## 適用場景

- 例會現場抽獎、摸彩、點名趣味活動
- 無需後端、無需登入，開啟瀏覽器即可使用
- **關閉分頁後所有資料重置**，適合單次例會、不保留歷史紀錄

## 技術棧

| 項目 | 說明 |
|------|------|
| 框架 | Next.js 15（App Router） |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS |
| 部署 | 靜態匯出（`output: 'export'`），可放 GitHub Pages 或內網靜態主機 |
| 後端 | **無** — 純前端，狀態僅存於記憶體 |

## 快速開始

```bash
npm install
npm run dev
```

瀏覽器開啟 [http://localhost:3000](http://localhost:3000)。

### 建置靜態站

```bash
npm run build
```

輸出目錄為 `out/`，可上傳至任意靜態主機。

## 文件索引

| 文件 | 說明 |
|------|------|
| [REQUIREMENTS.md](./REQUIREMENTS.md) | 功能與非功能需求、邊界條件 |
| [FEATURES.md](./FEATURES.md) | 功能分級、操作流程 |
| [SYSTEM_EVALUATION.md](./SYSTEM_EVALUATION.md) | 架構評估、技術選型、風險與建議 |
| [UI_SPEC.md](./UI_SPEC.md) | 初版視覺規格（BNI 紅主題） |

## 授權與贊助

頁尾提供「請我喝杯咖啡」外連贊助（連結見 `components/SponsorFooter.tsx`，可替換為您的 Ko-fi / Buy Me a Coffee 網址）。

## 注意事項

- 本專案初版使用 BNI 風格紅色，正式 Logo 與品牌規範請依您提供的設計圖後續替換。
- 資料不寫入 localStorage；重新整理或關閉分頁即清空。
