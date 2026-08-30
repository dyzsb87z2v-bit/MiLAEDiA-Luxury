export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  era: string;
  material: string;
  dimensions: string;
  origin: string;
  price: number;
  image: string;
  accent: string;
  description: string;
  available: boolean;
};

export const products: Product[] = [
  { id: 'p1', slug: 'the-crimson-garden', name: 'The Crimson Garden', collection: 'antique-rugs', era: 'Qajar period, c. 1890', material: 'Wool on cotton', dimensions: '298 × 198 cm', origin: 'Kerman, Iran', price: 14800, image: '/assets/09_antique_rug.png', accent: '#7B311D', description: 'A quietly theatrical Kerman carpet, its garden of cypress and flowering medallions softened by a century of gentle wear.', available: true },
  { id: 'p2', slug: 'moon-over-yazd', name: 'Moon Over Yazd', collection: 'handwoven-silk-rugs', era: 'Contemporary, 2023', material: 'Handspun silk', dimensions: '246 × 174 cm', origin: 'Yazd, Iran', price: 9200, image: '/assets/10_handwoven_silk_rug.png', accent: '#344E7D', description: 'Fine silk knots carry a midnight field of cobalt, ivory and old gold. A luminous piece with an unusually soft hand.', available: true },
  { id: 'p3', slug: 'house-of-pomegranate', name: 'House of Pomegranate', collection: 'luxury-rugs', era: 'Contemporary, 2024', material: 'Wool & silk', dimensions: '310 × 210 cm', origin: 'Tabriz, Iran', price: 11750, image: '/assets/11_luxury_rug.png', accent: '#8D5E37', description: 'A modern reading of a Persian garden: mineral grounds, pomegranate red and an intricate silk outline that catches the light.', available: true },
  { id: 'p4', slug: 'the-silk-procession', name: 'The Silk Procession', collection: 'antique-silk-tapestries', era: 'Safavid revival, c. 1910', material: 'Silk on silk', dimensions: '182 × 128 cm', origin: 'Isfahan, Iran', price: 16800, image: '/assets/12_antique_silk_tapestry.png', accent: '#B99763', description: 'A narrative silk tapestry in a warm, patinated palette. Figures, birds and cypress trees drift across the surface like a remembered story.', available: true },
  { id: 'p5', slug: 'figures-in-the-rose-room', name: 'Figures in the Rose Room', collection: 'luxury-silk-tapestries', era: 'Contemporary, 2022', material: 'Silk & metallic thread', dimensions: '205 × 140 cm', origin: 'Tehran, Iran', price: 12400, image: '/assets/13_luxury_silk_tapestry.png', accent: '#C9C7C3', description: 'A small-scale tapestry with a cinematic hush: rose, smoke and pale thread set against an almost black ground.', available: true },
];

export const collections = [
  { slug: 'antique-rugs', title: 'Antique Rugs', subtitle: 'Time made visible', image: '/assets/09_antique_rug.png', intro: 'Pieces with a lived-in soul, selected for the marks of hands, rooms and generations.' },
  { slug: 'handwoven-silk-rugs', title: 'Handwoven Silk Rugs', subtitle: 'Light, knotted', image: '/assets/10_handwoven_silk_rug.png', intro: 'Silk carpets with a rare clarity of colour and a presence that changes through the day.' },
  { slug: 'luxury-rugs', title: 'Luxury Rugs', subtitle: 'A room begins here', image: '/assets/11_luxury_rug.png', intro: 'Contemporary Persian rugs for interiors that prefer nuance to noise.' },
  { slug: 'antique-silk-tapestries', title: 'Antique Silk Tapestries', subtitle: 'Stories in thread', image: '/assets/12_antique_silk_tapestry.png', intro: 'Decorative histories preserved in silk, gathered from private European collections.' },
  { slug: 'luxury-silk-tapestries', title: 'Luxury Silk Tapestries', subtitle: 'The wall as canvas', image: '/assets/13_luxury_silk_tapestry.png', intro: 'New works made with an old patience: tactile, narrative and intentionally scarce.' },
];

export const galleryImages = [
  { src: '/assets/06_gallery_luxury_rug_room.png', title: 'A field of memory', note: 'Rug detail, Kerman' },
  { src: '/assets/03_hero_weaving_woman.png', title: 'At the loom', note: 'Weaving study' },
  { src: '/assets/04_workshop_weaving_woman.png', title: 'Berlin at dusk', note: 'Window view, Mitte' },
  { src: '/assets/05_folded_silk_rugs.png', title: 'Two cities, one thread', note: 'Interior study' },
  { src: '/assets/14_luxury_lamp.png', title: 'Warm light', note: 'Private interior' },
  { src: '/assets/15_luxury_armchair.png', title: 'The reading room', note: 'Private interior' },
];

export const money = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);