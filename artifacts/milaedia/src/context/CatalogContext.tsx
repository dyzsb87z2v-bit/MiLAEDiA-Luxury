import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { products as initialProducts, collections as initialCollections, galleryImages as initialGallery, normalizeProduct, Product } from '../data/catalog';

export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  intro: string;
};

export type Order = {
  id: string;
  customerName: string;
  email: string;
  address: string;
  date: string;
  total: number;
  paymentStatus: 'MOCK / NOT PROCESSED' | 'PAID' | 'REFUNDED';
  status: 'NEW' | 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  items: { id: string; qty: number }[];
};

export type CustomOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  rugType: string;
  dimensions: string;
  colorDirection: string;
  pattern: string;
  requirements: string;
  referenceImage?: string;
  date: string;
  status: 'NEW' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'IN PRODUCTION' | 'COMPLETED';
};

export type GalleryImage = {
  id: string;
  src: string;
  title: string;
  note: string;
  width?: number;
  height?: number;
};

type CatalogContextType = {
  products: Product[];
  collections: Collection[];
  orders: Order[];
  customOrders: CustomOrder[];
  gallery: GalleryImage[];
  updateProduct: (id: string, product: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  addOrder: (order: Order) => void;
  updateCustomOrder: (id: string, order: Partial<CustomOrder>) => void;
  addCustomOrder: (order: CustomOrder) => void;
  updateGallery: (images: GalleryImage[]) => void;
  updateCollections: (newCollections: Collection[]) => void;
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('milaedia-products');
      if (saved) {
        return (JSON.parse(saved) as Product[]).map((product) => {
          const seed = initialProducts.find((item) => item.id === product.id);
          return normalizeProduct({
            ...seed,
            ...product,
            images: product.images ?? seed?.images ?? [{ src: product.image, alt: product.name }],
            category: product.category ?? seed?.category ?? 'Available on request',
            currency: product.currency ?? seed?.currency ?? 'EUR',
            weavingType: product.weavingType ?? seed?.weavingType ?? 'Available on request',
            featured: product.featured ?? seed?.featured ?? false,
            stock: product.stock ?? (product.status === 'available' ? 1 : 0),
          } as Product);
        });
      }
    } catch (e) {}
    return initialProducts;
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const saved = localStorage.getItem('milaedia-collections');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialCollections;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('milaedia-orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(() => {
    try {
      const saved = localStorage.getItem('milaedia-custom-orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [gallery, setGallery] = useState<GalleryImage[]>(() => {
    try {
      const saved = localStorage.getItem('milaedia-gallery');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialGallery;
  });

  useEffect(() => {
    localStorage.setItem('milaedia-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('milaedia-collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('milaedia-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('milaedia-custom-orders', JSON.stringify(customOrders));
  }, [customOrders]);

  useEffect(() => {
    localStorage.setItem('milaedia-gallery', JSON.stringify(gallery));
  }, [gallery]);

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? normalizeProduct({ ...p, ...product }) : p)));
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [normalizeProduct(product), ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrder = (id: string, order: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...order } : o)));
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateCustomOrder = (id: string, order: Partial<CustomOrder>) => {
    setCustomOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...order } : o)));
  };

  const addCustomOrder = (order: CustomOrder) => {
    setCustomOrders((prev) => [order, ...prev]);
  };

  const updateGallery = (images: GalleryImage[]) => {
    setGallery(images);
  };
  
  const updateCollections = (newCollections: Collection[]) => {
    setCollections(newCollections);
  }

  return (
    <CatalogContext.Provider
      value={{
        products,
        collections,
        orders,
        customOrders,
        gallery,
        updateProduct,
        addProduct,
        deleteProduct,
        updateOrder,
        addOrder,
        updateCustomOrder,
        addCustomOrder,
        updateGallery,
        updateCollections,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}