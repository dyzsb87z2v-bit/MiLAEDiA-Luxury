export type ProductStatus = 'available' | 'reserved' | 'sold' | 'made-to-order';

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  era: string;
  material: string;
  weavingType: string;
  dimensions: string;
  origin: string;
  price: number;
  salePrice?: number;
  currency: string;
  stock: number;
  featured: boolean;
  image: string;
  images: { src: string; alt: string }[];
  accent: string;
  description: string;
  status: ProductStatus;
};

export const normalizeProduct = (product: Product): Product => ({
  ...product,
  stock: product.status === 'available' ? 1 : 0,
});

export const canAcquireProduct = (product: Product) =>
  product.status === 'available' && product.stock === 1;

export const products: Product[] = [
  { id: 'p1', slug: 'the-crimson-garden', name: 'The Crimson Garden', category: 'Rugs', collection: 'antique-rugs', era: 'Qajar period, c. 1890', material: 'Wool on cotton', weavingType: 'Hand-knotted (Asymmetrical)', dimensions: '298 × 198 cm', origin: 'Kerman, Iran', price: 14800, currency: 'EUR', stock: 1, featured: true, image: '/assets/09_antique_rug.png', images: [{src: '/assets/09_antique_rug.png', alt: 'The Crimson Garden rug detail'}], accent: '#7B311D', description: 'A quietly theatrical Kerman carpet, its garden of cypress and flowering medallions softened by a century of gentle wear.', status: 'available' },
  { id: 'p2', slug: 'moon-over-yazd', name: 'Moon Over Yazd', category: 'Rugs', collection: 'handwoven-silk-rugs', era: 'Contemporary, 2023', material: 'Handspun silk', weavingType: 'Hand-knotted (Asymmetrical)', dimensions: '246 × 174 cm', origin: 'Yazd, Iran', price: 9200, currency: 'EUR', stock: 1, featured: true, image: '/assets/10_handwoven_silk_rug.png', images: [{src: '/assets/10_handwoven_silk_rug.png', alt: 'Moon Over Yazd rug detail'}], accent: '#344E7D', description: 'Fine silk knots carry a midnight field of cobalt, ivory and old gold. A luminous piece with an unusually soft hand.', status: 'available' },
  { id: 'p3', slug: 'house-of-pomegranate', name: 'House of Pomegranate', category: 'Rugs', collection: 'luxury-rugs', era: 'Contemporary, 2024', material: 'Wool & silk', weavingType: 'Hand-knotted', dimensions: '310 × 210 cm', origin: 'Tabriz, Iran', price: 11750, currency: 'EUR', stock: 1, featured: false, image: '/assets/11_luxury_rug.png', images: [{src: '/assets/11_luxury_rug.png', alt: 'House of Pomegranate rug detail'}], accent: '#8D5E37', description: 'A modern reading of a Persian garden: mineral grounds, pomegranate red and an intricate silk outline that catches the light.', status: 'reserved' },
  { id: 'p4', slug: 'the-silk-procession', name: 'The Silk Procession', category: 'Tapestries', collection: 'antique-silk-tapestries', era: 'Safavid revival, c. 1910', material: 'Silk on silk', weavingType: 'Hand-woven', dimensions: '182 × 128 cm', origin: 'Isfahan, Iran', price: 16800, currency: 'EUR', stock: 0, featured: false, image: '/assets/12_antique_silk_tapestry.png', images: [{src: '/assets/12_antique_silk_tapestry.png', alt: 'The Silk Procession tapestry detail'}], accent: '#B99763', description: 'A narrative silk tapestry in a warm, patinated palette. Figures, birds and cypress trees drift across the surface like a remembered story.', status: 'sold' },
  { id: 'p5', slug: 'figures-in-the-rose-room', name: 'Figures in the Rose Room', category: 'Tapestries', collection: 'luxury-silk-tapestries', era: 'Contemporary, 2022', material: 'Silk & metallic thread', weavingType: 'Hand-woven', dimensions: '205 × 140 cm', origin: 'Tehran, Iran', price: 12400, currency: 'EUR', stock: 0, featured: true, image: '/assets/13_luxury_silk_tapestry.png', images: [{src: '/assets/13_luxury_silk_tapestry.png', alt: 'Figures in the Rose Room tapestry detail'}], accent: '#C9C7C3', description: 'A small-scale tapestry with a cinematic hush: rose, smoke and pale thread set against an almost black ground.', status: 'made-to-order' },
];

