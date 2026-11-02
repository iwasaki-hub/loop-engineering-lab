import AnimatedOutlet from '../motion/AnimatedOutlet'
import ReadingProgress from '../motion/ReadingProgress'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
export default function SiteLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        本文へスキップ
      </a>
      <SiteHeader />
      <ReadingProgress />
      <main id="main-content" tabIndex={-1}>
        <AnimatedOutlet />
      </main>
      <SiteFooter />
    </>
  )
}
