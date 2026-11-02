import { Link } from 'react-router-dom'
export default function NotFoundPage() {
  return (
    <section className="not-found container">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        次の一歩は、
        <br />
        ホームから。
      </h1>
      <p>このページは見つかりませんでした。</p>
      <Link className="button button-dark" to="/">
        ホームに戻る
      </Link>
    </section>
  )
}
