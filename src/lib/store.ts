// Shared data store for AgriLink marketplace
import { create } from 'zustand';

export interface Product {
  id: string;
  nameAmharic: string;
  nameEnglish: string;
  image: string;
  avgPrice: number;
  unit: string;
}

export interface Listing {
  id: string;
  productId: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  quantity: number;
  pricePerUnit: number;
  createdAt: Date;
  status: 'available' | 'sold' | 'pending';
}

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerLocation: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'in-delivery' | 'delivered' | 'completed';
  createdAt: Date;
}

export interface Delivery {
  id: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  buyerId: string;
  buyerName: string;
  buyerLocation: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'in-transit' | 'delivered';
  createdAt: Date;
  deliveredAt?: Date;
}

export interface Farmer {
  id: string;
  name: string;
  location: string;
  pin: string;
  balance: number;
  totalSold: number;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
}

export const PRODUCTS: Product[] = [
  { id: '1', nameAmharic: 'ጤፍ', nameEnglish: 'Teff', image: '/teff.jpg', avgPrice: 4500, unit: 'ኩንታል' },
  { id: '2', nameAmharic: 'ቲማቲም', nameEnglish: 'Tomato', image: '/tomato.jpg', avgPrice: 1200, unit: 'ኪሎ' },
  { id: '3', nameAmharic: 'ሽንኩርት', nameEnglish: 'Onion', image: '/onion.jpg', avgPrice: 800, unit: 'ኪሎ' },
  { id: '4', nameAmharic: 'ድንች', nameEnglish: 'Potato', image: '/potato.jpg', avgPrice: 600, unit: 'ኪሎ' },
  { id: '5', nameAmharic: 'ሙዝ', nameEnglish: 'Banana', image: '/banana.jpg', avgPrice: 400, unit: 'ኪሎ' },
  { id: '6', nameAmharic: 'አቫካዶ', nameEnglish: 'Avocado', image: '/avocado.jpg', avgPrice: 350, unit: 'ኪሎ' },
];

interface AgriLinkStore {
  // Data
  farmers: Farmer[];
  listings: Listing[];
  orders: Order[];
  deliveries: Delivery[];
  auditLogs: AuditLog[];
  
  // Current session
  currentFarmer: Farmer | null;
  
  // Actions
  loginFarmer: (pin: string) => boolean;
  logoutFarmer: () => void;
  addListing: (productId: string, quantity: number, price: number) => void;
  purchaseProduct: (listingId: string, buyerName: string, buyerLocation: string, quantity: number) => void;
  confirmDelivery: (deliveryId: string) => void;
  releasePayment: (deliveryId: string) => void;
  addAuditLog: (action: string, details: string) => void;
}

