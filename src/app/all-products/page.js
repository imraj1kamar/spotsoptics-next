'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

import ProductCard from '@/components/common/ProductCard';
import Sidebar from '@/components/common/Sidebar';
import PageTopBar  from '@/components/common/PageTopBar';
import productsData from '@/data/products.json';
import sidebarData from '@/data/sidebar.json';
import '../../../public/assets/css/all-products.css';
import '../../../public/assets/css/products.css';

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product';
}

export default function AllProductsCatalogPage() {
  const items = productsData?.items || [];

  const { scrollYProgress } = useScroll();
  const rawY = useTransform(scrollYProgress, [0, 0.3], [0, -20]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.03, 0.98]);
  const y = useSpring(rawY, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const scale = useSpring(rawScale, { stiffness: 90, damping: 28, restDelta: 0.001 });

  return (
    <motion.main
      className="spotoptics-main"
      style={{ y, scale, willChange: 'transform' }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <section className="all-products-page">
        <div className="container">
      
            <PageTopBar
                            breadcrumbs={[
                              { label: 'Home', href: '/' },
                              { label: 'Products' },
                            ]}
                           showCounter={true}
                           counterValue={items.length || 0}
                          />

          <div className="row g-4 ">
            <div className="col-lg-9">
              <div className="row g-4 align-items-stretch">
                {items.map((item, index) => (
                  <div className="col-md-6 col-xl-4" key={`${item.name || 'product'}-${index}`}>
                    <ProductCard
                      index={index}
                      name={item.name || ''}
                      description={item.description || ''}
                      image={item.image || ''}
                      link={`/all-products/${slugify(item.name || `product-${index + 1}`)}`}
                      className="h-100"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-3  pb-1 d-none d-lg-block">
              <Sidebar
                title={sidebarData.title || 'Categories'}
                links={sidebarData.links || []}
              />
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
