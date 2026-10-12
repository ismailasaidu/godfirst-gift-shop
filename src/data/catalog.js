import { Camera, Gift, PencilRuler, PackageCheck, Plane, ScanLine, Landmark } from "lucide-react";

export const DEFAULT_CATEGORIES = [
 {id:"asia",name:"Asia Gift Items",emoji:"🌏",description:"Thoughtful gifts for selected destinations"},
 {id:"canada",name:"Canada Gift Items",emoji:"🍁",description:"Send a little joy to Canada"},
 {id:"birthday",name:"Birthday Gifts",emoji:"🎂",description:"Make their day feel extra special"},
 {id:"flowers",name:"Flowers & Hampers",emoji:"💐",description:"Beautiful bouquets and gift hampers"},
 {id:"personalised",name:"Personalised Gifts",emoji:"🎁",description:"Personal touches that mean more"},
 {id:"romance",name:"Love & Anniversary",emoji:"❤️",description:"A thoughtful gesture for someone special"},
 {id:"cakes",name:"Cakes & Sweet Treats",emoji:"🍰",description:"Cakes, chocolates and little treats"},
 {id:"fashion",name:"Fashion & Accessories",emoji:"👜",description:"Wearable gifts and everyday style"},
 {id:"electronics",name:"Tech & Gadgets",emoji:"🎧",description:"Useful tech gifts and gadgets"},
 {id:"baby",name:"Baby & Kids Gifts",emoji:"🧸",description:"Little gifts for little ones"},
 {id:"graduation",name:"Graduation Gifts",emoji:"🎓",description:"Celebrate milestones and achievements"},
 {id:"corporate",name:"Corporate Gifts",emoji:"🎁",description:"Thoughtful gifts for teams and clients"},
 {id:"wellness",name:"Self-Care & Wellness",emoji:"🕯️",description:"Comforting gifts for rest and wellbeing"},
 {id:"home",name:"Home & Living",emoji:"🏡",description:"Lovely details for home and everyday life"},
 {id:"religious",name:"Faith & Inspirational Gifts",emoji:"✨",description:"Meaningful gifts for faith-filled moments"}
];

