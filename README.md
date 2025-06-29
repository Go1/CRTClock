# Beautiful Flip Clock

美しいフリップ時計のWebアプリケーションです。レトロなデジタル時計のフリップ動作を再現し、リアルタイムで現在時刻を表示します。

## 特徴

- **リアルタイム時計**: 秒単位で更新される正確な時刻表示
- **フリップアニメーション**: 数字が変わる際の滑らかなフリップ効果
- **レスポンシブデザイン**: モバイルからデスクトップまで対応
- **美しいUI**: グラデーションと影効果による洗練されたデザイン
- **アンビエントグロー**: 時計周辺の美しい光彩効果

## 技術スタック

- **React 18** - モダンなUIライブラリ
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **Vite** - 高速な開発サーバーとビルドツール

## セットアップ方法

### 前提条件

- Node.js (バージョン 16 以上)
- npm または yarn

### Ubuntu での起動方法

```bash
# Node.jsとnpmのインストール（未インストールの場合）
sudo apt update
sudo apt install nodejs npm

# プロジェクトのクローン
git clone <repository-url>
cd beautiful-flip-clock

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### macOS での起動方法

```bash
# Homebrewを使用してNode.jsをインストール（未インストールの場合）
brew install node

# プロジェクトのクローン
git clone <repository-url>
cd beautiful-flip-clock

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 起動後

開発サーバーが起動すると、通常は `http://localhost:5173` でアプリケーションにアクセスできます。
ブラウザが自動的に開かない場合は、手動でURLにアクセスしてください。

## 利用可能なスクリプト

- `npm run dev` - 開発サーバーの起動
- `npm run build` - プロダクション用ビルド
- `npm run preview` - ビルド結果のプレビュー
- `npm run lint` - ESLintによるコードチェック

## プロジェクト構造

```
src/
├── components/
│   ├── FlipClock.tsx      # メインの時計コンポーネント
│   └── FlipDigit.tsx      # 個別の数字フリップコンポーネント
├── App.tsx                # アプリケーションのルートコンポーネント
├── main.tsx              # エントリーポイント
└── index.css             # グローバルスタイルとアニメーション
```

## カスタマイズ

- **色の変更**: `src/components/FlipClock.tsx` と `src/components/FlipDigit.tsx` のTailwindクラスを編集
- **アニメーション速度**: `src/index.css` の `@keyframes` セクションで調整
- **サイズ調整**: FlipDigitコンポーネントの `w-16 h-20` などのクラスを変更

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。