// 1. Badu wala list eka (Data Array)
const webProducts = [
    {
        id: "1",
        nameEn: "The Classic Package",
        nameSi: "අකුරු කියවීමේ කට්ටලය",
        category: "Akuru Kiyaweeme Kattala",
        price: 1640,
        image: "/shop/images/akuru-kiyaweema/1990-Classic.png",
        slug: "the-classic-package"
    },
    {
        id: "2",
        nameEn: "The Premium Package",
        nameSi: "අකුරු කියවීමේ කට්ටලය",
        category: "Akuru Kiyaweeme Kattala",
        price: 3000,
        image: "/shop/images/akuru-kiyaweema/3000-Premium.png",
        slug: "the-premium-package"
    },
    {
        id: "3",
        nameEn: "The Signature Package",
        nameSi: "අකුරු කියවීමේ කට්ටලය",
        category: "Akuru Kiyaweeme Kattala",
        price: 3840,
        image: "/shop/images/akuru-kiyaweema/3840-Signature.png",
        slug: "the-signature-package"
    },
    {
        id: "4",
        nameEn: "The Elite Package",
        nameSi: "අකුරු කියවීමේ කට්ටලය",
        category: "Akuru Kiyaweeme Kattala",
        price: 4640,
        image: "/shop/images/akuru-kiyaweema/4640-Elite.png",
        slug: "the-elite-package"
    },
    {
        id: "5",
        nameEn: "The Elite-Plus Package",
        nameSi: "අකුරු කියවීමේ කට්ටලය",
        category: "Akuru Kiyaweeme Kattala",
        price: 4990,
        image: "/shop/images/akuru-kiyaweema/4990-ElitePlus.png",
        slug: "the-eliteplus-package"
    },
    {
        id: "7",
        nameEn: "The Wooden Lotus of Prosperity",
        nameSi: "සෞභාග්‍යය සංකේතවත් කිරීමේ සියපත",
        category: "Essentials",
        price: 1390,
        image: "/shop/images/products/siyapatha.png",
        slug: "saubhagyaye-siyapatha"
    },
    {
        id: "8",
        nameEn: "The Wooden Letter 'අ' of Perfection",
        nameSi: "පරිපූර්ණත්වය සංකේතවත් 'අ' අකුර",
        category: "Essentials",
        price: 2000,
        image: "/shop/images/products/akura.jpg",
        slug: "wodern-letter"
    },
    {
        id: "9",
        nameEn: "The Wooden Letter 'A' of Perfection",
        nameSi: "පරිපූර්ණත්වය සංකේතවත් 'A' අකුර",
        category: "Essentials",
        price: 2100,
        image: "/shop/images/products/a-akura.png",
        slug: "wodern-letter"
    },
    // {
    //     id: "10",
    //     nameEn: "The Wooden Letter 'A' of Perfection",
    //     nameSi: "පරිපූර්ණත්වය සංකේතවත් 'A' අකුර",
    //     category: "Essentials",
    //     price: 2100,
    //     image: "/shop/images/products/a-akura.png",
    //     slug: "wodern-letter"
    // },
    // {
    //     id: "11",
    //     nameEn: "The Wooden Letter 'A' of Perfection",
    //     nameSi: "පරිපූර්ණත්වය සංකේතවත් 'A' අකුර",
    //     category: "Essentials",
    //     price: 2100,
    //     image: "/shop/images/products/a-akura.png",
    //     slug: "wodern-letter"
    // },
    // {
    //     id: "12",
    //     nameEn: "The Wooden Letter 'A' of Perfection",
    //     nameSi: "පරිපූර්ණත්වය සංකේතවත් 'A' අකුර",
    //     category: "Essentials",
    //     price: 2100,
    //     image: "//shop/images/products/a-akura.png",
    //     slug: "wodern-letter"
    // },
    {
        id: "13",
        nameEn: "Magic Books - 4 with 10 Pens",
        nameSi: "ගණිත, ඉංග්‍රීසි, ඉලක්කම් සහ අත හුරුව ",
        category: "Book Packages",
        price: 790,
        image: "/shop/images/products/magicbooks.jpg",
        slug: "magic-books"
    },
    {
        id: "14",
        nameEn: "Magic-Water with Pen",
        nameSi: "Magic-Water with Pen",
        category: "Book Packages",
        price: 190,
        image: "/shop/images/products/magicwater.jpg",
        slug: "word-searching-and-dot-to-dot-puzzles-card-pack"
    },
    {
        id: "15",
        nameEn: "Lipstick Eraser",
        nameSi: "ලිප්ස්ටික් මකනය",
        category: "Stationery",
        price: 80,
        image: "/shop/images/products/lipstick-eraser.jpg",
        slug: "lipstick-eraser"
    },
    {
        id: "16",
        nameEn: "Doms 12 Colour Pencils",
        nameSi: "පාට පැන්සල් 12",
        category: "Stationery",
        price: 380,
        image: "/shop/images/products/doms-color-pencil.jpg",
        slug: "doms-12colour-pencils"
    },
    {
        id: "17",
        nameEn: "English Alphabet Letter Set",
        nameSi: "ඉංග්‍රීසි හෝඩිය",
        category: "Stationery",
        price: 280,
        image: "/shop/images/products/alphabet-set.jpg",
        slug: "english-alphabet-set"
    },
    {
        id: "18",
        nameEn: "Counting Frame (Abucus) for Kids",
        nameSi: "ගණිත රාමුව",
        category: "Toys & Puzzles",
        price: 340,
        image: "/shop/images/products/abacus.jpeg",
        slug: "abacus-for-kids"
    },
    {
        id: "19",
        nameEn: "All in One Set for Kids (Premium) ",
        nameSi: "ප්‍රිමියම් පැකේජය",
        category: "Kids & School Essentials",
        price: 4490,
        image: "/shop/images/products/bagpremium.jpg",
        slug: "bag-aio-premium"
    },
    {
        id: "20",
        nameEn: "All in One Set for Kids (Basic) ",
        nameSi: "All in One පැකේජය",
        category: "Kids & School Essentials",
        price: 2000,
        image: "/shop/images/products/bag-basic.png",
        slug: "bag-aio-basic"
    },
    {
        id: "21",
        nameEn: "Bottle for Kids (Kuromi & Cinnamarol)",
        nameSi: "වතුර බෝතලය",
        category: "Kids & School Essentials",
        price: 1090,
        image: "/shop/images/products/bottle.jpg",
        slug: "kuromi-water-bottle"
    },
    {
        id: "22",
        nameEn: "Kids Hair Clips & Wool Band Set",
        nameSi: "හුරුබුහුටි කොණ්ඩ කටු, වුල් බෑන්ඩ් ",
        category: "Kids & School Essentials",
        price: 300,
        image: "/shop/images/products/woolbands.jpg",
        slug: "hair-clip"
    },
    {
        id: "23",
        nameEn: "Vneeds Water Colours Artist Palette",
        nameSi: "වෝටර් කලර් සෙට්",
        category: "Stationery",
        price: 290,
        image: "/shop/images/products/artist-palete.jpg",
        slug: "vneeds-artist-palette"
    },
    {
        id: "24",
        nameEn: "ABC Alphabet Puzzle",
        nameSi: "ඉංග්‍රීසි හෝඩිය පසල් සෙට්",
        category: "Toys & Puzzles",
        price: 290,
        image: "/shop/images/products/abc-puzzle.jpg",
        slug: "abc-puzzle"
    },
    {
        id: "25",
        nameEn: "Jumbo Building Blocks",
        nameSi: "බිල්ඩින් බ්ලොක්ස්",
        category: "Toys & Puzzles",
        price: 370,
        image: "/shop/images/products/building_blocks-large.webp",
        slug: "building-blocks-large"
    },
    {
        id: "26",
        nameEn: "Wooden English Alphabet Set",
        nameSi: "ඉංග්‍රීසි හෝඩිය",
        category: "Toys & Puzzles",
        price: 450,
        image: "/shop/images/products/wood-Alphabet.jpg",
        slug: "wooden-alphabet"
    },
    {
        id: "27",
        nameEn: "Wooden Math Set 1-10 with Shapes",
        nameSi: "1-10 ගණිත හුරුව සහ හැඩතල",
        category: "Toys & Puzzles",
        price: 450,
        image: "/shop/images/products/wood1-10.avif",
        slug: "wooden-1-10"
    },
    {
        id: "28",
        nameEn: "Wooden Math Set 1-20 with Shapes",
        nameSi: "1-20 ගණිත හුරුව",
        category: "Toys & Puzzles",
        price: 450,
        image: "/shop/images/products/wood1-20.jpg",
        slug: "wooden-1-20"
    },
    {
        id: "29",
        nameEn: "Wooden Math Set 1-20 with Shapes",
        nameSi: "1-20 ගණිත හුරුව",
        category: "Toys & Puzzles",
        price: 450,
        image: "/shop/images/products/wood1-20.jpg",
        slug: "wooden-1-20"
    },
    {
        id: "30",
        nameEn: "LCD Writing Tablet for Kids",
        nameSi: "LCD ටැබ්",
        category: "Toys & Puzzles",
        price: 690,
        image: "/shop/images/products/writing-tablet.jpg",
        slug: "lcd-writing-tablet"
    },
    {
        id: "31",
        nameEn: "LCD Writing Tablet for Kids",
        nameSi: "LCD ටැබ්",
        category: "Stationery",
        price: 690,
        image: "/shop/images/products/writing-tablet.jpg",
        slug: "lcd-writing-tablet"
    },
    {
        id: "32",
        nameEn: "Seven Wooden Puzzles for Kids",
        nameSi: "හුරුබුහුටි පසල් සෙට් 7",
        category: "Toys & Puzzles",
        price: 1240,
        image: "/shop/images/products/puzzele7set.jpg",
        slug: "seven-puzzle-set"
    },
    {
        id: "33",
        nameEn: "Hot Wheels Clone Capibala",
        nameSi: "හුරුබුහුටි සෙල්ලම් කාර්",
        category: "Toys & Puzzles",
        price: 150,
        image: "/shop/images/products/hotwheels-clone.jpg",
        slug: "hotwheels-capybala"
    },
    {
        id: "34",
        nameEn: "Vneeds 12 Colour Pencils",
        nameSi: "පාට පැන්සල් 12",
        category: "Stationery",
        price: 320,
        image: "/shop/images/products/veeds-colorpencil.jpg",
        slug: "vneeds-twelve-colour-pencils"
    },
    {
        id: "35",
        nameEn: "Sinhala Alphabet Letter Set",
        nameSi: "සිංහල හෝඩිය",
        category: "Stationery",
        price: 280,
        image: "/shop/images/products/sinhala-alphabet.png",
        slug: "sinhala-alphabet-set"
    },
    {
        id: "36",
        nameEn: "Tamil Alphabet Letter Set",
        nameSi: "දෙමළ හෝඩිය",
        category: "Stationery",
        price: 310,
        image: "/shop/images/products/tamil-alphabet.png",
        slug: "tamil-alphabet-set"
    },
    {
        id: "37",
        nameEn: "Math for Kids, Numbers Set",
        nameSi: "ඉලක්කම්",
        category: "Stationery",
        price: 280,
        image: "/shop/images/products/numbers-set.png",
        slug: "numbers-set"
    },
    {
        id: "38",
        nameEn: "Building Blocks (Medium)",
        nameSi: "බිල්ඩින් බ්ලොක්ස්",
        category: "Toys & Puzzles",
        price: 310,
        image: "/shop/images/products/building-blocks-medium.png",
        slug: "building-blocks-medium"
    },
    {
        id: "39",
        nameEn: "Dow Dow Modeling Clay 8pcs",
        nameSi: "ක්ලේ වර්ණ 8",
        category: "Stationery",
        price: 180,
        image: "/shop/images/products/clay.jpg",
        slug: "clay-set"
    },
    {
        id: "40",
        nameEn: "Clock for Kids | Learn Time",
        nameSi: "ඔරලෝසුව",
        category: "Stationery",
        price: 200,
        image: "/shop/images/products/clock.png",
        slug: "clock"
    },
    {
        id: "41",
        nameEn: "Puppy Puzzle Set",
        nameSi: "බලු පැටියා පසල් සෙට්",
        category: "Toys & Puzzles",
        price: 190,
        image: "/shop/images/products/dog-puzzle.png",
        slug: "puppy-puzzle"
    },
    {
        id: "42",
        nameEn: "Rooster Puzzle Set",
        nameSi: "කුකුළා පසල් සෙට්",
        category: "Toys & Puzzles",
        price: 190,
        image: "/shop/images/products/rooster-puzzle.jpg",
        slug: "puppy-puzzle"
    },
    {
        id: "43",
        nameEn: "Cute Fruit Shaped Erasers Pack | 4+ Erasers",
        nameSi: "පලතුරු හැඩැති මකන 4",
        category: "Stationery",
        price: 180,
        image: "/shop/images/products/fruit-eraser.png",
        slug: "clay-set"
    },
    {
        id: "44",
        nameEn: "Ring Toss Game for Kids | Car",
        nameSi: "රින් ටොස් ගේම්",
        category: "Toys & Puzzles",
        price: 230,
        image: "/shop/images/products/ringtoss-car.png",
        slug: "ringtoss-car"
    },
    {
        id: "45",
        nameEn: "Ring Toss Game for Kids | Unicorn",
        nameSi: "රින් ටොස් ගේම්",
        category: "Toys & Puzzles",
        price: 230,
        image: "/shop/images/products/ringtoss-unicorn.png",
        slug: "ringtoss-unicorn"
    },
    {
        id: "46",
        nameEn: "Plastic Solids for Kids",
        nameSi: "ඝන වස්තු",
        category: "Stationery",
        price: 330,
        image: "/shop/images/products/solids.png",
        slug: "plastic-solids"
    },
    {
        id: "47",
        nameEn: "Vneeds Trywax 12pcs",
        nameSi: "පාට 12 පැස්ටල්",
        category: "Stationery",
        price: 190,
        image: "/shop/images/products/vneeds-trywax-12.jpg",
        slug: "vneeds-trywax-twelve"
    },
    {
        id: "48",
        nameEn: "Fang Feng Water Colour Pens 12Pcs",
        nameSi: "ප්ලැටිග්නම් පාට 12",
        category: "Stationery",
        price: 480,
        image: "/shop/images/products/watercolour-pens.png",
        slug: "water-colour-pens"
    },
    {
        id: "49",
        nameEn: "Traditional Sand Tray | Blue Colour",
        nameSi: "වැලි පීල්ල නිල් පාට",
        category: "Essentials",
        price: 790,
        image: "/shop/images/products/welipillablue.jpg",
        slug: "sandtray-blue"
    },
    {
        id: "50",
        nameEn: "Traditional Sand Tray | Pink Colour",
        nameSi: "වැලි පීල්ල රෝස පාට",
        category: "Essentials",
        price: 790,
        image: "/shop/images/products/welipillared.jpg",
        slug: "sandtray-blue"
    },
    {
        id: "51",
        nameEn: "Non Sharpening Pencil",
        nameSi: "තුඩ මාරු කරන පැන්සල",
        category: "Stationery",
        price: 100,
        image: "/shop/images/products/whisle-pencil1.jpg",
        slug: "nonsharpening-pencil"
    },
    {
        id: "52",
        nameEn: "Wall Chart Set 2x1.5ft| 5 Charts",
        nameSi: "බැනර් 5 පැකේජය",
        category: "Book Packages",
        price: 840,
        image: "/shop/images/packages/banner-package.png",
        slug: "wallchart-tk5"
    },
    {
        id: "53",
        nameEn: "Wall Chart Cards 1.5x1ft| 10 Charts",
        nameSi: "වෝල් චාට් 10 පැකේජය",
        category: "Book Packages",
        price: 990,
        image: "/shop/images/packages/10wallchart.png",
        slug: "wallchart-susara10"
    },
    {
        id: "54",
        nameEn: "A5 Size 15 Story Books for Kids",
        nameSi: "කතා පොත් 15",
        category: "Book Packages",
        price: 1030,
        image: "/shop/images/packages/hadaKata.png",
        slug: "a5-kathapoth15"
    },
    {
        id: "55",
        nameEn: "A4 Size 7 Story Books for Kids",
        nameSi: "කතා පොත් 7",
        category: "Book Packages",
        price: 990,
        image: "/shop/images/packages/lokuKATA.png",
        slug: "a4-kathapoth7"
    },

    {
        id: "56",
        nameEn: "A5 Size 20 Story Books for Kids",
        nameSi: "කතා පොත් 20",
        category: "Book Packages",
        price: 1280,
        image: "/shop/images/packages/kata20.jpg",
        slug: "a5-kathapoth20"
    },

    {
        id: "57",
        nameEn: "A5 Size 30 Story Books for Kids",
        nameSi: "කතා පොත් 30",
        category: "Book Packages",
        price: 1350,
        image: "/shop/images/packages/kata30.jpg",
        slug: "a5-kathapoth30"
    },
    {
        id: "58",
        nameEn: "A4 Size Picture Book Package | 6 Books",
        nameSi: "පින්තුර පොත් 6",
        category: "Book Packages",
        price: 1190,
        image: "/shop/images/packages/picturebook.png",
        slug: "a4-picturebook6"
    },
    {
        id: "59",
        nameEn: "Preschool Book Package | 7 Books",
        nameSi: "පෙරපාසල් පොත් 7ක වැඩපොත් කට්ටලය",
        category: "Book Packages",
        price: 1350,
        image: "/shop/images/packages/preschool7.png",
        slug: "preschool-7books"
    },
];

