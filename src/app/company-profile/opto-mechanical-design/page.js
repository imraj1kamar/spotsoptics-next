import Image from 'next/image';
import PageTopBar from '@/components/common/PageTopBar';
import pageData from '@/data/opto-mechanical-design.json';
import '../../../../public/assets/css/opto-mechanical-design.css';

export const metadata = {
  title: 'Opto-mechanical Design',
  description: pageData.page.description,
};

export default function OptoMechanicalDesignPage() {
  const { page, capabilities, visual } = pageData;

  return (
    <main className="page-section py-5 opto-mechanical-page">
      <div className="container mt-5">
        <PageTopBar breadcrumbs={page.breadcrumbs} showCounter={false} />

        <header className="opto-mechanical-heading text-center mx-auto mb-5">
          <span className="opto-mechanical-eyebrow d-inline-block mb-2">
            {capabilities.eyebrow}
          </span>
          <h1 className="opto-mechanical-title mb-3">{page.title}</h1>
          <p className="page-tagline mb-0">{page.description}</p>
        </header>

        <section className="row g-4 g-lg-5 align-items-stretch" aria-labelledby="capabilities-title">
          <div className="col-12 col-lg-6">
            <article className="opto-mechanical-card h-100 p-4 p-md-5">
              <h2 id="capabilities-title" className="opto-mechanical-section-title mb-3">
                {capabilities.title}
              </h2>
              <p className="opto-mechanical-intro mb-4">{capabilities.intro}</p>

              <ul className="list-unstyled mb-0 d-grid gap-3">
                {capabilities.items.map((item, index) => (
                  <li key={item} className="opto-mechanical-capability d-flex align-items-start gap-3">
                    <span className="opto-mechanical-capability-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="col-12 col-lg-6">
            <figure className="opto-mechanical-visual h-100 mb-0 p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                <span className="comparison-floating-badge badge  text-white px-3 py-2 rounded-pill fw-semibold mb-2">{visual.eyebrow}</span>
                <span className="opto-mechanical-caption">{visual.caption}</span>
              </div>
              <div className="opto-mechanical-image-frame">
                <Image
                  src={visual.image}
                  alt={visual.alt}
                  width={1122}
                  height={780}
                  sizes="(max-width: 991px) 100vw, 50vw"
                  className="img-fluid w-100 h-auto"
                />
              </div>
              <figcaption className="knowledge-caption px-3 py-2">
                <span className="caption-dot"></span>
                <span className="caption-text">{visual.title}</span>
                
              </figcaption>
            </figure>
          </div>
        </section>
      </div>
    </main>
  );
}
