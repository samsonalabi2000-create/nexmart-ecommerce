import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/index";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mockData";

const SORT_OPTIONS = [
  { value: "", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const BRANDS = ["Apple", "Samsung", "Sony", "Nike", "Adidas", "Dyson", "LG"];
const RATINGS = [4, 3, 2];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "",
    brand: searchParams.get("brand") || "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    page: 1,
  });

  // Sync URL params into filters
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      category: searchParams.get("category") || "",
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "",
    }));
  }, [searchParams]);

  const { products, total, totalPages, loading } = useProducts(filters);

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ category: "", search: "", sort: "", brand: "", minPrice: "", maxPrice: "", rating: "", page: 1 });
    setSearchParams({});
  };

  const activeFilterCount = [filters.category, filters.brand, filters.rating, filters.minPrice, filters.sort]
    .filter(Boolean).length;

  return (
    <div className="section-container py-8 min-h-screen">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">
          {filters.category
            ? CATEGORIES.find((c) => c.id === filters.category)?.name || "Products"
            : filters.search ? `Results for "${filters.search}"` : "All Products"
          }
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? "Loading..." : `${total.toLocaleString()} products found`}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={cn(
          "w-64 shrink-0 hidden lg:block"
        )}>
          <div className="glass rounded-2xl border border-border p-5 space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-sm">Filters</h2>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-gold hover:underline">Clear all ({activeFilterCount})</button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-3">Category</h3>
              <div className="space-y-1">
                <button onClick={() => updateFilter("category", "")}
                  className={cn("w-full text-left text-sm px-3 py-2 rounded-lg transition-colors", !filters.category ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-secondary")}>
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => updateFilter("category", cat.id)}
                    className={cn("w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
                      filters.category === cat.id ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-secondary")}>
                    <span>{cat.icon}</span>{cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-3">Price Range (₦)</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="input-dark h-8 text-xs flex-1 px-2" />
                <span className="text-muted-foreground self-center text-xs">—</span>
                <input type="number" placeholder="Max" value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="input-dark h-8 text-xs flex-1 px-2" />
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-3">Brand</h3>
              <div className="space-y-1">
                {BRANDS.map((b) => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer group py-1">
                    <input type="checkbox" checked={filters.brand === b} onChange={(e) => updateFilter("brand", e.target.checked ? b : "")}
                      className="w-4 h-4 rounded border-border accent-gold" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-3">Min. Rating</h3>
              <div className="space-y-1">
                {RATINGS.map((r) => (
                  <button key={r} onClick={() => updateFilter("rating", r)}
                    className={cn("w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1",
                      Number(filters.rating) === r ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-secondary")}>
                    {"★".repeat(r)}{"☆".repeat(5 - r)} <span className="text-xs ml-1">{r}+</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <button key={cat.id} onClick={() => updateFilter("category", cat.id === filters.category ? "" : cat.id)}
                  className={cn("category-pill text-xs", filters.category === cat.id && "active")}>
                  {cat.icon} {cat.name.split(" ")[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)}
                className="input-dark h-9 text-xs px-3 w-44 cursor-pointer">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              {/* Mobile filter button */}
              <button onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden relative h-9 px-3 rounded-lg border border-border text-xs flex items-center gap-1.5 hover:bg-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
                {activeFilterCount > 0 && <span className="w-4 h-4 bg-gold text-[#0B0B0B] rounded-full text-[10px] flex items-center justify-center font-bold">{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {Array(9).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-display font-bold mb-2">No products found</p>
              <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-gold px-6 h-10 rounded-xl text-sm font-semibold">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className="h-9 w-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-40 hover:bg-secondary transition-colors">
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setFilters((f) => ({ ...f, page: p }))}
                  className={cn("h-9 w-9 rounded-lg text-sm font-mono transition-colors",
                    filters.page === p ? "bg-gold text-[#0B0B0B] font-bold" : "border border-border hover:bg-secondary")}>
                  {p}
                </button>
              ))}
              <button disabled={filters.page === totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className="h-9 w-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-40 hover:bg-secondary transition-colors">
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
