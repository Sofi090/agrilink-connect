import { useState } from "react";
import { useAgriLinkStore } from "@/lib/store";
import { Link } from "react-router-dom";
import { ArrowLeft, Truck, MapPin, Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const DeliveryPage = () => {
  const { deliveries, confirmDelivery } = useAgriLinkStore();
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const pendingDeliveries = deliveries.filter(d => d.status === "pending" || d.status === "in-transit");
  const completedDeliveries = deliveries.filter(d => d.status === "delivered");

  const handleConfirmDelivery = () => {
    if (confirmId !== selectedDelivery) {
      toast.error("Delivery ID does not match");
      return;
    }
    confirmDelivery(selectedDelivery!);
    toast.success("Delivery confirmed successfully!");
    setShowConfirmDialog(false);
    setSelectedDelivery(null);
    setConfirmId("");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-success text-success-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Delivery Panel</h1>
              <p className="text-success-foreground/80">AgriLink Logistics</p>
            </div>
            <Truck className="w-10 h-10 opacity-50" />
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending", value: pendingDeliveries.length, icon: Clock, color: "bg-warning" },
            { label: "Completed", value: completedDeliveries.length, icon: CheckCircle2, color: "bg-success" },
            { label: "Total", value: deliveries.length, icon: Package, color: "bg-primary" },
          ].map((stat, i) => (
            <div key={i} className="bg-card rounded-xl p-4 shadow-soft border border-border animate-fade-in" style={{ animationDelay: `${0.1 * i}s` }}>
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Deliveries */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-warning" />
          Pending Deliveries
        </h2>

        {pendingDeliveries.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No pending deliveries</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingDeliveries.map((delivery, index) => (
              <div
                key={delivery.id}
                className="bg-card rounded-xl border border-border p-5 animate-slide-in"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                        {delivery.id}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        delivery.status === "pending" ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                      }`}>
                        {delivery.status === "pending" ? "Awaiting Pickup" : "In Transit"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{delivery.productName}</h3>
                    <p className="text-muted-foreground">{delivery.quantity} units</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDate(delivery.createdAt)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Pickup
                    </p>
                    <p className="font-medium text-foreground font-ethiopic">{delivery.farmerName}</p>
                    <p className="text-sm text-muted-foreground">{delivery.farmerLocation}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Drop-off
                    </p>
                    <p className="font-medium text-foreground">{delivery.buyerName}</p>
                    <p className="text-sm text-muted-foreground">{delivery.buyerLocation}</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => {
                    setSelectedDelivery(delivery.id);
                    setShowConfirmDialog(true);
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Completed Deliveries */}
        {completedDeliveries.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-foreground mt-10 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Completed Deliveries
            </h2>

            <div className="space-y-3">
              {completedDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="bg-card rounded-xl border border-border p-4 opacity-70"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium text-foreground">{delivery.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.farmerLocation} → {delivery.buyerLocation}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{delivery.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Confirm Delivery
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Please enter the Delivery ID to confirm this delivery has been completed.
            </p>
            
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Delivery ID</p>
              <p className="font-mono font-medium text-foreground">{selectedDelivery}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Enter Delivery ID to Confirm
              </label>
              <Input
                placeholder="e.g., d1234567890"
                value={confirmId}
                onChange={(e) => setConfirmId(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-success hover:bg-success/90 text-success-foreground"
              onClick={handleConfirmDelivery}
              disabled={confirmId !== selectedDelivery}
            >
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryPage;
