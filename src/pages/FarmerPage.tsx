import { useState } from "react";
import { useAgriLinkStore, PRODUCTS } from "@/lib/store";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

type Screen = "login" | "menu" | "sell" | "sell-details" | "balance" | "news";

const FarmerPage = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [pin, setPin] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  
  const { loginFarmer, logoutFarmer, currentFarmer, addListing, listings, farmers } = useAgriLinkStore();

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          if (loginFarmer(newPin)) {
            setScreen("menu");
            setPin("");
          } else {
            toast.error("የተሳሳተ የይለፍ ቃል");
            setPin("");
          }
        }, 300);
      }
    }
  };

  const handleClear = () => setPin("");
  
  const handleBack = () => {
    if (screen === "sell-details") setScreen("sell");
    else if (screen !== "menu") setScreen("menu");
    else {
      logoutFarmer();
      setScreen("login");
    }
  };

  const handleConfirmListing = () => {
    if (!selectedProduct || !quantity || !price) return;
    addListing(selectedProduct, parseFloat(quantity), parseFloat(price));
    toast.success("ምርትዎ ተመዝግቧል!");
    setSelectedProduct(null);
    setQuantity("");
    setPrice("");
    setScreen("menu");
  };

  // Get current farmer's updated balance
  const farmerData = currentFarmer ? farmers.find(f => f.id === currentFarmer.id) : null;

  // Calculate product demand (mock)
  const productDemand = PRODUCTS.map(p => ({
    ...p,
    demand: listings.filter(l => l.productId === p.id && l.status === 'available').length * 10 + Math.floor(Math.random() * 50)
  })).sort((a, b) => b.demand - a.demand);

  return (
    <div className="min-h-screen bg-primary flex flex-col font-ethiopic">
      {/* Header */}
      <header className="bg-foreground/10 p-4 flex items-center justify-between">
        {screen !== "login" && (
          <button onClick={handleBack} className="text-primary-foreground p-2 hover:bg-foreground/10 rounded-xl">
            <ArrowLeft className="w-8 h-8" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-primary-foreground text-center flex-1">
          AGRILINK
        </h1>
        <div className="w-12" />
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Login Screen */}
        {screen === "login" && (
          <div className="w-full max-w-md animate-scale-in">
            <h2 className="text-2xl text-primary-foreground text-center mb-8">
              የይለፍ ቃል
            </h2>
            
            {/* PIN Display */}
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-2xl border-4 ${
                    pin.length > i ? "bg-accent border-accent" : "border-primary-foreground/50"
                  } flex items-center justify-center transition-all`}
                >
                  {pin.length > i && <span className="text-3xl text-accent-foreground">●</span>}
                </div>
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "C"].map((key) => (
                <button
                  key={key}
                  onClick={() => key === "C" ? handleClear() : key && handlePinInput(key)}
                  disabled={!key}
                  className={`h-20 rounded-2xl text-3xl font-bold transition-all ${
                    key ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 active:scale-95" : ""
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
            
            <p className="text-primary-foreground/70 text-center mt-8 text-sm">
              Demo PINs: 1234, 5678, 9012
            </p>
          </div>
        )}

        {/* Main Menu */}
        {screen === "menu" && (
          <div className="w-full max-w-lg space-y-6 animate-fade-in">
            <p className="text-primary-foreground/80 text-center text-xl mb-8">
              እንኳን ደህና መጡ፣ {currentFarmer?.name}
            </p>
            
            {[
              { id: "sell", label: "መሸጥ", desc: "ምርትዎን ይሽጡ" },
              { id: "news", label: "ገበያ ዜና", desc: "የገበያ መረጃ" },
              { id: "balance", label: "ቀሪ ሂሳብ", desc: "የገንዘብ ሁኔታ" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setScreen(item.id as Screen)}
                className="w-full btn-atm bg-accent text-accent-foreground rounded-3xl flex flex-col items-center shadow-lg hover:shadow-xl animate-glow"
              >
                <span className="text-3xl">{item.label}</span>
                <span className="text-lg opacity-70">{item.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Sell - Product Selection */}
        {screen === "sell" && (
          <div className="w-full max-w-lg animate-fade-in">
            <h2 className="text-2xl text-primary-foreground text-center mb-6">
              የእርሻ ምርት ዓይነት
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product.id);
                    setPrice(product.avgPrice.toString());
                    setScreen("sell-details");
                  }}
                  className="bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-3xl p-6 text-center transition-all active:scale-95"
                >
                  <span className="text-4xl block mb-2">🌾</span>
                  <span className="text-2xl text-primary-foreground block">{product.nameAmharic}</span>
                  <span className="text-primary-foreground/70 text-lg">
                    ~{product.avgPrice} ብር/{product.unit}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sell - Details */}
        {screen === "sell-details" && selectedProduct && (
          <div className="w-full max-w-md animate-fade-in">
            <h2 className="text-2xl text-primary-foreground text-center mb-8">
              {PRODUCTS.find(p => p.id === selectedProduct)?.nameAmharic}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-primary-foreground text-xl block mb-3">መጠን</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-16 text-2xl text-center rounded-2xl bg-primary-foreground/20 text-primary-foreground border-2 border-primary-foreground/30 focus:border-accent outline-none"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="text-primary-foreground text-xl block mb-3">ዋጋ (ብር)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-16 text-2xl text-center rounded-2xl bg-primary-foreground/20 text-primary-foreground border-2 border-primary-foreground/30 focus:border-accent outline-none"
                  placeholder="0"
                />
              </div>
              
              <button
                onClick={handleConfirmListing}
                disabled={!quantity || !price}
                className="w-full btn-atm bg-accent text-accent-foreground rounded-3xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Check className="w-8 h-8" />
                <span>አረጋግጥ</span>
              </button>
            </div>
          </div>
        )}

        {/* Balance */}
        {screen === "balance" && (
          <div className="w-full max-w-md text-center animate-fade-in">
            <h2 className="text-2xl text-primary-foreground mb-10">ቀሪ ሂሳብ</h2>
            
            <div className="bg-primary-foreground/20 rounded-3xl p-8 mb-6">
              <p className="text-primary-foreground/70 text-xl mb-2">አሁን ያለ ሂሳብ</p>
              <p className="text-5xl font-bold text-accent">
                {farmerData?.balance.toLocaleString()} <span className="text-2xl">ብር</span>
              </p>
            </div>
            
            <div className="bg-primary-foreground/10 rounded-3xl p-8">
              <p className="text-primary-foreground/70 text-xl mb-2">እስከ አሁን ተሽጧል</p>
              <p className="text-4xl font-bold text-primary-foreground">
                {farmerData?.totalSold.toLocaleString()} <span className="text-xl">ብር</span>
              </p>
            </div>
          </div>
        )}

        {/* Market News */}
        {screen === "news" && (
          <div className="w-full max-w-lg animate-fade-in overflow-auto max-h-[70vh]">
            <h2 className="text-2xl text-primary-foreground text-center mb-6">ገበያ ዜና</h2>
            
            {/* Top Products */}
            <div className="bg-primary-foreground/20 rounded-3xl p-6 mb-6">
              <h3 className="text-xl text-primary-foreground mb-4">በጣም ታዋቂ ምርት</h3>
              {productDemand.slice(0, 3).map((product, i) => (
                <div key={product.id} className="flex items-center gap-4 py-3 border-b border-primary-foreground/10 last:border-0">
                  <span className="text-3xl font-bold text-accent">{i + 1}</span>
                  <span className="text-xl text-primary-foreground flex-1">{product.nameAmharic}</span>
                  <span className="text-primary-foreground/70">{product.demand} ጥያቄ</span>
                </div>
              ))}
            </div>
            
            {/* All Prices */}
            <div className="bg-primary-foreground/20 rounded-3xl p-6">
              <h3 className="text-xl text-primary-foreground mb-4">የገበያ ዋጋዎች</h3>
              {PRODUCTS.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-primary-foreground/10 last:border-0">
                  <span className="text-xl text-primary-foreground">{product.nameAmharic}</span>
                  <span className="text-lg text-accent">
                    {product.avgPrice} ብር/{product.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerPage;