export const collections = [
  { slug: 'antique-rugs', title: 'Antique Rugs', subtitle: 'Time made visible', image: '/assets/09_antique_rug.png', intro: 'Pieces with a lived-in soul, selected for the marks of hands, rooms and generations.' },
  { slug: 'handwoven-rugs', title: 'Handwoven Rugs', subtitle: 'Traditional craft', image: '/assets/02_hero_persian_rug.png', intro: 'Handwoven rugs crafted in traditional ateliers.' },
  { slug: 'handwoven-silk-rugs', title: 'Handwoven Silk Rugs', subtitle: 'Light, knotted', image: '/assets/10_handwoven_silk_rug.png', intro: 'Silk carpets with a rare clarity of colour and a presence that changes through the day.' },
  { slug: 'luxury-rugs', title: 'Luxury Rugs', subtitle: 'A room begins here', image: '/assets/11_luxury_rug.png', intro: 'Contemporary Persian rugs for interiors that prefer nuance to noise.' },
  { slug: 'handmade-rugs', title: 'Handmade Rugs', subtitle: 'Woven by hand', image: '/assets/06_gallery_luxury_rug_room.png', intro: 'Classic handmade rugs emphasizing natural materials.' },
  { slug: 'machine-made-luxury-rugs', title: 'Machine-made Luxury Rugs', subtitle: 'Precision crafted', image: '/assets/11_luxury_rug.png', intro: 'High-density machine-woven pieces bringing complex designs to life.' },
  { slug: 'persian-rugs', title: 'Persian Rugs', subtitle: 'Cultural heritage', image: '/assets/02_hero_persian_rug.png', intro: 'The quintessential woven art of Iran.' },
  { slug: 'silk-tapestries', title: 'Silk Tapestries', subtitle: 'Thread as paint', image: '/assets/13_luxury_silk_tapestry.png', intro: 'Wall pieces woven entirely in silk.' },
  { slug: 'antique-silk-tapestries', title: 'Antique Silk Tapestries', subtitle: 'Stories in thread', image: '/assets/12_antique_silk_tapestry.png', intro: 'Decorative histories preserved in silk, gathered from private European collections.' },
  { slug: 'modern-luxury-rugs', title: 'Modern Luxury Rugs', subtitle: 'Contemporary vision', image: '/assets/11_luxury_rug.png', intro: 'New abstractions and reduced palettes for modern spaces.' },
  { slug: 'custom-rugs', title: 'Custom Rugs', subtitle: 'Your specification', image: '/assets/06_gallery_luxury_rug_room.png', intro: 'Bespoke commissions woven to order.' },
  { slug: 'personalized-rugs', title: 'Personalized Rugs', subtitle: 'Unique variations', image: '/assets/10_handwoven_silk_rug.png', intro: 'Adaptations of archival pieces for specific rooms.' },
];

export const galleryImages = [
  { id: 'g1', src: '/assets/06_gallery_luxury_rug_room.png', title: 'A field of memory', note: 'Rug detail, Kerman', width: 800, height: 600 },
  { id: 'g2', src: '/assets/03_hero_weaving_woman.png', title: 'At the loom', note: 'Weaving study', width: 600, height: 800 },
  { id: 'g3', src: '/assets/04_workshop_weaving_woman.png', title: 'Berlin at dusk', note: 'Window view, Mitte', width: 800, height: 1000 },
  { id: 'g4', src: '/assets/05_folded_silk_rugs.png', title: 'Two cities, one thread', note: 'Interior study', width: 1000, height: 800 },
  { id: 'g5', src: '/assets/14_luxury_lamp.png', title: 'Warm light', note: 'Private interior', width: 600, height: 600 },
  { id: 'g6', src: '/assets/15_luxury_armchair.png', title: 'The reading room', note: 'Private interior', width: 800, height: 600 },
];

export const money = (value: number, currency: string = 'EUR') => new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
