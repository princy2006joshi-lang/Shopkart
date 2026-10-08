import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import StatusMessage from '../components/StatusMessage'
import { fetchProducts } from '../axiosCalls/productApi'

export default function Products() {
  const [filters, setFilters] = useState({ search: '', category: 'All Categories', sort: '' })
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('Loading products...')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 350)
    return () => clearTimeout(timer)
  }, [filters.search])

  useEffect(() => {
    let active = true
    setStatus('Loading products...')
    fetchProducts({ ...filters, search: debouncedSearch }).then((data) => {
      if (!active) return
      setProducts(data.products || [])
      setStatus('')
    }).catch(() => active && setStatus('Unable to load products.'))
    return () => { active = false }
  }, [debouncedSearch, filters.category, filters.sort])

  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }))

  return <div className="app-shell"><Navbar /><main className="catalog-content"><div className="catalog-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> THE SHOPKART EDIT</p><h1>Find your next<br /><em>favorite.</em></h1></div><p>Everyday objects, thoughtful upgrades, and pieces that just feel right.</p></div><SearchBar {...filters} onChange={updateFilter} /><div className="catalog-results-row"><span>{status === 'Loading products...' ? 'Finding the good stuff...' : `${products.length} thoughtful finds`}</span><span>CURATED FOR EVERYDAY</span></div><StatusMessage message={status} type={status === 'Loading products...' ? 'info' : 'error'} />{!status && !products.length && <StatusMessage message="No products match those filters." type="info" />}<section className="catalog-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</section></main></div>
}
