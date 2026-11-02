import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import DevelopmentFlow from './DevelopmentFlow'
import { improvements, milestones, repo, verification } from './content'
import './caseStudies.css'
import { useAuth } from '../../hooks/useAuth'

export default function CaseStudiesPage() {
  const { status } = useAuth()
  return (
    <article className="case-study-page">
      <title>開発事例 | Loop Engineering Lab</title>
      <section className="case-hero container">
        <nav className="case-breadcrumb" aria-label="パンくずリスト">
          <Link to="/">ホーム</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">開発事例</span>
        </nav>
        <div className="case-hero-grid">
          <div>
            <p className="eyebrow">CASE STUDY 001 / LOOP ENGINEERING LAB</p>
            <h1>
              ひとつのAPIから、
              <br />
              <span>AIと育てる</span>
              <br />
              Webアプリへ。
            </h1>
            <p className="case-lead">
              設計書を書く。AIと実装する。テストして、直す。
              <br />
              このサイトができるまでの、小さなループの記録です。
            </p>
            <div className="case-hero-actions">
              <a className="button button-dark" href="#development-flow">
                開発フローを見る <Icon name="arrow" size={16} />
              </a>
              <a
                className="inline-link"
                href={repo}
                target="_blank"
                rel="noreferrer"
              >
                GitHubで見る <Icon name="diagonal" size={14} />
              </a>
            </div>
          </div>
          <aside className="case-terminal" aria-label="初回の開発記録">
            <div className="case-terminal-bar">
              <Icon name="terminal" size={14} />
              <span>THE FIRST LOOP</span>
              <span>開発記録より</span>
            </div>
            <div className="case-terminal-body">
              <p className="terminal-command">$ npm test</p>
              <p className="terminal-fail">× GET /health</p>
              <p className="terminal-muted">Cannot find module '../src/app'</p>
              <div className="terminal-change">
                <Icon name="code" size={15} />
                <span>設計書に沿って、Expressを実装</span>
              </div>
              <p className="terminal-command">$ npm test</p>
              <p className="terminal-pass">✓ GET /health → 200</p>
              <p className="terminal-pass">✓ 未定義パス → 404</p>
              <p className="terminal-summary">
                2件のテストが成功。最初の一周が完了。
              </p>
            </div>
            <p className="case-terminal-caption">
              <Icon name="loop" size={13} /> 小さく始めて、確かめながら育てる。
            </p>
          </aside>
        </div>
        <dl className="case-facts">
          <div>
            <dt>PROJECT</dt>
            <dd>Loop Engineering Lab</dd>
          </div>
          <div>
            <dt>APPROACH</dt>
            <dd>人とAIのループ開発</dd>
          </div>
          <div>
            <dt>ENVIRONMENT</dt>
            <dd>Windows / Node.js</dd>
          </div>
          <div>
            <dt>STACK</dt>
            <dd>Express · React · MongoDB</dd>
          </div>
        </dl>
      </section>

      <section className="case-overview container">
        <p className="eyebrow">THE CHALLENGE</p>
        <div>
          <h2>
            AIを使うだけでなく、
            <br />
            開発の進め方を身につける。
          </h2>
          <p>
            目指したのは、AIにコードを書いてもらって終わる開発ではありません。期待する動作を先に決め、実際の結果を確かめ、変更の理由を理解すること。最小のヘルスチェックAPIを出発点に、認証と画面を少しずつ積み重ねました。
          </p>
        </div>
      </section>

      <section id="development-flow" className="case-flow-section">
        <div className="container">
          <div className="case-section-heading">
            <div>
              <p className="eyebrow">HOW WE BUILD</p>
              <h2>
                一度で完成させず、
                <br />
                このループを繰り返す。
              </h2>
            </div>
            <p>
              人が目的を決め、AIと手を動かし、
              <br />
              結果を見て次の一歩を決めます。
            </p>
          </div>
          <DevelopmentFlow />
        </div>
      </section>

      <section id="milestones" className="case-milestones container">
        <div className="case-timeline-intro">
          <p className="eyebrow">FROM ZERO TO WEB APP</p>
          <h2>
            実装の、
            <br />
            積み重ね。
          </h2>
          <p>
            小さなAPIから、ユーザーが使える画面へ。
            <br />
            機能が増えるたびに、設計と検証も更新しました。
          </p>
          <a
            className="inline-link"
            href={`${repo}/blob/main/docs/loop-log.md`}
            target="_blank"
            rel="noreferrer"
          >
            開発記録を読む <Icon name="diagonal" size={14} />
          </a>
        </div>
        <ol className="case-timeline">
          {milestones.map((milestone) => (
            <li key={milestone.number}>
              <span className="milestone-number">{milestone.number}</span>
              <div className="milestone-content">
                <p className="eyebrow">{milestone.phase}</p>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <div className="milestone-files" aria-label="関連ファイル">
                  {milestone.files.map((file) => (
                    <code key={file}>{file}</code>
                  ))}
                </div>
                <p className="milestone-result">
                  <Icon name="check" size={13} />
                  {milestone.result}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="improvements"
        className="case-improvements container"
        aria-labelledby="improvements-heading"
      >
        <p className="eyebrow">DESIGN DECISIONS</p>
        <h2 id="improvements-heading">使いやすさを育てる、工夫と改善。</h2>
        <div className="case-improvements-grid">
          {improvements.map((item) => (
            <article key={item.title}>
              <img
                className="improvement-illustration"
                src={item.image}
                alt={item.imageAlt}
                width="900"
                height="600"
                loading="lazy"
                decoding="async"
              />
              <div className="improvement-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="milestone-result">
                  <Icon name="check" size={13} />
                  {item.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="learning" className="case-learning">
        <div className="container">
          <p className="eyebrow">ONE REAL LEARNING</p>
          <div className="case-section-heading">
            <div>
              <h2>
                テストが教えてくれた、
                <br />
                見落としていた動作。
              </h2>
            </div>
            <p>
              POST /echoの「空のJSON本文」。
              <br />
              実際の開発で見つかった、一つの修正です。
            </p>
          </div>
          <div className="learning-comparison">
            <article className="learning-before">
              <span className="learning-tag">BEFORE / 期待と違う応答</span>
              <h3>本文が空なのに、200が返る。</h3>
              <p>
                JSONパーサーが空本文を空オブジェクトとして扱うケースがあり、req.bodyの有無だけでは判別できませんでした。
              </p>
              <pre>
                <code>
                  {
                    '期待: HTTP 400\n実際: HTTP 200\n\n初回実装: 成功4件 / 失敗1件'
                  }
                </code>
              </pre>
            </article>
            <article className="learning-after">
              <span className="learning-tag">AFTER / 原因を見て修正</span>
              <h3>読み込み時に、本文の有無を確認。</h3>
              <p>
                express.jsonのverifyでバッファ長を確認。空本文を400で返し、同じテストを再実行しました。
              </p>
              <pre>
                <code>
                  {
                    'verify: (req, res, buffer) => {\n  req.hasJsonBody = buffer.length > 0;\n}\n\n修正後: 成功5件 / 失敗0件'
                  }
                </code>
              </pre>
            </article>
          </div>
          <p className="learning-takeaway">
            <Icon name="loop" size={18} />
            <span>
              期待値を変えて通すのではなく、
              <strong>原因を理解して実装を直す。</strong>
            </span>
          </p>
        </div>
      </section>

      <section className="case-partnership container">
        <div>
          <p className="eyebrow">HUMAN + AI</p>
          <h2>
            一緒につくる。
            <br />
            判断は、手放さない。
          </h2>
        </div>
        <div className="case-roles">
          <article>
            <Icon name="user" size={22} />
            <h3>人が決めること</h3>
            <p>
              目的と要件を定める。提案や差分を読み、実際の動作を確認して、次に進むかを判断する。
            </p>
          </article>
          <article>
            <Icon name="code" size={22} />
            <h3>AIと進めること</h3>
            <p>
              設計の整理、テストの作成、実装、失敗原因の分析、修正案の検討、変更と結果の記録。
            </p>
          </article>
        </div>
      </section>

      <section id="verification" className="case-verification">
        <div className="container">
          <div className="case-section-heading">
            <div>
              <p className="eyebrow">WHAT WE VERIFIED</p>
              <h2>結果も、確認の範囲も残す。</h2>
            </div>
            <p>
              2026年11月3日時点の開発記録。
              <br />
              リアルタイムのCI結果ではありません。
            </p>
          </div>
          <div className="verification-grid">
            {verification.map((item) => (
              <article key={item.title}>
                <p>{item.title}</p>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
                <code>{item.command}</code>
              </article>
            ))}
          </div>
          <aside className="verification-note">
            <Icon name="eye" size={18} />
            <div>
              <strong>確認済みと未確認を、分けて伝える。</strong>
              <p>
                専用MongoDBでの登録・ログイン・ログアウト・認証失効は確認済みです。一方、実ブラウザーによる操作・ページ全体の見た目は未確認。公開環境へのデプロイも、この事例の検証範囲には含めていません。
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="case-cta container">
        <Icon name="loop" size={32} />
        <h2>次のループは、あなたのアイデアで。</h2>
        <p>まずは一つの要件と、一つのテストから。</p>
        <div>
          <Link
            className="button button-dark"
            to={status === 'authenticated' ? '/dashboard' : '/signup'}
          >
            {status === 'authenticated' ? 'マイページへ' : 'アカウントを作成'}{' '}
            <Icon name="arrow" size={16} />
          </Link>
          <a
            className="inline-link"
            href={`${repo}/blob/main/docs/spec.md`}
            target="_blank"
            rel="noreferrer"
          >
            設計書を見てみる <Icon name="diagonal" size={14} />
          </a>
        </div>
      </section>
    </article>
  )
}