export const SUBCATEGORIES = {
 asia: [
  { id: "flowers", name: "Flowers", description: "Fresh bouquets and floral gifts", image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=800&q=85", emoji: "💐" },
  { id: "footwear", name: "Shoes & Footwear", description: "Thoughtful styles for every day", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85", emoji: "👟" },
  { id: "cakes", name: "Cakes & Treats", description: "Sweet ways to celebrate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85", emoji: "🎂" },
  { id: "hampers", name: "Gift Hampers", description: "Beautifully arranged surprises", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85", emoji: "🎁" },
  { id: "fashion", name: "Fashion & Accessories", description: "Little luxuries they will love", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85", emoji: "👜" },
  { id: "electronics", name: "Electronics", description: "Useful gifts for modern living", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85", emoji: "🎧" },
  { id: "cakes-treats", name: "Cakes & Sweet Treats", description: "Cakes, chocolates and sweet surprises", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=85", emoji: "🍰" },
  { id: "personalised", name: "Personalised Gifts", description: "Names, messages and thoughtful details", image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=85", emoji: "🎁" },
  { id: "baby-kids", name: "Baby & Kids Gifts", description: "Cute gifts for little ones", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=85", emoji: "🧸" },
  { id: "wellness", name: "Self-Care & Wellness", description: "Comfort, care and relaxing gifts", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85", emoji: "🕯️" },
  { id: "home-living", name: "Home & Living", description: "Lovely details for home", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85", emoji: "🏡" },
  { id: "graduation", name: "Graduation Gifts", description: "Celebrate the next big chapter", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=85", emoji: "🎓" },
  { id: "corporate", name: "Corporate Gifts", description: "Gifts for teams, clients and occasions", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85", emoji: "💼" }
 ]
};

export const CATEGORY_IMAGES = {
 asia: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85",
 canada: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=85",
 birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1?auto=format&fit=crop&w=900&q=85",
 flowers: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=900&q=85",
 personalised: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=900&q=85",
 romance: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=85"
};
export const SERVICE_IMAGES = [
 "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
 "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=85",
 "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
 "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=85",
 "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85",
 "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=900&q=85",
 "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85"
];

export const DEFAULT_PRODUCTS = [
 {id:"p1",name:"The Celebration Hamper",category:"birthday",price:85000,oldPrice:95000,tag:"Bestseller",emoji:"🎁",image:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85",tone:"blush",description:"A thoughtful mix of treats and little surprises, beautifully wrapped.",stock:12,featured:true},
 {id:"p2",name:"Classic Rose Bouquet",category:"flowers",price:45000,tag:"Popular",emoji:"💐",image:"https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=900&q=85",tone:"rose",description:"A beautiful bouquet for birthdays, celebrations and meaningful moments.",stock:8,featured:true},
 {id:"p3",name:"A Little Bear, A Lot of Love",category:"personalised",price:28000,emoji:"🧸",image:"https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=900&q=85",tone:"cream",description:"A cuddly companion for milestones, celebrations and just-because moments.",stock:15,featured:true},
 {id:"p4",name:"Chocolate Moments Box",category:"romance",price:35000,emoji:"🍫",image:"https://images.unsplash.com/photo-1548907040-4d42bfc8c7e8?auto=format&fit=crop&w=900&q=85",tone:"chocolate",description:"A sweet surprise for someone who deserves a little extra joy.",stock:20,featured:true},
 {id:"p5",name:"Golden Gift Box",category:"asia",subcategory:"hampers",price:62000,emoji:"✨",image:"https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=900&q=85",tone:"gold",description:"An elegant gift box for the moments worth celebrating.",stock:6,featured:true},
 {id:"asia-flower-01",name:"Blush Garden Bouquet",category:"asia",subcategory:"flowers",price:42000,tag:"Fresh favourite",emoji:"💐",image:"https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85",tone:"rose",description:"A graceful bouquet selected to brighten someone's day.",stock:9,featured:true},
 {id:"asia-flower-02",name:"Sunshine Tulip Bunch",category:"asia",subcategory:"flowers",price:38500,emoji:"🌷",image:"https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=900&q=85",tone:"rose",description:"Bright tulips for birthdays, congratulations and just because.",stock:7,featured:false},
 {id:"asia-shoe-01",name:"Everyday Classic Sneakers",category:"asia",subcategory:"footwear",price:58000,tag:"Popular pick",emoji:"👟",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",tone:"cream",description:"A versatile sneaker gift for everyday comfort and style.",stock:5,featured:true},
 {id:"asia-shoe-02",name:"Minimal White Trainers",category:"asia",subcategory:"footwear",price:64000,emoji:"👟",image:"https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85",tone:"cream",description:"Clean, easy-to-style trainers for a thoughtful surprise.",stock:4,featured:false},
 {id:"asia-cake-01",name:"Celebration Cake",category:"asia",subcategory:"cakes",price:35000,emoji:"🎂",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",tone:"blush",description:"A celebration centrepiece for birthdays and special days.",stock:8,featured:true},
 {id:"asia-fashion-01",name:"Everyday Tote Gift",category:"asia",subcategory:"fashion",price:32000,emoji:"👜",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",tone:"cream",description:"A useful and stylish accessory for someone special.",stock:6,featured:false},
 {id:"asia-electronics-01",name:"Wireless Headphones",category:"asia",subcategory:"electronics",price:72000,emoji:"🎧",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",tone:"gold",description:"A practical tech gift for music, calls and everyday listening.",stock:5,featured:false},
 {id:"p6",name:"Just Because Gift Set",category:"canada",price:52000,emoji:"💝",image:"https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=85",tone:"pink",description:"No occasion needed. Just a lovely way to make someone smile.",stock:10,featured:false},
 {id:"p7",name:"Chocolate & Treats Hamper",category:"birthday",price:68000,emoji:"🍬",image:"https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=900&q=85",tone:"gold",description:"A cheerful assortment of treats, packed and presented with care.",stock:9,featured:false},
 {id:"p8",name:"Everyday Flower Bundle",category:"flowers",price:39000,emoji:"🌷",image:"https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85",tone:"rose",description:"A fresh-looking floral gift for an ordinary day made special.",stock:11,featured:false}
];
export const SERVICES = [
 ["Photos & Docs Editing","Photo retouching and document editing support.",Camera],
 ["Gift Package Delivery","Help arranging thoughtful gift deliveries.",Gift],
 ["Art & Sketch Drawing","Custom artwork and sketch commissions.",PencilRuler],
 ["Consignment Box Video","Video proof for eligible consignment box requests.",PackageCheck],
 ["Flight Ticket Tracking","Assistance with flight ticket tracking enquiries.",Plane],
 ["Parcel Tracking Support","Help checking parcel updates and delivery progress.",ScanLine],
 ["Online Banking Website Services","Website design and development service enquiries.",Landmark]
];
export const money = n => new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(Number(n)||0);
export const slug = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
export const readStore = (key, fallback) => { try { const v=localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
