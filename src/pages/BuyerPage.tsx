import { useState } from "react";
import { useAgriLinkStore, PRODUCTS } from "@/lib/store";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, ShoppingCart, X, Plus, Minus, Check, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BuyerPage = () => {
  const { listings, purchaseProduct } = useAgriLinkStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");

  const availableListings = listings.filter(l => l.status === "available" && l.quantity > 0);
  
  const filteredListings = availableListings.filter(l => {
    const product = PRODUCTS.find(p => p.id === l.productId);
    return product?.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product?.nameAmharic.includes(searchQuery) ||
           l.farmerName.includes(searchQuery);
  });

  const currentListing = listings.find(l => l.id === selectedListing);
  const currentProduct = currentListing ? PRODUCTS.find(p => p.id === currentListing.productId) : null;

  const handlePurchase = () => {
    if (!selectedListing || !buyerName || !buyerLocation) return;
    purchaseProduct(selectedListing, buyerName, buyerLocation, quantity);
    toast.success("Order placed successfully! Delivery will be arranged.");
    setShowCheckout(false);
    setSelectedListing(null);
    setQuantity(1);
    setBuyerName("");
    setBuyerLocation("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold text-xl">AGRI<span className="text-primary">LINK</span></span>
            </Link>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fresh Marketplace</h1>
            <p className="text-muted-foreground">{filteredListings.length} products available</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing, index) => {
            const product = PRODUCTS.find(p => p.id === listing.productId);
            if (!product) return null;

            return (
              <div
                key={listing.id}
                className="card-product overflow-hidden group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${0.05 * index}s` }}
                onClick={() => setSelectedListing(listing.id)}
              >
                <div className="aspect-square bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-7xl">
                    {product.id === "1" ? "🌾" : product.id === "2" ? "🍅" : product.id === "3" ? "🧅" : product.id === "4" ? "🥔" : product.id === "5" ? "🍌" : "🥑"}
                  </div>
                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                    {listing.quantity} {product.unit}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{product.nameEnglish}</h3>
                      <p className="text-sm text-muted-foreground font-ethiopic">{product.nameAmharic}</p>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {listing.pricePerUnit.toLocaleString()} <span className="text-xs font-normal">ETB</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
                    <MapPin className="w-3 h-3" />
                    <span>{listing.farmerLocation}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-ethiopic">{listing.farmerName}</p>
                  
                  <Button className="w-full mt-4 gradient-primary text-primary-foreground" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedListing && !showCheckout} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="max-w-lg">
          {currentListing && currentProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-3xl">
                    {currentProduct.id === "1" ? "🌾" : currentProduct.id === "2" ? "🍅" : currentProduct.id === "3" ? "🧅" : currentProduct.id === "4" ? "🥔" : currentProduct.id === "5" ? "🍌" : "🥑"}
                  </span>
                  {currentProduct.nameEnglish}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-xl flex items-center justify-center text-8xl">
                  {currentProduct.id === "1" ? "🌾" : currentProduct.id === "2" ? "🍅" : currentProduct.id === "3" ? "🧅" : currentProduct.id === "4" ? "🥔" : currentProduct.id === "5" ? "🍌" : "🥑"}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {currentListing.pricePerUnit.toLocaleString()} ETB
                      <span className="text-sm font-normal text-muted-foreground">/{currentProduct.unit}</span>
                    </p>
                    <p className="text-muted-foreground">{currentListing.quantity} {currentProduct.unit} available</p>
                  </div>
                </div>
                
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Seller Information</p>
                  <p className="font-ethiopic text-foreground">{currentListing.farmerName}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {currentListing.farmerLocation}
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
                  <p className="font-medium">Quantity</p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(currentListing.quantity, quantity + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {(quantity * currentListing.pricePerUnit).toLocaleString()} ETB
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="gradient-primary text-primary-foreground"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          
          {currentListing && currentProduct && (
            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-4 flex items-center gap-4">
                <span className="text-4xl">
                  {currentProduct.id === "1" ? "🌾" : currentProduct.id === "2" ? "🍅" : currentProduct.id === "3" ? "🧅" : currentProduct.id === "4" ? "🥔" : currentProduct.id === "5" ? "🍌" : "🥑"}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{currentProduct.nameEnglish} × {quantity}</p>
                  <p className="text-muted-foreground text-sm">From {currentListing.farmerName}</p>
                </div>
                <p className="font-bold text-lg">{(quantity * currentListing.pricePerUnit).toLocaleString()} ETB</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Your Name / Company</label>
                  <Input
                    placeholder="e.g., Ethio Foods Ltd"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Delivery Location</label>
                  <Input
                    placeholder="e.g., Addis Ababa"
                    value={buyerLocation}
                    onChange={(e) => setBuyerLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-accent/20 rounded-xl p-4 text-sm">
                <p className="font-medium text-foreground mb-1">Estimated Delivery</p>
                <p className="text-muted-foreground">2-3 business days from {currentListing.farmerLocation}</p>
              </div>
              
              <Button
                className="w-full gradient-primary text-primary-foreground"
                size="lg"
                onClick={handlePurchase}
                disabled={!buyerName || !buyerLocation}
              >
                <Check className="w-5 h-5 mr-2" />
                Confirm Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerPage;
