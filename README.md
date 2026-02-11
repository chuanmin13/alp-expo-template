# ALP Expo Template

本專案為公司內部 React Native Bare Workflow 轉移至 Expo 的初始專案模板

[expo](https://docs.expo.dev/)

## 功能與套件
本專案包含開發所需的基本功能套件及設定：
- **核心架構**: Expo, React Native, React
- **導航**: React Navigation
- **狀態管理**: Redux
- **工具庫**: Moment.js, i18next
- **推播通知**: Firebase Cloud Messaging
- **熱更新**: Revopush
- **錯誤追蹤**: Bugsnag
- **代碼規範與工具**: Babel, ESLint, Husky

## 主要架構與版本
- **Expo**: v54
- **React Native**: v0.81
- **React**: v19

## 專案需求
- **Node**: v20
- **Java**: 17
  
參考連結: https://docs.expo.dev/versions/latest/


## 使用步驟

### 1. Clone 專案
   
   將專案 clone 到本地：
   ```bash
   git clone <repository-url>
   ```

### 2. 安裝依賴
   ```bash
   npm install
   ```

### 3. 設定專案資訊
   
   - 修改 `package.json` 中的 `name`
   - 更新 `scripts` 中的 `push` 指令（請至 Revopush 網頁複製相對應的指令）

### 4. 設定 App 資訊
   
   修改 `app.json` 以符合所需的 App 名稱、雙平台版號及唯一識別碼：
   - `name`: App 顯示名稱
   - `slug`: Expo 專案識別名稱 (需與 name 對應)
   - `version`: App 版號 (例如: 1.0)
   - `scheme`: App Deep Link Scheme (建議全小寫)
   - `ios.bundleIdentifier`: iOS 唯一識別碼 (例如: com.company.appname)
   - `android.package`: Android 唯一識別碼 (例如: com.company.appname)
   - `ios.buildNumber` / `android.versionCode`: 版本號

### 5. 更換資源檔案
   
   - 替換 `assets/images` 中的圖片資源為新專案的圖示與啟動畫面
   - 從原始專案複製 `GoogleService-Info.plist` (iOS) 與 `google-services.json` (Android) 至專案根目錄

### 6. 設定環境變數
   
   複製 `.env.local.example` 為 `.env.local`，並填入相關金鑰（如 Bugsnag API Key, CodePush Key 等）：
   ```bash
   cp .env.local.example .env.local
   ```

### 7. 啟動測試
   
   確認專案可以正常啟動
   ```bash
   npm run ios
   # 或
   npm run android
   ```
   
   這些指令會啟動測試環境（等同於執行 `npx expo run:ios` / `npx expo run:android`）

   更多本地測試資訊可參考 [Local App Overview](https://docs.expo.dev/guides/local-app-overview/)


### 8. 移植程式碼
   - 將原有 App 的 `src` 資料夾移植過來
   - 將其他所需套件加入 `package.json`

### 9. 最終測試與調整

   執行 `npm install` 安裝新加入的套件，啟動專案進行測試並做相對應的調整與更新


## 常用指令

- **`npm run lint`**
  
  執行 ESLint 程式碼檢查，確保代碼風格一致

- **`npx expo prebuild --clean`**
  
  清除 Android/iOS 原生專案資料夾並重新生成，當遇到原生模組連結錯誤或設定未生效時，可使用此指令重置

  參考資料: [Continuous Native Generation (CNG)](https://docs.expo.dev/workflow/continuous-native-generation/)
