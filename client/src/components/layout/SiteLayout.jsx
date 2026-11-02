import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
export default function SiteLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        本文へスキップ
      </a>
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}
