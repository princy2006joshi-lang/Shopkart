export default function SearchBar({ search, category, sort, onChange }) {
  return <div className="catalog-controls">
    <label>Search<input value={search} onChange={(event) => onChange('search', event.target.value)} placeholder="Search products" /></label>
    <label>Category<select value={category} onChange={(event) => onChange('category', event.target.value)}><option>All Categories</option><option>Electronics</option><option>Fashion</option><option>Books</option><option>Home</option></select></label>
    <label>Sort<select value={sort} onChange={(event) => onChange('sort', event.target.value)}><option value="">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></label>
  </div>
}