export const useAgriLinkStore = create<AgriLinkStore>((set, get) => ({
  farmers: [
    { id: 'f1', name: 'አበበ ገብረ', location: 'ደብረ ብርሃን', pin: '1234', balance: 15000, totalSold: 45000 },
    { id: 'f2', name: 'ከበደ ታደሰ', location: 'ባህር ዳር', pin: '5678', balance: 22000, totalSold: 78000 },
    { id: 'f3', name: 'ማርታ ሀይሉ', location: 'ጎንደር', pin: '9012', balance: 8500, totalSold: 32000 },
  ],
  listings: [
    { id: 'l1', productId: '1', farmerId: 'f1', farmerName: 'አበበ ገብረ', farmerLocation: 'ደብረ ብርሃን', quantity: 50, pricePerUnit: 4600, createdAt: new Date(), status: 'available' },
    { id: 'l2', productId: '2', farmerId: 'f2', farmerName: 'ከበደ ታደሰ', farmerLocation: 'ባህር ዳር', quantity: 200, pricePerUnit: 1150, createdAt: new Date(), status: 'available' },
    { id: 'l3', productId: '5', farmerId: 'f3', farmerName: 'ማርታ ሀይሉ', farmerLocation: 'ጎንደር', quantity: 150, pricePerUnit: 420, createdAt: new Date(), status: 'available' },
    { id: 'l4', productId: '3', farmerId: 'f1', farmerName: 'አበበ ገብረ', farmerLocation: 'ደብረ ብርሃን', quantity: 100, pricePerUnit: 780, createdAt: new Date(), status: 'available' },
    { id: 'l5', productId: '6', farmerId: 'f2', farmerName: 'ከበደ ታደሰ', farmerLocation: 'ባህር ዳር', quantity: 80, pricePerUnit: 360, createdAt: new Date(), status: 'available' },
  ],
  orders: [],
  deliveries: [
    { id: 'd1', orderId: 'o0', farmerId: 'f1', farmerName: 'አበበ ገብረ', farmerLocation: 'ደብረ ብርሃን', buyerId: 'b1', buyerName: 'Ethio Foods Ltd', buyerLocation: 'Addis Ababa', productName: 'Teff', quantity: 10, status: 'pending', createdAt: new Date(Date.now() - 86400000) },
    { id: 'd2', orderId: 'o00', farmerId: 'f2', farmerName: 'ከበደ ታደሰ', farmerLocation: 'ባህር ዳር', buyerId: 'b2', buyerName: 'Fresh Market', buyerLocation: 'Hawassa', productName: 'Tomato', quantity: 50, status: 'pending', createdAt: new Date(Date.now() - 172800000) },
  ],
  auditLogs: [],
  currentFarmer: null,

  loginFarmer: (pin) => {
    const farmer = get().farmers.find(f => f.pin === pin);
    if (farmer) {
      set({ currentFarmer: farmer });
      get().addAuditLog('Farmer Login', `${farmer.name} logged in`);
      return true;
    }
    return false;
  },

  logoutFarmer: () => {
    const farmer = get().currentFarmer;
    if (farmer) {
      get().addAuditLog('Farmer Logout', `${farmer.name} logged out`);
    }
    set({ currentFarmer: null });
  },

  addListing: (productId, quantity, price) => {
    const farmer = get().currentFarmer;
    if (!farmer) return;
    
    const product = PRODUCTS.find(p => p.id === productId);
    const newListing: Listing = {
      id: `l${Date.now()}`,
      productId,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerLocation: farmer.location,
      quantity,
      pricePerUnit: price,
      createdAt: new Date(),
      status: 'available',
    };
    
    set(state => ({ listings: [...state.listings, newListing] }));
    get().addAuditLog('New Listing', `${farmer.name} listed ${quantity} ${product?.nameEnglish} at ${price} ETB`);
  },

  purchaseProduct: (listingId, buyerName, buyerLocation, quantity) => {
    const listing = get().listings.find(l => l.id === listingId);
    if (!listing) return;

    const product = PRODUCTS.find(p => p.id === listing.productId);
    const orderId = `o${Date.now()}`;
    const deliveryId = `d${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      listingId,
      buyerId: `b${Date.now()}`,
      buyerName,
      buyerLocation,
      quantity,
      totalPrice: quantity * listing.pricePerUnit,
      status: 'pending',
      createdAt: new Date(),
    };

    const newDelivery: Delivery = {
      id: deliveryId,
      orderId,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      farmerLocation: listing.farmerLocation,
      buyerId: newOrder.buyerId,
      buyerName,
      buyerLocation,
      productName: product?.nameEnglish || '',
      quantity,
      status: 'pending',
      createdAt: new Date(),
    };

    set(state => ({
      orders: [...state.orders, newOrder],
      deliveries: [...state.deliveries, newDelivery],
      listings: state.listings.map(l => 
        l.id === listingId 
          ? { ...l, quantity: l.quantity - quantity, status: l.quantity - quantity <= 0 ? 'sold' : l.status }
          : l
      ),
    }));

    get().addAuditLog('New Order', `${buyerName} ordered ${quantity} ${product?.nameEnglish} from ${listing.farmerName}`);
  },

  confirmDelivery: (deliveryId) => {
    set(state => ({
      deliveries: state.deliveries.map(d =>
        d.id === deliveryId ? { ...d, status: 'delivered', deliveredAt: new Date() } : d
      ),
      orders: state.orders.map(o => {
        const delivery = state.deliveries.find(d => d.id === deliveryId);
        return o.id === delivery?.orderId ? { ...o, status: 'delivered' } : o;
      }),
    }));
    
    const delivery = get().deliveries.find(d => d.id === deliveryId);
    get().addAuditLog('Delivery Confirmed', `Delivery ${deliveryId} to ${delivery?.buyerName} confirmed`);
  },

  releasePayment: (deliveryId) => {
    const delivery = get().deliveries.find(d => d.id === deliveryId);
    const order = get().orders.find(o => o.id === delivery?.orderId);
    
    if (!delivery || !order) return;

    set(state => ({
      farmers: state.farmers.map(f =>
        f.id === delivery.farmerId
          ? { ...f, balance: f.balance + order.totalPrice, totalSold: f.totalSold + order.totalPrice }
          : f
      ),
      orders: state.orders.map(o =>
        o.id === order.id ? { ...o, status: 'completed' } : o
      ),
    }));

    get().addAuditLog('Payment Released', `${order.totalPrice} ETB released to ${delivery.farmerName}`);
  },

  addAuditLog: (action, details) => {
    const log: AuditLog = {
      id: `log${Date.now()}`,
      action,
      details,
      timestamp: new Date(),
    };
    set(state => ({ auditLogs: [log, ...state.auditLogs].slice(0, 100) }));
  },
}));
