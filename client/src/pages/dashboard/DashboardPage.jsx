import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'
import './dashboard.css'

export default function DashboardPage() {
  const { user } = useAuth()
  const displayName = user.name || user.email
  return (
    <section className="dashboard-page container">
      <nav className="dashboard-breadcrumb" aria-label="パンくずリスト">
        <Link to="/">ホーム</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">マイページ</span>
      </nav>
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>
            こんにちは、
            <br />
            <span>{displayName}</span>さん。
          </h1>
          <p>
            今日も、小さなアイデアから。
            <br />
            あなたのペースで、次のループをはじめましょう。
          </p>
        </div>
        <span className="dashboard-badge">
          <Icon name="check" size={14} /> ログイン中
        </span>
      </div>
      <div className="dashboard-grid">
        <article className="profile-card">
          <div className="profile-card-title">
            <span className="profile-avatar" aria-hidden="true">
              <Icon name="user" size={23} />
            </span>
            <div>
              <p className="eyebrow">YOUR PROFILE</p>
              <h2>アカウント情報</h2>
            </div>
          </div>
          <dl>
            <div>
              <dt>
                <Icon name="user" size={13} /> 名前
              </dt>
              <dd>{user.name || '名前は未設定です'}</dd>
            </div>
            <div>
              <dt>
                <Icon name="email" size={13} /> メールアドレス
              </dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
          <p className="profile-note">
            <Icon name="lock" size={12} />{' '}
            ログイン中のあなたの情報を表示しています。
          </p>
        </article>
        <article className="dashboard-next">
          <Icon name="loop" size={35} />
          <p className="eyebrow">KEEP THE LOOP GOING</p>
          <h2>
            次の一歩を、
            <br />
            見つけよう。
          </h2>
          <p>
            設計、実装、テスト、改善。
            <br />
            開発の流れを振り返ってみませんか。
          </p>
          <a className="button button-dark" href="/#workflow">
            開発の流れを見る <Icon name="arrow" size={16} />
          </a>
          <a
            className="inline-link"
            href="https://github.com/iwasaki-hub/loop-engineering-lab"
            target="_blank"
            rel="noreferrer"
          >
            プロジェクトを開く <Icon name="diagonal" size={14} />
          </a>
        </article>
      </div>
    </section>
  )
}
