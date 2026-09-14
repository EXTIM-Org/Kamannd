"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SearchInput = ({ 
  query, 
  setQuery, 
  handleSearch 
}: { 
  query: string;
  setQuery: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}) => (
  <form onSubmit={handleSearch} className="search-form">
    <input
      type="text"
      className="search-input"
      placeholder="جستجوی کالا، برند یا دسته‌بندی..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      dir="rtl"
    />
    <button type="submit" className="search-button" aria-label="جستجو">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </button>
  </form>
);

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (!res.ok) throw new Error('خطا در دریافت اطلاعات');
        const data = await res.json();
        // The API returns { results: [], facets: [] }
        setResults(data.results || []);
      } catch (err) {
        setError('خطا در برقراری ارتباط با سرور.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  if (!searchQuery) {
    return (
      <main className="hero" dir="rtl">
        <div className="container">
          <Image 
            src="/logo.jpg" 
            alt="دیرک لوگو" 
            width={120} 
            height={120} 
            className="hero-logo"
            priority
          />
          <h1>جستجوی هوشمند کالا</h1>
          <SearchInput query={query} setQuery={setQuery} handleSearch={handleSearch} />
        </div>
      </main>
    );
  }

  return (
    <div dir="rtl">
      <header className="header glass">
        <div className="container">
          <Link href="/" className="logo-container" onClick={() => {setSearchQuery(''); setQuery('');}}>
            <Image src="/logo.jpg" alt="لوگو" width={48} height={48} className="logo-img" />
            <span className="logo-text">دیرک</span>
          </Link>
          <div style={{ flex: 1, maxWidth: '600px' }}>
            <SearchInput query={query} setQuery={setQuery} handleSearch={handleSearch} />
          </div>
        </div>
      </header>

      <main className="results-page container">
        <div className="results-header">
          <h2>نتایج جستجو برای «{searchQuery}»</h2>
          <span className="results-count">
            {loading ? 'در حال جستجو...' : `${results.length} کالا یافت شد`}
          </span>
        </div>

        {error && (
          <div style={{ color: '#e53e3e', textAlign: 'center', padding: '40px', background: 'var(--white)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <h3>{error}</h3>
          </div>
        )}

        {loading ? (
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="product-card glass" style={{ height: '350px' }}>
                <div className="product-image-container skeleton"></div>
                <div className="product-info">
                  <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '12px' }}></div>
                  <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '20px' }}></div>
                  <div className="product-footer">
                    <div className="skeleton" style={{ height: '28px', width: '50%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {results.map((product: any) => (
              <a href={product.url || '#'} key={product.id} className="product-card glass" target="_blank" rel="noopener noreferrer">
                <div className="product-image-container">
                  {product.in_stock && <span className="badge">موجود</span>}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image_url || '/logo.jpg'} 
                    alt={product.title} 
                    className="product-image"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.jpg';
                    }}
                  />
                </div>
                <div className="product-info">
                  {product.brand && <div className="product-brand">{product.brand}</div>}
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-footer">
                    {product.price > 0 ? (
                      <div className="product-price">
                        {product.price.toLocaleString('fa-IR')} 
                        <span className="product-currency">{product.currency === 'Toman' ? 'تومان' : product.currency}</span>
                      </div>
                    ) : (
                      <div className="out-of-stock">ناموجود</div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
        
        {!loading && results.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)', background: 'var(--white)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <h3>کالایی با این مشخصات یافت نشد!</h3>
            <p style={{ marginTop: '10px' }}>لطفاً کلمات کلیدی دیگری را امتحان کنید.</p>
          </div>
        )}
      </main>
    </div>
  );
}