function displayProducts() {
    const gridContainer = document.getElementById('productsGridContainer');

    if (gridContainer) {
        const root = gridContainer.getAttribute('data-root') || "";
        const targetCategory = gridContainer.getAttribute('data-category');
        const limit = parseInt(gridContainer.getAttribute('data-limit')) || null;
        const targetIdsString = gridContainer.getAttribute('data-ids');

        gridContainer.innerHTML = "";
        let filteredProducts = [...webProducts];

        // A. HTML eke prathama washayenma SPECIFIC IDs thiyenawanam ewa thoragannawa
        if (targetIdsString) {
            const targetIds = targetIdsString.split(',').map(id => id.trim());
            filteredProducts = filteredProducts.filter(prod => targetIds.includes(prod.id.toString()));
            filteredProducts.sort((a, b) => targetIds.indexOf(a.id.toString()) - targetIds.indexOf(b.id.toString()));
        }
        // B. IDs nathnam category eka anuwa filter karagannawa
        else if (targetCategory) {
            filteredProducts = filteredProducts.filter(prod => prod.category === targetCategory);
        }

        // C. Home page ekata badu 6k seema kireema (Limit)
        if (limit) {
            filteredProducts = filteredProducts.slice(0, limit);
        }

        // D. HTML cards render kireema
        filteredProducts.forEach(prod => {
            const cardHTML = `
                <article class="product-card">
                    <!-- <a href="/products/${prod.slug}" class="product-card-img" aria-label="${prod.nameEn}"></a> -->
                        <img src="${root}${prod.image}" alt="${prod.nameEn} - ${prod.nameSi}" loading="lazy">
              
                    <div class="product-card-body">
                        <div class="product-card-cat">${prod.category}</div>
                        <h3 class="product-card-name">
                            <a href="/products/${prod.slug}">${prod.nameEn}</a>
                        </h3>
                        <p class="product-card-name-si si">${prod.nameSi}</p>
                        <div class="product-card-price">
                            <span class="price-current">Rs. ${prod.price.toLocaleString()}</span>
                        </div>
                        <div class="product-card-actions">
                            <button class="btn-add-cart" data-add-cart="" 
                                data-id="${prod.id}"
                                data-name-en="${prod.nameEn}"
                                data-name-si="${prod.nameSi}" 
                                data-price="${prod.price}"
                                data-image="${root}${prod.image}"
                                data-slug="${prod.slug}">
                                <i class="bi bi-bag-plus"></i> Add to Cart
                            </button>
                             <!-- <a href="/products/${prod.slug}" class="btn btn-sm btn-outline-gold">More Details</a> -->
                        </div>
                    </div>
                </article>
            `;
            gridContainer.innerHTML += cardHTML;
        });
    }
}

document.addEventListener('DOMContentLoaded', displayProducts);
