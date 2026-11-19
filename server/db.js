const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'nova.sqlite'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'customer',phone TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS addresses(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL,label TEXT DEFAULT 'Home',full_name TEXT NOT NULL,line1 TEXT NOT NULL,line2 TEXT,city TEXT NOT NULL,state TEXT NOT NULL,postal_code TEXT NOT NULL,country TEXT NOT NULL,phone TEXT,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY,name TEXT NOT NULL,slug TEXT UNIQUE,sku TEXT UNIQUE,category TEXT NOT NULL,description TEXT,price REAL NOT NULL,compare_price REAL,image TEXT,rating REAL DEFAULT 4.7,stock INTEGER DEFAULT 0,status TEXT DEFAULT 'active',featured INTEGER DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL,total REAL NOT NULL,subtotal REAL NOT NULL,discount REAL DEFAULT 0,shipping REAL DEFAULT 0,status TEXT DEFAULT 'processing',payment_status TEXT DEFAULT 'pending',payment_ref TEXT,items TEXT NOT NULL,address TEXT,tracking_code TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS coupons(id INTEGER PRIMARY KEY,code TEXT UNIQUE NOT NULL,type TEXT NOT NULL,value REAL NOT NULL,min_order REAL DEFAULT 0,active INTEGER DEFAULT 1,expires_at TEXT);
CREATE TABLE IF NOT EXISTS reviews(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL,product_id INTEGER NOT NULL,rating INTEGER NOT NULL,comment TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(user_id,product_id));
`);
// Seed products. INSERT OR IGNORE below makes this safe to run repeatedly.
const ps = [
 ["Wireless Earbuds","wireless-earbuds","NV-AUD-009","Audio","Compact wireless audio with rich sound.",79,99,"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1",35,1],
    ["Bluetooth Speaker","bluetooth-speaker","NV-AUD-010","Audio","Portable sound for every occasion.",59,79,"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",22,0],
    ["Gaming Headset","gaming-headset","NV-AUD-011","Audio","Immersive audio for competitive gaming.",99,129,"https://images.unsplash.com/photo-1599669454699-248893623440",16,1],
    ["Studio Microphone","studio-microphone","NV-AUD-012","Audio","Clear audio for creators and streamers.",119,149,"https://images.unsplash.com/photo-1590602847861-f357a9332bbc",14,0],
    ["Noise Cancelling Headphones","noise-cancelling-headphones","NV-AUD-013","Audio","Focus on what matters with quiet comfort.",149,179,"https://images.unsplash.com/photo-1546435770-a3e426bf472b",19,1],
    ["Portable Audio Player","portable-audio-player","NV-AUD-014","Audio","Your music wherever life takes you.",89,109,"https://images.unsplash.com/photo-1593078166038-6e2e5f2e7e6a",12,0],
    ["Wireless Charging Earbuds","wireless-charging-earbuds","NV-AUD-015","Audio","Everyday listening with easy charging.",69,89,"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1",28,0],
    ["Bass Sound Bar","bass-sound-bar","NV-AUD-016","Audio","Bring cinematic sound into your home.",139,169,"https://images.unsplash.com/photo-1545454675-3531b543be5d",10,0],
    ["Smart Audio Dock","smart-audio-dock","NV-AUD-017","Audio","A stylish home audio companion.",109,129,"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",15,0],
    ["Retro Vinyl Player","retro-vinyl-player","NV-AUD-018","Audio","Rediscover the warmth of analog sound.",179,219,"https://images.unsplash.com/photo-1603048588665-791ca8aea617",8,1],
    ["Wireless Headphone Stand","headphone-stand","NV-AUD-019","Audio","Keep your headphones organized.",29,39,"https://images.unsplash.com/photo-1505740420928-5e560c06d30e",40,0],
    ["Compact USB Microphone","usb-microphone","NV-AUD-020","Audio","Simple recording for everyday creators.",49,69,"https://images.unsplash.com/photo-1590602847861-f357a9332bbc",20,0],
    ["Premium Sound System","premium-sound-system","NV-AUD-021","Audio","Powerful sound for your living space.",249,299,"https://images.unsplash.com/photo-1545454675-3531b543be5d",6,1],

    // FOOTWEAR (13)
    ["Running Shoes","running-shoes","NV-FTW-010","Footwear","Lightweight support for daily runs.",99,119,"https://images.unsplash.com/photo-1542291026-7eec264c27ff",30,1],
    ["Classic White Sneakers","classic-white-sneakers","NV-FTW-011","Footwear","Timeless everyday footwear.",79,99,"https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3",24,0],
    ["Urban High Tops","urban-high-tops","NV-FTW-012","Footwear","Street-inspired high-top sneakers.",109,129,"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",17,1],
    ["Leather Loafers","leather-loafers","NV-FTW-013","Footwear","Refined footwear for smart occasions.",119,149,"https://images.unsplash.com/photo-1531310197839-ccf54634509e",12,0],
    ["Sport Sandals","sport-sandals","NV-FTW-014","Footwear","Comfortable sandals for outdoor days.",49,65,"https://images.unsplash.com/photo-1603487742131-4160ec999306",26,0],
    ["Canvas Slip Ons","canvas-slip-ons","NV-FTW-015","Footwear","Easygoing comfort for everyday wear.",45,59,"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",32,0],
    ["Trail Running Shoes","trail-running-shoes","NV-FTW-016","Footwear","Grip and stability for rough terrain.",129,159,"https://images.unsplash.com/photo-1552346154-21d32810aba3",14,1],
    ["Minimal Slides","minimal-slides","NV-FTW-017","Footwear","Relaxed comfort with a clean profile.",29,39,"https://images.unsplash.com/photo-1603487742131-4160ec999306",40,0],
    ["Leather Boots","leather-boots","NV-FTW-018","Footwear","Durable boots with timeless character.",149,179,"https://images.unsplash.com/photo-1542291026-7eec264c27ff",11,0],
    ["Training Sneakers","training-sneakers","NV-FTW-019","Footwear","Flexible support for every workout.",89,109,"https://images.unsplash.com/photo-1552346154-21d32810aba3",20,0],
    ["Classic Brown Shoes","classic-brown-shoes","NV-FTW-020","Footwear","Smart casual footwear for every day.",99,119,"https://images.unsplash.com/photo-1531310197839-ccf54634509e",15,0],
    ["Lightweight Walking Shoes","walking-shoes","NV-FTW-021","Footwear","Comfort designed for long walks.",69,89,"https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3",29,0],
    ["Designer Sport Shoes","designer-sport-shoes","NV-FTW-022","Footwear","Modern athletic style and comfort.",139,169,"https://images.unsplash.com/photo-1552346154-21d32810aba3",9,1],

    // LIVING (13)
    ["Modern Wall Clock","modern-wall-clock","NV-LIV-010","Living","A minimal accent for modern walls.",55,69,"https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c",18,0],
    ["Ceramic Flower Vase","ceramic-flower-vase","NV-LIV-011","Living","Elegant ceramic decor for your home.",39,49,"https://images.unsplash.com/photo-1578500494198-246f612d3b3d",25,1],
    ["Minimal Table Lamp","minimal-table-lamp","NV-LIV-012","Living","Soft ambient light for quiet evenings.",69,89,"https://images.unsplash.com/photo-1507473885765-e6ed057f782c",16,0],
    ["Decorative Cushion","decorative-cushion","NV-LIV-013","Living","Add texture and warmth to your space.",25,35,"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",35,0],
    ["Modern Coffee Table","modern-coffee-table","NV-LIV-014","Living","A functional centerpiece for your room.",199,249,"https://images.unsplash.com/photo-1499933374294-4584851497cc",7,1],
    ["Wooden Bookshelf","wooden-bookshelf","NV-LIV-015","Living","Display your favorite books and objects.",179,219,"https://images.unsplash.com/photo-1594620302200-9a762244a156",8,0],
    ["Soft Throw Blanket","soft-throw-blanket","NV-LIV-016","Living","Cozy comfort for relaxing moments.",59,75,"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",21,0],
    ["Modern Storage Basket","storage-basket","NV-LIV-017","Living","Keep everyday essentials neatly stored.",32,42,"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",30,0],
    ["Indoor Plant Pot","indoor-plant-pot","NV-LIV-018","Living","A simple home for your favorite plants.",29,39,"https://images.unsplash.com/photo-1485955900006-10f4d324d411",40,0],
    ["Luxury Floor Lamp","luxury-floor-lamp","NV-LIV-019","Living","Statement lighting for modern interiors.",159,199,"https://images.unsplash.com/photo-1507473885765-e6ed057f782c",10,1],
    ["Marble Serving Tray","marble-serving-tray","NV-LIV-020","Living","An elegant accent for entertaining.",45,59,"https://images.unsplash.com/photo-1490312278390-ab64016e0aa9",17,0],
    ["Modern Bedside Table","bedside-table","NV-LIV-021","Living","Smart storage beside your bed.",129,159,"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",12,0],
    ["Decorative Mirror","decorative-mirror","NV-LIV-022","Living","Make your space feel brighter.",89,109,"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",14,1],

    // ACCESSORIES (13)
    ["Leather Wallet","leather-wallet","NV-ACC-009","Accessories","A compact wallet for everyday essentials.",45,59,"https://images.unsplash.com/photo-1627123424574-724758594e93",25,0],
    ["Polarized Sunglasses","polarized-sunglasses","NV-ACC-010","Accessories","Everyday eyewear with a bold profile.",69,89,"https://images.unsplash.com/photo-1511499767150-a48a237f0083",30,1],
    ["Classic Leather Belt","leather-belt","NV-ACC-011","Accessories","A timeless finishing touch.",39,49,"https://images.unsplash.com/photo-1624222247344-550fb8a3f8b9",22,0],
    ["Travel Organizer","travel-organizer","NV-ACC-012","Accessories","Keep travel essentials organized.",35,45,"https://images.unsplash.com/photo-1553062407-98eeb64c6a62",28,0],
    ["Premium Keychain","premium-keychain","NV-ACC-013","Accessories","A refined everyday carry accessory.",19,25,"https://images.unsplash.com/photo-1511499767150-a48a237f0083",45,0],
    ["Canvas Tote Bag","canvas-tote-bag","NV-ACC-014","Accessories","A practical companion for busy days.",29,39,"https://images.unsplash.com/photo-1590874103328-eac38a683ce7",38,1],
    ["Travel Duffel Bag","travel-duffel-bag","NV-ACC-015","Accessories","Spacious storage for weekend escapes.",89,109,"https://images.unsplash.com/photo-1553062407-98eeb64c6a62",16,0],
    ["Premium Card Holder","card-holder","NV-ACC-016","Accessories","Carry your cards in a slim profile.",25,35,"https://images.unsplash.com/photo-1627123424574-724758594e93",31,0],
    ["Classic Baseball Cap","baseball-cap","NV-ACC-017","Accessories","A versatile cap for everyday style.",24,32,"https://images.unsplash.com/photo-1588850561407-ed78c282e89b",40,0],
    ["Minimal Silver Bracelet","silver-bracelet","NV-ACC-018","Accessories","Understated style for every occasion.",59,79,"https://images.unsplash.com/photo-1611652022419-a9419f74343d",15,1],
    ["Travel Neck Pillow","travel-neck-pillow","NV-ACC-019","Accessories","Comfort for journeys near and far.",29,39,"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",26,0],
    ["Premium Laptop Sleeve","laptop-sleeve","NV-ACC-020","Accessories","Protect your laptop in style.",49,65,"https://images.unsplash.com/photo-1496181133206-80ce9b88a853",18,0],
    ["Classic Wristwatch Strap","watch-strap","NV-ACC-021","Accessories","Refresh your favorite timepiece.",22,29,"https://images.unsplash.com/photo-1523275335684-37898b6baf30",34,0],

    // FITNESS (12)
    ["Yoga Mat","yoga-mat","NV-FIT-008","Fitness","A stable foundation for every session.",39,49,"https://images.unsplash.com/photo-1592432678016-e910b452f9a2",32,1],
    ["Adjustable Dumbbells","adjustable-dumbbells","NV-FIT-009","Fitness","Flexible strength training at home.",129,159,"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",10,0],
    ["Resistance Bands","resistance-bands","NV-FIT-010","Fitness","Versatile resistance for full-body workouts.",19,29,"https://images.unsplash.com/photo-1598289431512-b97b0917affc",45,0],
    ["Fitness Jump Rope","fitness-jump-rope","NV-FIT-011","Fitness","Simple cardio for everyday training.",15,22,"https://images.unsplash.com/photo-1434596922112-19c563067271",38,0],
    ["Gym Gloves","gym-gloves","NV-FIT-012","Fitness","Comfortable grip during strength sessions.",25,35,"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",28,0],
    ["Foam Roller","foam-roller","NV-FIT-013","Fitness","Support recovery after workouts.",32,42,"https://images.unsplash.com/photo-1518611012118-696072aa579a",20,0],
    ["Smart Fitness Band","smart-fitness-band","NV-FIT-014","Fitness","Track everyday movement and activity.",79,99,"https://images.unsplash.com/photo-1557935728-e6d1eaabe558",17,1],
    ["Exercise Kettlebell","exercise-kettlebell","NV-FIT-015","Fitness","Build strength with versatile training.",49,65,"https://images.unsplash.com/photo-1517836357463-d25dfeac3438",14,0],
    ["Workout Bench","workout-bench","NV-FIT-016","Fitness","A versatile base for strength training.",149,189,"https://images.unsplash.com/photo-1534438327276-14e5300c3a48",6,0],
    ["Gym Water Jug","gym-water-jug","NV-FIT-017","Fitness","Stay hydrated through every workout.",24,32,"https://images.unsplash.com/photo-1602143407151-7111542de6e8",35,0],
    ["Pilates Ring","pilates-ring","NV-FIT-018","Fitness","Controlled resistance for focused movement.",27,35,"https://images.unsplash.com/photo-1518611012118-696072aa579a",22,0],
    ["Training Hand Grips","training-hand-grips","NV-FIT-019","Fitness","Improve grip strength at home.",18,25,"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",30,0],

    // TECH (12)
    ["Wireless Mouse","wireless-mouse","NV-TEC-009","Tech","Precision control with a clean design.",35,45,"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",30,1],
    ["Mechanical Keyboard","mechanical-keyboard","NV-TEC-010","Tech","Tactile typing for work and play.",99,129,"https://images.unsplash.com/photo-1587829741301-dc798b83add3",18,1],
    ["USB-C Hub","usb-c-hub","NV-TEC-011","Tech","Expand your laptop connectivity.",45,59,"https://images.unsplash.com/photo-1625842268584-8f3296236761",25,0],
    ["Portable SSD","portable-ssd","NV-TEC-012","Tech","Fast portable storage for your files.",119,149,"https://images.unsplash.com/photo-1597872200969-2b65d56bd16b",12,0],
    ["Laptop Stand","laptop-stand","NV-TEC-013","Tech","A better setup for your workspace.",39,49,"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",28,0],
    ["Wireless Charger","wireless-charger","NV-TEC-014","Tech","Convenient wireless power for compatible devices.",29,39,"https://images.unsplash.com/photo-1591290619762-c588e8e6f1c0",34,0],
    ["Smart LED Strip","smart-led-strip","NV-TEC-015","Tech","Personalize your space with smart lighting.",35,45,"https://images.unsplash.com/photo-1550745165-9bc0b252726f",21,0],
    ["Webcam Pro","webcam-pro","NV-TEC-016","Tech","Clear video for meetings and streaming.",79,99,"https://images.unsplash.com/photo-1587829741301-dc798b83add3",15,1],
    ["Portable Projector","portable-projector","NV-TEC-017","Tech","Enjoy big-screen entertainment anywhere.",229,279,"https://images.unsplash.com/photo-1478720568477-152d9b164e26",7,1],
    ["Smart Desk Clock","smart-desk-clock","NV-TEC-018","Tech","A functional display for your desk.",49,65,"https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c",19,0],
    ["Power Bank","power-bank","NV-TEC-019","Tech","Portable power for your daily devices.",39,49,"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",40,0],
    ["Tablet Stand","tablet-stand","NV-TEC-020","Tech","A practical viewing angle for your tablet.",25,35,"https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df",26,0],

    // FASHION (12)
    ["Classic Cotton T-Shirt","cotton-t-shirt","NV-FAS-001","Fashion","An everyday essential in soft cotton.",25,35,"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",50,1],
    ["Oversized Hoodie","oversized-hoodie","NV-FAS-002","Fashion","Relaxed comfort with modern styling.",59,75,"https://images.unsplash.com/photo-1556821840-3a63f95609a7",28,1],
    ["Denim Jacket","denim-jacket","NV-FAS-003","Fashion","A timeless layer for every season.",89,109,"https://images.unsplash.com/photo-1543076447-215ad9ba6923",16,0],
    ["Classic Denim Jeans","classic-denim-jeans","NV-FAS-004","Fashion","Versatile denim for everyday wear.",69,89,"https://images.unsplash.com/photo-1542272604-787c3835535d",35,0],
    ["Casual Linen Shirt","linen-shirt","NV-FAS-005","Fashion","Lightweight style for warm days.",49,65,"https://images.unsplash.com/photo-1596755094514-f87e34085b2c",24,0],
    ["Essential Polo Shirt","polo-shirt","NV-FAS-006","Fashion","A polished everyday wardrobe staple.",39,49,"https://images.unsplash.com/photo-1625910513413-5fc1b6b7b6c8",32,0],
    ["Relaxed Joggers","relaxed-joggers","NV-FAS-007","Fashion","Comfort-focused style for off-duty days.",45,59,"https://images.unsplash.com/photo-1552902865-b72c031ac5ea",26,0],
    ["Premium Sweatshirt","premium-sweatshirt","NV-FAS-008","Fashion","An easy layer for cooler days.",55,69,"https://images.unsplash.com/photo-1578681994506-b8f463449011",18,0],
    ["Summer Casual Shorts","summer-shorts","NV-FAS-009","Fashion","Lightweight comfort for summer outings.",35,45,"https://images.unsplash.com/photo-1591195853828-11db59a44f6b",29,0],
    ["Classic Formal Shirt","formal-shirt","NV-FAS-010","Fashion","A refined choice for smart occasions.",65,79,"https://images.unsplash.com/photo-1603252109303-2751441dd157",14,1],
    ["Winter Puffer Jacket","puffer-jacket","NV-FAS-011","Fashion","Warm outerwear for colder weather.",149,179,"https://images.unsplash.com/photo-1544923246-77307dd654cb",9,1],
    ["Minimal Crewneck","minimal-crewneck","NV-FAS-012","Fashion","Clean design with everyday versatility.",49,65,"https://images.unsplash.com/photo-1578681994506-b8f463449011",21,0],

    // BEAUTY (12)
    ["Daily Skincare Set","daily-skincare-set","NV-BEA-001","Beauty","A simple routine for everyday care.",49,65,"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",30,1],
    ["Hydrating Face Cream","hydrating-face-cream","NV-BEA-002","Beauty","A lightweight moisturizing formula.",25,35,"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19",35,0],
    ["Gentle Face Cleanser","face-cleanser","NV-BEA-003","Beauty","A gentle addition to your daily routine.",19,27,"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",40,0],
    ["Vitamin C Serum","vitamin-c-serum","NV-BEA-004","Beauty","A brightening-focused skincare serum.",32,42,"https://images.unsplash.com/photo-1620916566398-39f1143ab7be",22,1],
    ["Body Lotion","body-lotion","NV-BEA-005","Beauty","Everyday hydration and smooth texture.",22,30,"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",28,0],
    ["Beauty Travel Kit","beauty-travel-kit","NV-BEA-006","Beauty","Compact essentials for your travels.",39,49,"https://images.unsplash.com/photo-1596462502278-27bfdc403348",18,0],
    ["Makeup Brush Set","makeup-brush-set","NV-BEA-007","Beauty","A versatile set for makeup application.",29,39,"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",26,0],
    ["Premium Hair Dryer","premium-hair-dryer","NV-BEA-008","Beauty","Everyday styling with convenient control.",79,99,"https://images.unsplash.com/photo-1522338140262-f46f5913618a",12,1],
    ["Scented Candle","scented-candle","NV-BEA-009","Beauty","A calming scent for your space.",24,32,"https://images.unsplash.com/photo-1603006905003-be475563bc59",33,0],
    ["Luxury Hand Cream","luxury-hand-cream","NV-BEA-010","Beauty","A soft finish for everyday hand care.",18,25,"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19",40,0],
    ["Compact Makeup Mirror","makeup-mirror","NV-BEA-011","Beauty","A convenient mirror for daily routines.",27,35,"https://images.unsplash.com/photo-1596462502278-27bfdc403348",21,0],
    ["Facial Care Roller","facial-care-roller","NV-BEA-012","Beauty","A simple accessory for your skincare routine.",22,29,"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",25,0]
];const ins = db.prepare(`
  INSERT OR IGNORE INTO products
  (name, slug, sku, category, description, price, compare_price, image, stock, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seedProducts = db.transaction((products) => {
  for (const product of products) {
    ins.run(...product);
  }
});

seedProducts(ps);

db.prepare(`
  INSERT OR IGNORE INTO coupons (code, type, value, min_order)
  VALUES ('NOVA10', 'percent', 10, 50)
`).run();

console.log(`NOVA database ready. Processed ${ps.length} product seed records.`);

module.exports = db;