# UIモーション

ユーザー導入済みのMotion for Reactを利用する。
フォレスト/サンライズの両デザインで同じ操作体験を提供する。

## 適用箇所

- ページ遷移: 本文を短くフェード/スライド。ルート変更時は先頭へ戻し本文へフォーカスする。ハッシュリンクのスクロール位置は尊重する。
- ホーム: セクションと工程カードを画面内に入ったタイミングで一度だけ表示。カードはhoverでも反応する。
- 工程プレビュー: 設計/実装/検証を選ぶと、説明とコードがフェードで切り替わる。AI送信や実行機能の追加ではない。
- Navbar: モバイルメニューの表示、アカウント候補の開閉、ハンバーガーとデザイン切り替えボタンの押下に反応。
- 読了位置: ページ上端にスクロール位置を表す細いバーを表示。読み上げ対象からは外す。

## 構成

`client/src/components/motion/` に共通処理を置く。

| ファイル | 役割 |
| --- | --- |
| UiMotionProvider.jsx | MotionConfigとLazyMotion。OSの動きを減らす設定を尊重 |
| features.js | domAnimationを別チャンクで遅延読み込み |
| AnimatedOutlet.jsx | Routerの本文遷移。ページ状態を不要に再マウントしない |
| Reveal.jsx | section/articleなどの表示とカードhover |
| ReadingProgress.jsx | Motion Valueでスクロール位置を表示 |
| motion.css | 表示を支える最小限のCSS |

## 読みやすさと状態の保持

- 初期HTMLで本文を透明にしない。SSRの描画確認でも本文が読める。
- `MotionConfig reducedMotion="user"` と `useReducedMotion()` を使用。動きを減らす設定では表示/遷移の移動とスクロールバーを停止し、メニューは即時切り替え。
- 閉じたアカウント候補はaria-hiddenとinertで操作対象から外す。Escape、外側クリック、ArrowDownの操作は維持。
- ページの退出待ちを入れず、ログアウト時はRouterと認証ガードがそのまま反映される。
- テーマ変更やハッシュ変更でフォーム/ユーザー状態を再マウントしない。
- 手動アニメーションはreact-mini、UI部品はreact-mを使い、演出用機能を遅延読み込みする。
- アニメーション/イベント監視はアンマウント時に解除し、停止時は表示状態へ戻す。

## 検証の範囲

既存の通常テストとReactの描画確認・本番ビルドを実施する。
描画確認はアニメーションの時間経過や実ブラウザーの操作を検証するものではない。
ブラウザーで確認する際は、両デザイン、モバイルメニュー、工程切り替え、OSの「動きを減らす」設定をそれぞれ試す。

## 参考

- https://motion.dev/docs/react-accessibility
- https://motion.dev/docs/react-animate-presence
- https://motion.dev/docs/react-scroll-animations
- https://motion.dev/docs/react-use-animate
- https://motion.dev/docs/react-reduce-bundle-size
