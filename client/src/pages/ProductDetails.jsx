import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks";
import { productService, reviewService } from "@/services/api";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice, formatDiscount, cn } from "@/lib/utils";
import { StarRating, Badge, Spinner, ProductCardSkeleton } from "@/components/ui/index";
import ProductCard from "@/components/product/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (!product) return;
    reviewService.getProductReviews(id).then(setReviews);
    productService.getRelated(id, product.category).then(setRelated);
    setActiveImg(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addItem(product, quantity);
    setAddingToCart(false);
  };

  if (loading) return (
    <div className="section-container py-16 flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );

  if (error || !product) return (
    <div className="section-container py-16 text-center">
      <p className="text-2xl mb-2">😔</p>
      <h2 className="text-xl font-bold mb-4">Product not found</h2>
      <Link to="/products" className="btn-gold px-6 h-10 rounded-xl text-sm inline-flex items-center">← Back to Products</Link>
    </div>
  );

  const discount = product.originalPrice ? formatDiscount(product.originalPrice, product.price) : 0;
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="section-container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gold">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-gold capitalize">{product.categoryName}</Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1 max-w-xs">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-elevated img-zoom border border-border">
            <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={cn("w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors", activeImg === i ? "border-gold" : "border-border hover:border-muted")}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.badge && <Badge variant={product.badge}>{product.badge === "sale" ? `${discount}% OFF` : product.badge.toUpperCase()}</Badge>}
            {product.isNew && <Badge variant="new">NEW ARRIVAL</Badge>}
            {product.isBestSeller && <Badge variant="gold">BEST SELLER</Badge>}
            {product.stock <= 10 && product.stock > 0 && (
              <Badge variant="outline" className="border-orange-500/50 text-orange-400">Only {product.stock} left!</Badge>
            )}
          </div>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-display font-bold leading-snug mb-3">{product.name}</h1>

          {/* Brand + Category */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-muted-foreground">by <span className="text-foreground font-semibold">{product.brand}</span></span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span className="text-xs text-muted-foreground">{product.categoryName}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            <Link to="#reviews" onClick={() => setActiveTab("reviews")} className="text-xs text-gold hover:underline">
              Read {product.reviewCount.toLocaleString()} reviews
            </Link>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-end gap-3 mb-1">
              <span className="text-3xl font-display font-black text-gold-gradient">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through font-mono">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-sm text-emerald-400 font-mono">
                You save {formatPrice(product.originalPrice - product.price)} ({discount}%)
              </p>
            )}
          </div>

          {/* Short description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          {/* Quantity + Add to cart */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Quantity */}
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-secondary transition-colors font-bold text-lg">−</button>
              <span className="w-12 text-center font-mono text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-secondary transition-colors font-bold text-lg">+</button>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart} disabled={addingToCart || product.stock === 0}
              className={cn("flex-1 h-11 rounded-xl font-display font-bold text-sm transition-all",
                product.stock === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "btn-gold"
              )}>
              {addingToCart ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            {/* Wishlist */}
            <button onClick={() => toggle(product)}
              className={cn("w-11 h-11 rounded-xl border flex items-center justify-center transition-all",
                inWishlist ? "bg-red-500/10 border-red-500/50 text-red-500" : "border-border hover:border-gold/40 text-muted-foreground hover:text-gold")}>
              <svg className={cn("w-5 h-5", inWishlist && "fill-current")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[["🔒","Secure Payment"], ["🚀","Fast Delivery"], ["↩️","Easy Returns"]].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface-elevated border border-border text-center">
                <span className="text-lg">{icon}</span>
                <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs — description / specs / reviews */}
      <div id="reviews" className="mb-16">
        <div className="flex gap-1 border-b border-border mb-8">
          {["description", "specifications", "reviews"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("px-5 py-3 text-sm font-display font-semibold capitalize transition-colors border-b-2 -mb-[1px]",
                activeTab === tab ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {tab} {tab === "reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="max-w-2xl">
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === "specifications" && product.specs && (
          <div className="max-w-lg">
            <div className="rounded-xl border border-border overflow-hidden">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div key={key} className={cn("flex px-5 py-3 text-sm", i % 2 === 0 ? "bg-surface" : "bg-surface-elevated")}>
                  <span className="w-40 font-medium text-muted-foreground">{key}</span>
                  <span className="flex-1 text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-2xl space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
            ) : reviews.map((r) => (
              <div key={r.id} className="glass rounded-xl p-5 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-gold">{r.userName[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{r.userName}</span>
                        {r.verified && <span className="text-[10px] text-emerald-400 font-mono">✓ Verified</span>}
                      </div>
                      <StarRating rating={r.rating} showCount={false} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.slice(0, 6).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
