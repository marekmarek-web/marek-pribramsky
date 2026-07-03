import Image from "next/image";

/** Sekce #pobocky — stejná jako na úvodní stránce (canonical index.html). */
export function PobockySection() {
  return (
    <section id="pobocky" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-white scroll-mt-28 md:scroll-mt-32">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 lg:mb-16 animate-fade-in-up">
          <h2 className="section-title font-bold text-brand-text mb-4">Kde nás najdete</h2>
          <p className="text-brand-muted section-desc mx-auto text-lg leading-relaxed">Naše pobočky v Roudnici, Praze a okolí.</p>
        </div>
        <div className="bento-grid">
          <a
            href="https://www.google.com/maps?q=N%C3%A1m.+Jana+z+Dra%C5%BEic+99,+413+01+Roudnice+nad+Labem"
            target="_blank"
            rel="noopener noreferrer"
            className="bento-card bento-card--large"
          >
            <div className="bento-card-img">
              <Image
                src="/img/rce.jpg"
                alt="Roudnice nad Labem, pohled na náměstí"
                width={800}
                height={600}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={78}
              />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <span className="bento-badge">Sídlo společnosti</span>
              <h3 className="bento-city">Roudnice nad Labem</h3>
              <address className="bento-address">
                Nám. Jana z Dražic 99
                <br />
                413 01 Roudnice nad Labem
              </address>
            </div>
          </a>
          <a href="https://www.google.com/maps?q=%C5%BDateck%C3%A1+55%2F14,+110+00+Praha" target="_blank" rel="noopener noreferrer" className="bento-card">
            <div className="bento-card-img">
              <Image
                src="/img/praha.jpg"
                alt="Praha, panorama města"
                width={600}
                height={400}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={78}
              />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <h3 className="bento-city">Praha</h3>
              <address className="bento-address">
                Žatecká 55/14
                <br />
                110 00 Praha
              </address>
            </div>
          </a>
          <a href="https://www.google.com/maps?q=5.+kv%C4%9Btna+10,+412+01+Litom%C4%9B%C5%99ice" target="_blank" rel="noopener noreferrer" className="bento-card">
            <div className="bento-card-img">
              <Image
                src="/img/lito.png"
                alt="Litoměřice, Mírové náměstí"
                width={600}
                height={400}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={78}
              />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <h3 className="bento-city">Litoměřice</h3>
              <address className="bento-address">
                5. května 10
                <br />
                412 01 Litoměřice
              </address>
            </div>
          </a>
          <a href="https://www.google.com/maps?q=U+Tr%C5%BEnice+701,+411+08+%C5%A0t%C4%9Bt%C3%AD" target="_blank" rel="noopener noreferrer" className="bento-card">
            <div className="bento-card-img">
              <Image
                src="/img/steti.jpg"
                alt="Štětí, okolí města"
                width={600}
                height={400}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={78}
              />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <h3 className="bento-city">Štětí</h3>
              <address className="bento-address">
                U Tržnice 701
                <br />
                411 08 Štětí
              </address>
            </div>
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=%C5%BDi%C5%BEkova%2028%2F922%2C%20410%2002%20Lovosice"
            target="_blank"
            rel="noopener noreferrer"
            className="bento-card"
          >
            <div className="bento-card-img">
              <Image
                src="/img/lovo.jpg"
                alt="Lovosice, pohled na Lovoš a okolí"
                width={600}
                height={400}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={78}
              />
              <div className="bento-card-overlay" />
            </div>
            <div className="bento-card-content">
              <h3 className="bento-city">Lovosice</h3>
              <address className="bento-address">
                Žižkova 28/922
                <br />
                410 02 Lovosice
              </address>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
