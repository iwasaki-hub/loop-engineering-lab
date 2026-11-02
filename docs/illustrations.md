# ホームページの挿絵

## Human + AI workshop

- 作成日: 2026-11-03
- 生成方法: 組み込みImage Generationツール。CLI/APIキーは使用していない。
- 用途: Reactホームのヒーロー。人とAIがアイデアを設計・実装・検証して育てる、というテーマ。
- 配信用: `client/src/assets/illustrations/human-ai-workshop.webp`（1200×800、約114KB）
- 原本: `client/src/assets/illustrations/human-ai-workshop.png`（1536×1024、約2.26MB）
- 原本からSharp CLIを一時実行してWebPへ最適化。実行時依存には追加していない。
- Viteのimportで読み込み、ビルド時にハッシュ付きファイルとして配信。外部画像サービスへの依存なし。
- 画像寸法・代替テキスト・高優先度読み込みを指定。デスクトップは本文の右、タブレット以下は本文の下に表示。

## 最終生成プロンプト

```text
Create a polished editorial illustration for the HERO of a Japanese AI-assisted software development educational website called Loop Engineering Lab. Image only, not a website screenshot. Wide horizontal landscape composition roughly 3:2. A thoughtful human software developer and a friendly small sophisticated AI companion collaborate side by side at an architectural wooden worktable, assembling a beautiful miniature modular world from translucent sage-green code panels, softly rounded building blocks, a glowing warm ivory idea orb and a flowing ribbon that forms an open loop linking idea -> creation -> testing. Human agency and calm collaboration, curious and optimistic. A few tiny plants, paper design sketches, softly lit laptop with abstract marks but NO legible text. Premium tactile 3D clay / paper editorial aesthetic with delicate grain and refined soft shadows, sophisticated rather than childish or toy advertising. Palette: muted sage, moss, pale mint, warm ivory, subtle peach clothing accent, charcoal fine details. Off-white #fdfefb seamless background that softly blends at edges into whitespace, airy generous negative space, central illustration filling about 80% of canvas, no enclosing box, no borders. Gentle isometric three-quarter view with convincing dimensional craft. Calm natural daylight. No logos, no watermarks, no letters, no UI screenshots, no neon, no purple gradients, no photorealism. Clean intentional shapes, beautiful spatial composition, professionally art directed, high resolution.
```
