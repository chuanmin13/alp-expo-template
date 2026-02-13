# ALP Expo Template

本專案為公司內部 React Native Bare Workflow 轉移至 Expo 的初始專案模板

參考文件：[Expo Docs](https://docs.expo.dev/)

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
  
參考文件：[Expo Reference](https://docs.expo.dev/versions/latest/)


## 使用步驟

### 1. 以模板建立新專案
   
   ```bash
   npx create-expo-app appName --template <repository-url>

   # 如果沒有自動執行，需手動安裝依賴
   npm install
   ```

### 2. 初始化調整
   - 移除 `package.json` 中的 `files` 欄位：該欄位僅用於 Template 下載完整性，新專案不需要
   - Husky 設定

### 3. 設定專案資訊
   
   - 修改 `package.json` 中的 `name` (與原專案相同)
   - 更新 `scripts` 中的 `push` 指令（請至 [Revopush](https://app.revopush.org/applications) 複製相對應的指令）

### 4. 設定 App 資訊
   
   修改 `app.json` 以符合所需的 App 名稱、雙平台版號及唯一識別碼：
   - `name`: App 顯示名稱
   - `slug`: Expo 專案識別名稱 (原專案的 app.json `name`)
   - `version`: App 版號 (例如: 1.0)
   - `scheme`: App Deep Link Scheme (建議全小寫，可與 `slug` 相同)
   - `ios.bundleIdentifier`: iOS 唯一識別碼 (例如: com.company.appname)
   - `android.package`: Android 唯一識別碼 (例如: com.company.appname)
   - `ios.buildNumber` / `android.versionCode`: 版本號

### 5. 更換資源檔案
   
   - 替換 `assets/images` 中的圖片資源為新專案的圖示與啟動畫面
     - 顯示有問題的話可以用 [Expo Icon Generator](https://expo-assets-generator.vercel.app/) 產出不同尺寸測試
   - 若有使用 firebase，從原始專案複製 `GoogleService-Info.plist` (iOS) 與 `google-services.json` (Android) 至專案根目錄
   - 若無使用 firebase 要移除相關套件、app.json 相關設定

### 6. 設定環境變數
   
   複製 `.env.local.example` 為 `.env.local`，並填入相關金鑰（如 Bugsnag API Key, CodePush Key 等）：
   ```bash
   cp .env.local.example .env.local
   ```

### 7. 啟動測試
   
   **Hello world! alp-expo-template**
   ```bash
   npm run ios
   # 或
   npm run android
   ```
   
   這些指令會啟動測試環境 (等同於執行 `npx expo run:ios` / `npx expo run:android`)

   更多本地測試資訊可參考：[Create a debug build locally](https://docs.expo.dev/guides/local-app-development/)


### 8. 移植程式碼回原始專案 repo
   - 原始專案開新分支
   - 移除原始專案中的以下檔案/資料夾
     - ios
     - android
     - metro.config.js
     - package.lock.json
     - node_module
   - 將 expo 專案的以下檔案移植/取代原始專案中的
     - tsconfig.json
     - package.json
     - index.js
     - App.js
     - app.json
     - app.config.js
     - eslint.config.json
     - babel.config.js
     - plugins
     - languages
     - assets
     - .gitignore
     - .husky
     - .env.local
     - .env.local.example

   - 檢視原始專案舊版 `package.json` ，安裝專案所需套件
   - 清理非必要套件

### 9. 最終測試與調整

   執行 `npm install` 安裝新加入的套件，啟動專案進行測試並做相對應的調整與更新

   **本次有做的調整: (新寫法可參考 omegaapp)**
   - 移除 `native-base` 套件：Spinner 改用 `ActivityIndicator`，Divider 寫客製共用元件
   - `react-native-code-push` to `@revopush/react-native-code-push`
   - `@bugsnag/react-native` to `@bugsnag/expo`
   - `react-native-device-info` to `expo-device` + `expo-application`
   - `react-native-localize` to `expo-localization`

### 10. 更新 README
更新原始專案的 README 以符合新架構

### 11. Git 相關
**移除對原生資料夾的追蹤，確保.gitignore 有效**
```
git rm -r --cached ios android
```

**Git Hooks 工具 - Husky**
```
npx husky install
```
測試確認執行 git commit 時會先進行 lint-staged 檢查


## 常用指令

- **`npm run lint`**
  
  執行 ESLint 程式碼檢查，確保代碼風格一致

- **`npx expo prebuild --clean`**
  
  清除 Android/iOS 原生專案資料夾並重新生成，當遇到原生模組連結錯誤或設定未生效時，可使用此指令重置

  參考資料：[Continuous Native Generation (CNG)](https://docs.expo.dev/workflow/continuous-native-generation/)
