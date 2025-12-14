import { Link } from "react-router-dom";
import { Sprout, ShoppingCart, Truck, Shield } from "lucide-react";

const roles = [
  {
    id: "farmer",
    title: "ገበሬ",
    subtitle: "Farmer Kiosk",
    description: "List and sell your agricultural products",
    icon: Sprout,
    path: "/farmer",
    color: "bg-primary",
  },
  {
    id: "buyer",
    title: "Buyer",
    subtitle: "Marketplace",
    description: "Browse and purchase fresh produce",
    icon: ShoppingCart,
    path: "/buyer",
    color: "bg-accent",
  },
  {
    id: "delivery",
    title: "Delivery",
    subtitle: "Logistics Panel",
    description: "Manage and confirm deliveries",
    icon: Truck,
    path: "/delivery",
    color: "bg-success",
  },
  {
    id: "admin",
    title: "Admin",
    subtitle: "Control Center",
    description: "Oversee transactions and payments",
    icon: Shield,
    path: "/admin",
    color: "bg-foreground",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative container mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sprout className="w-4 h-4" />
              <span>Connected Agricultural Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              AGRI<span className="text-primary">LINK</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Connecting Ethiopian farmers to buyers with transparent pricing, reliable delivery, and secure payments.
            </p>
          </div>
        </div>
      </header>

      {/* Role Selection */}
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-center text-foreground mb-10">
          Select Your Role
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <Link
              key={role.id}
              to={role.path}
              className="group card-product p-6 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className={`${role.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-soft`}>
                <role.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-1 font-ethiopic">
                {role.title}
              </h3>
              <p className="text-sm font-medium text-primary mb-2">
                {role.subtitle}
              </p>
              <p className="text-muted-foreground text-sm">
                {role.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Enter Portal
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* How it works */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-soft">
          <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
            How AgriLink Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Farmer Lists", desc: "Farmers list produce with prices" },
              { step: "2", title: "Buyer Purchases", desc: "Buyers browse and order products" },
              { step: "3", title: "Delivery Confirms", desc: "Delivery agents fulfill orders" },
              { step: "4", title: "Admin Pays", desc: "Admin releases secure payments" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full gradient-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-muted-foreground">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2024 AgriLink — Empowering Ethiopian Agriculture</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
