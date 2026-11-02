import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
export default function SiteFooter() {
  return (
    <footer className="site-footer container">
      <Link className="wordmark" to="/">
        <Icon name="loop" size={21} />
        <strong>
          loop<span> / </span>
        </strong>
        <span className="wordmark-caption">engineering lab</span>
      </Link>
      <p>小さく試して、つくる力を広げよう。</p>
      <a
        href="https://github.com/iwasaki-hub/loop-engineering-lab"
        target="_blank"
        rel="noreferrer"
      >
        GitHub <Icon name="diagonal" size={14} />
      </a>
      <span className="footer-note">Built with curiosity.</span>
    </footer>
  )
}
