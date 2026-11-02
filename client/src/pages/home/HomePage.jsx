import Icon from '../../components/ui/Icon'
import WorkflowPreview from './WorkflowPreview'
import ServerStatus from './ServerStatus'
import { workflowSteps, questions } from './content'
import './home.css'

const repo = 'https://github.com/iwasaki-hub/loop-engineering-lab'

export default function HomePage() {
  return (
    <>
      <section className="home-hero container">
        <p className="eyebrow">
          <span className="eyebrow-line" /> BUILD WITH AI. LEARN BY DOING.
        </p>
        <h1>
          アイデアを、
          <br className="mobile-break" />
          <span>動くものへ。</span>
        </h1>
        <p className="hero-description">
          AIを、あなたの開発パートナーに。
          <br />
          設計から実装、テスト、改善まで。
          <br className="mobile-break" />
          つくる楽しさを、もっと先へ。
        </p>
        <div className="hero-buttons">
          <a className="button button-dark" href="#guide">
            AIと開発をはじめる <Icon name="diagonal" size={17} />
          </a>
          <a className="button button-light" href="#workflow">
            開発の流れを見る <Icon name="arrow" size={17} />
          </a>
        </div>
        <p className="hero-footnote">ひとつのアイデアから、何度でも。</p>
      </section>

      <div className="showcase-container">
        <WorkflowPreview />
      </div>
      <div className="stack-line container">
        <span>IDEAS INTO REALITY, WITH</span>
        <div>
          <span>Codex</span>
          <span>React</span>
          <span>Node.js</span>
          <span>MongoDB</span>
        </div>
        <span className="stack-caption">このラボで使うツール</span>
      </div>

      <section
        id="approach"
        className="approach-section container section-space"
      >
        <div className="section-intro">
          <p className="eyebrow">A NEW WAY TO BUILD</p>
          <h2>
            ひとりで考える、
            <br />
            その先へ。
          </h2>
        </div>
        <div className="approach-copy">
          <p>
            「こんなものをつくりたい」。
            <br />
            そのひと言から、開発ははじまります。
          </p>
          <p>
            AIと対話しながら、アイデアを整理し、コードを書き、動きを確かめる。迷ったときには別の視点を。うまくいったら、次の挑戦を。
          </p>
          <p>
            Loop Engineering Labは、<strong>人とAIでつくる開発</strong>
            を、小さな実践から学ぶ場所です。
          </p>
          <a className="inline-link" href="#workflow">
            小さく試す、というはじめかた <Icon name="arrow" size={17} />
          </a>
        </div>
      </section>

      <section id="workflow" className="workflow-section section-space">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE DEVELOPMENT LOOP</p>
              <h2>
                つくる。確かめる。
                <br />
                また、つくる。
              </h2>
            </div>
            <p>
              一度で完成させなくていい。
              <br />
              小さなループが、アイデアを育てます。
            </p>
          </div>
          <div className="workflow-cards">
            {workflowSteps.map((step) => (
              <article
                key={step.id}
                className={`workflow-card card-${step.id}`}
              >
                <div className="card-top">
                  <span>{step.number} /</span>
                  <Icon name={step.icon} size={23} />
                </div>
                <div
                  className={`mini-visual visual-${step.id}`}
                  aria-hidden="true"
                >
                  {step.id === 'plan' ? (
                    <div className="mini-document">
                      <span className="mini-tag">spec.md</span>
                      <b>つくりたいこと</b>
                      <i />
                      <i />
                      <i />
                      <span className="mini-check">
                        <Icon name="check" size={12} /> 期待する動作を明確に
                      </span>
                    </div>
                  ) : step.id === 'build' ? (
                    <div className="mini-code">
                      <span>+ router.get('/ideas',</span>
                      <span>+ &nbsp; async (req, res) =&gt; {'{'}</span>
                      <span>+ &nbsp; &nbsp; res.json(ideas);</span>
                      <span>+ &nbsp; {'}'});</span>
                    </div>
                  ) : (
                    <div className="mini-tests">
                      <span>
                        <Icon name="check" size={14} /> 正常な入力
                      </span>
                      <span>
                        <Icon name="check" size={14} /> エラー時の動作
                      </span>
                      <span>
                        <Icon name="check" size={14} /> 境界値の確認
                      </span>
                    </div>
                  )}
                </div>
                <p className="card-label">{step.label}</p>
                <h3>{step.title}</h3>
                <p className="card-description">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="loop-caption">
            <Icon name="loop" size={16} /> 気づきを設計に戻して、次のループへ。
          </div>
        </div>
      </section>

      <section id="guide" className="guide-section container section-space">
        <div className="section-intro">
          <p className="eyebrow">YOUR FIRST LOOP</p>
          <h2>
            最初の一歩は、
            <br />
            小さくていい。
          </h2>
          <p>
            使い慣れたエディターと、ひとつの問い。
            <br />
            実際のプロジェクトで試してみよう。
          </p>
          <a
            className="button button-dark"
            href={repo}
            target="_blank"
            rel="noreferrer"
          >
            プロジェクトを開く <Icon name="diagonal" size={16} />
          </a>
        </div>
        <div className="guide-steps">
          <article>
            <span>01</span>
            <div>
              <h3>つくりたいものを書き出す</h3>
              <p>目的、入力、期待する結果を設計書に。まずは一つのAPIから。</p>
              <code>docs/spec.md</code>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>AIと一緒に実装する</h3>
              <p>要件と作業ルールを渡して、テストとコードを用意します。</p>
              <code>prompts/implement.md</code>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>動かして、理解する</h3>
              <p>
                結果と差分を読み、設計どおりかを確認。改善を次につなげます。
              </p>
              <code>npm test</code>
            </div>
          </article>
          <ServerStatus />
        </div>
      </section>

      <section className="faq-section container section-space">
        <div>
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2>気になること。</h2>
        </div>
        <div className="faq-list">
          {questions.map((question) => (
            <details key={question.title}>
              <summary>
                {question.title}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{question.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="closing-section">
        <div className="container">
          <Icon name="loop" size={38} />
          <h2>次は、何をつくろう。</h2>
          <p>
            まだ輪郭のないアイデアも、
            <br className="mobile-break" />
            AIと一緒なら、次の一歩に。
          </p>
          <a className="button button-dark" href="#guide">
            最初のループを回す <Icon name="diagonal" size={17} />
          </a>
          <span className="closing-caption">KEEP BUILDING. KEEP LEARNING.</span>
        </div>
      </section>
    </>
  )
}
