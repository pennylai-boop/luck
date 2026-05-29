/**
 * 開發伺服器啟動腳本
 * 專案若在網路磁碟 (P:)，將 .next 連到本機暫存，避免 EPERM。
 */
import { spawn } from "child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  rmSync,
  symlinkSync,
} from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import os from "os";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const legacyNext = join(root, ".next");
const localCache = join(os.tmpdir(), "bni-lucky-draw-next");

process.chdir(root);
process.env.NEXT_TRACE_UPLOAD_DISABLED = "1";

mkdirSync(localCache, { recursive: true });

function removeNextPath() {
  if (!existsSync(legacyNext)) return;
  try {
    const stat = lstatSync(legacyNext);
    if (stat.isSymbolicLink()) {
      rmSync(legacyNext);
    } else {
      rmSync(legacyNext, { recursive: true, force: true });
    }
  } catch {
    console.warn(
      "無法刪除 .next（可能被其他程式鎖定）。請關閉所有 npm run dev 視窗後再試。"
    );
  }
}

function linkNextToLocalCache() {
  removeNextPath();
  try {
    if (process.platform === "win32") {
      symlinkSync(localCache, legacyNext, "junction");
    } else {
      symlinkSync(localCache, legacyNext, "dir");
    }
    console.log(`已將 .next 連至本機快取：${localCache}`);
  } catch {
    console.warn(
      "無法建立 .next 連結；若出現 EPERM，請執行 scripts\\dev.cmd 或將專案複製到本機磁碟 (C:)。"
    );
  }
}

linkNextToLocalCache();

const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "dev"], {
  stdio: "inherit",
  env: process.env,
  cwd: root,
});

child.on("exit", (code) => process.exit(code ?? 0));
