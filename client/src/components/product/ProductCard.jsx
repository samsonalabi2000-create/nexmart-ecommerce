import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice, formatDiscount, cn } from "@/lib/utils";
import { Badge, StarRating } from "@/components/ui/index";

export default function ProductCard({ product, className }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice ? formatDiscount(product.originalPrice, product.price) : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    await addItem(product, 1);
    setAddingToCart(false);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <div className={cn("product-card group", className)}>
      {/* Image area */}
      <div className="relative img-zoom aspect-[4/3] overflow-hidden bg-surface-elevated">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.images[imgIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
          />
        </Link>

        {/* Hover second image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && <Badge variant={product.badge}>{product.badge === "sale" ? `-${discount}%` : product.badge.toUpperCase()}</Badge>}
          {product.stock <= 10 && product.stock > 0 && (
            <Badge variant="outline" className="text-[10px] border-orange-500/50 text-orange-400">Only {product.stock} left</Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-300",
            inWishlist ? "bg-red-500/20 border-red-500/50" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <svg className={cn("w-4 h-4 transition-colors", inWishlist ? "text-red-500 fill-red-500" : "text-white")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Link to={`/products/${product.id}`}
            className="block w-full text-center py-2 glass border border-white/20 rounded-lg text-xs font-semibold text-white hover:bg-white/20 transition-colors">
            Quick View
          </Link>
        </div>
      </div>

      {/* Info area */}
      <div className="p-4">
        {/* Category */}
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">{product.categoryName}</p>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-display font-semibold text-foreground hover:text-gold transition-colors line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-display font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-muted-foreground line-through font-mono">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-xs font-mono text-emerald-400">Save {formatPrice(product.originalPrice - product.price)}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock === 0}
          className={cn(
            "mt-3 w-full h-9 rounded-lg text-xs font-display font-semibold transition-all duration-300",
            product.stock === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "btn-gold hover:shadow-lg hover:shadow-gold/20"
          )}
        >
          {addingToCart ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Adding...
            </span>
          ) : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
