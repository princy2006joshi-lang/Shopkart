import { Link } from 'react-router-dom'

export default function Landing() {
  return <main className="landing-shell"><div className="landing-inner"><Link className="brand" to="/login"><span className="brand-mark">S</span>shopkart</Link><section className="landing-hero"><p className="eyebrow">The everyday edit</p><h1>Good things,<br /><em>well chosen.</em></h1><p>Discover useful, beautiful pieces for the way you live now.</p><div className="landing-actions"><Link className="button button-primary" to="/signup">Create an account <span aria-hidden="true">{'->'}</span></Link><Link className="button button-quiet" to="/login">Sign in</Link></div></section></div></main>
}
