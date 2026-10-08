import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="landing-shell">
      <div className="landing-inner">
        <header className="landing-header">
          <Link className="brand" to="/"><span className="brand-mark">S</span><span>shopkart</span></Link>
          <div className="landing-header-actions">
            <span>Thoughtful finds for everyday living</span>
            <Link className="landing-signin" to="/login">Sign in <span aria-hidden="true">↗</span></Link>
          </div>
        </header>
        <section className="landing-hero">
          <div className="landing-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> THE EVERYDAY EDIT</p>
            <h1>Find your<br />kind of <em>good.</em></h1>
            <p>Useful little upgrades. Things you’ll reach for every day. Curated for the way you live now.</p>
            <div className="landing-actions">
              <Link className="button button-primary" to="/signup">Explore the collection <span aria-hidden="true">→</span></Link>
              <Link className="landing-text-link" to="/login">Already a member? Sign in</Link>
            </div>
            <div className="landing-proof"><span>✦</span> A little more joy in the everyday</div>
          </div>
          <div className="landing-art" aria-label="ShopKart curated collection artwork">
            <div className="landing-art-orbit landing-art-orbit-one" />
            <div className="landing-art-orbit landing-art-orbit-two" />
            <div className="landing-art-sun">good<br /><em>things</em></div>
            <div className="landing-art-label landing-art-label-top">CURATED FOR YOU</div>
            <div className="landing-art-label landing-art-label-bottom">OBJECTS FOR EVERYDAY</div>
            <span className="landing-spark landing-spark-one">✳</span>
            <span className="landing-spark landing-spark-two">✦</span>
          </div>
        </section>
        <footer className="landing-footer"><span>Small discoveries. Better days.</span><span>SHOPKART · EST. 2026</span></footer>
      </div>
    </main>
  )
}
