# 系統評估與技術建議

## 1. 總體評估

本系統屬於**低複雜度、高現場感**的單頁互動應用：無帳號、無資料庫、無 API。技術風險主要集中在**轉盤動畫與得獎邏輯一致**、**大量名單時的可讀性**，以及**投影環境下的效能**。以 Next.js 靜態匯出 + 純 Client Component 足以滿足需求，無需引入後端。

| 維度 | 評分（1–5） | 說明 |
|------|-------------|------|
| 開發成本 | 5 | 功能邊界清晰，1–2 人日可完成 MVP |
| 維運成本 | 5 | 靜態檔部署，無伺服器維護 |
| 擴充性 | 3 | 不加後端則難以做跨裝置同步紀錄 |
| 現場適用 | 5 | 大按鈕、轉盤、煙火符合例會氛圍 |
| 資料安全 | 4 | 資料不落盤；需注意勿上傳敏感個資截圖 |

---

## 2. 架構建議

### 2.1 前端框架

**建議：Next.js 15 + App Router + TypeScript**

- 主頁面使用 `'use client'` 承載全部互動狀態。
- `next.config.ts` 設定 `output: 'export'` 產生靜態 HTML，符合「無後端」。
- 不使用 Server Actions、Route Handlers、資料庫。

### 2.2 狀態管理

**建議：React `useState` + `useCallback`**

- 狀態量小（名單、得獎集合、旋轉旗標、項目圖片 data URL）。
- 刻意**不**使用 localStorage，以符合「關閉即重置」。
- 若邏輯再長，可抽 `useLottery` hook，仍不必上 Zustand。

### 2.3 圖片處理

```
使用者選檔 → FileReader.readAsDataURL → 存入 state
```

- 限制 `accept="image/*"` 與檔案大小（建議 ≤ 2MB）。
- data URL 僅存於記憶體，關分頁即釋放。
- 不建議在例會現場上傳過高解析度圖，以免低階平板記憶體不足。

### 2.4 轉盤演算法（關鍵）

**原則：先決定得獎者，再計算停止角度。**

1. 候選列表 = `名單.filter(未在 wonIds)`。
2. 若候選為空 → 中止。
3. `winnerIndex = random(0, candidates.length - 1)`。
4. 每扇區角度 = `360 / n`；目標角 = 使第 `winnerIndex` 扇區中心對準指針（通常指針在頂部 12 點鐘方向）。
5. 加上多圈旋轉（例如 5–8 圈）與 `cubic-bezier` 減速動畫，總時長約 4–6 秒。

**重複名稱：** 每筆名單賦予 `id: \`${index}-${label}\``，得獎紀錄存 `id` 而非純文字。

### 2.5 慶祝效果

| 效果 | 方案 | 備註 |
|------|------|------|
| 煙火 | `canvas-confetti` | 輕量、無依賴後端 |
| 音效 | HTML5 `<audio>` + 使用者開關 | 遵守 autoplay 政策，首次需使用者手勢 |

---

## 3. 依賴建議

### 建議引入

- `next`, `react`, `react-dom`, `typescript`
- `tailwindcss`
- `canvas-confetti`
- `@types/canvas-confetti`（dev）

### 可選

- `clsx` + `tailwind-merge`：合併 className

### 不建議引入

- 後端框架、ORM、Auth
- 重型動畫庫（整包 GSAP 僅為轉盤略重）
- localStorage 持久化套件（與需求衝突）

---

## 4. 風險與緩解

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| 關閉分頁資料消失 | 中 | UI 明確提示；Later：複製得獎清單 |
| 轉盤視覺與邏輯不一致 | 高 | 先選 index 再算角度；單元測試 `wheelMath` |
| 名單過多（>50） | 中 | 扇區字體縮小；考慮僅顯示縮寫 |
| BNI 商標使用 | 低（法律） | 初版用風格色；正式素材待授權 |
| 投影解析度過低 | 低 | `clamp()` 字級、高對比配色 |
| 無網路 | 低 | 靜態站離線可用；贊助連結需網路 |
| 瀏覽器不支援 Web Audio | 低 | 音效失敗不阻斷流程 |

---

## 5. 部署建議

| 方式 | 適用 |
|------|------|
| `npm run build` → `out/` | GitHub Pages、S3、Nginx 靜態 |
| `npm run dev` | 開發與例會前彩排 |
| Vercel（可選） | 若未來改為非 export 模式 |

內網例會可將 `out/` 放於區網 HTTP 伺服器，無需對外網開放。

---

## 6. 效能建議

- 轉盤使用 CSS `transform: rotate()` + `transition`，GPU 加速。
- confetti 在 Modal 開啟時觸發一次，避免連續大量粒子。
- 圖片以 `object-fit: contain` 限制左側面板尺寸。

---

## 7. 測試策略

| 類型 | 內容 |
|------|------|
| 手動 | 3 人連抽、第 4 次不可抽、旋轉中連點、重整清空 |
| 單元（建議） | `parseLines`、`computeStopRotation` |
| 視覺 | 手機直橫屏、1920×1080 投影 |

---

## 8. 結論

以 **Next.js 靜態匯出 + 客戶端狀態 + canvas-confetti** 為最佳平衡：開發快、部署簡、符合 BNI 例會「開網頁就抽、關網頁就清」的使用習慣。後續若需「得獎紀錄留存」，應另開產品決策（例如僅匯出 CSV，仍不建後端），避免與現有「不儲存」原則衝突。
