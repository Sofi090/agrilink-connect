import { useState } from "react";
import { useAgriLinkStore, PRODUCTS } from "@/lib/store";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Users,
  Package,
  Truck,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const AdminPage = () => {
  const { farmers, listings, orders, deliveries, auditLogs, releasePayment } = useAgriLinkStore();
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const pendingPayments = deliveries.filter(d => d.status === "delivered");
  const pendingDeliveries = deliveries.filter(d => d.status === "pending" || d.status === "in-transit");
  const activeListings = listings.filter(l => l.status === "available");

  const handleReleasePayment = () => {
    if (!selectedDelivery) return;
    releasePayment(selectedDelivery);
    toast.success("Payment released to farmer!");
    setShowPaymentDialog(false);
    setSelectedDelivery(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderForDelivery = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-background/70">AgriLink Control Center</p>
            </div>
            <Shield className="w-10 h-10 opacity-50" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 -mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Farmers", value: farmers.length, icon: Users, color: "bg-primary" },
            { label: "Active Listings", value: activeListings.length, icon: Package, color: "bg-accent" },
            { label: "Pending Deliveries", value: pendingDeliveries.length, icon: Truck, color: "bg-warning" },
            { label: "Awaiting Payment", value: pendingPayments.length, icon: DollarSign, color: "bg-success" },
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="bg-muted p-1 rounded-xl">
            <TabsTrigger value="payments" className="rounded-lg">
              <DollarSign className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="farmers" className="rounded-lg">
              <Users className="w-4 h-4 mr-2" />
              Farmers
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="audit" className="rounded-lg">
              <History className="w-4 h-4 mr-2" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Payment Control</h2>
              <span className="text-sm text-muted-foreground">
                {pendingPayments.length} pending release
              </span>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">All payments have been released</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPayments.map((delivery) => {
                  const order = getOrderForDelivery(delivery.orderId);
                  return (
                    <div
                      key={delivery.id}
                      className="bg-success/10 border-2 border-success/30 rounded-xl p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium text-success">Delivery Confirmed</span>
                        <span className="text-xs font-mono text-muted-foreground ml-auto">
                          {delivery.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Farmer</p>
                          <p className="font-medium text-foreground font-ethiopic">{delivery.farmerName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Buyer</p>
                          <p className="font-medium text-foreground">{delivery.buyerName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Product</p>
                          <p className="font-medium text-foreground">{delivery.productName} × {delivery.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-bold text-primary text-lg">
                            {order?.totalPrice.toLocaleString()} ETB
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() => {
                            setSelectedDelivery(delivery.id);
                            setShowPaymentDialog(true);
                          }}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Release Payment
                        </Button>
                        <Button variant="outline">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Flag Issue
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pending Deliveries */}
            <h3 className="text-lg font-semibold text-foreground mt-8 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Awaiting Delivery Confirmation
            </h3>
            
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Farmer</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Buyer</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Product</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {pendingDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="border-t border-border">
                      <td className="p-3 font-mono text-sm text-muted-foreground">{delivery.id}</td>
                      <td className="p-3 font-ethiopic">{delivery.farmerName}</td>
                      <td className="p-3">{delivery.buyerName}</td>
                      <td className="p-3">{delivery.productName}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                  {pendingDeliveries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground">
                        No pending deliveries
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Farmer Management</h2>
            
            <div className="grid gap-4">
              {farmers.map((farmer) => (
                <div key={farmer.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground font-ethiopic">{farmer.name}</h3>
                        <p className="text-sm text-muted-foreground">{farmer.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{farmer.balance.toLocaleString()} ETB</p>
                      <p className="text-xs text-muted-foreground">Balance</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Sold</p>
                      <p className="font-medium text-foreground">{farmer.totalSold.toLocaleString()} ETB</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Listings</p>
                      <p className="font-medium text-foreground">
                        {listings.filter(l => l.farmerId === farmer.id && l.status === "available").length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">All Orders</h2>
            
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Buyer</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-border">
                      <td className="p-3 font-mono text-sm">{order.id}</td>
                      <td className="p-3">{order.buyerName}</td>
                      <td className="p-3 font-medium">{order.totalPrice.toLocaleString()} ETB</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          order.status === "completed" ? "bg-success/20 text-success" :
                          order.status === "delivered" ? "bg-primary/20 text-primary" :
                          "bg-warning/20 text-warning"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground text-sm">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Audit Log</h2>
            
            <div className="space-y-2">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No activity yet</p>
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="bg-card rounded-lg border border-border p-4 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{log.action}</p>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              Confirm Payment Release
            </DialogTitle>
          </DialogHeader>
          
          {selectedDelivery && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You are about to release payment to the farmer for this completed delivery.
              </p>
              
              {(() => {
                const delivery = deliveries.find(d => d.id === selectedDelivery);
                const order = delivery ? getOrderForDelivery(delivery.orderId) : null;
                return delivery && order ? (
                  <div className="bg-muted rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Farmer</span>
                      <span className="font-medium font-ethiopic">{delivery.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product</span>
                      <span className="font-medium">{delivery.productName}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">Amount to Release</span>
                      <span className="font-bold text-primary text-lg">{order.totalPrice.toLocaleString()} ETB</span>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-success hover:bg-success/90 text-success-foreground"
              onClick={handleReleasePayment}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Release Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
