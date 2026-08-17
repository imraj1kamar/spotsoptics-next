import Link from 'next/link';

export default function Breadcrumbs({ items = [], className = '' }) {
  const safeItems = items.filter(Boolean);

  if (!safeItems.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={`spotoptics-breadcrumb ${className}`.trim()}>
      <ol className="breadcrumb mb-0">
        {safeItems.map((item, index) => {
          const isLast = index === safeItems.length - 1;
          const itemLabel = item.label || 'Item';

          return (
            <li
              key={`${itemLabel}-${index}`}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`.trim()}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast || !item.href ? (
                <span>{itemLabel}</span>
              ) : (
                <Link href={item.href} className="breadcrumb-link">
                  {itemLabel}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
