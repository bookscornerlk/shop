// 1. Badu wala list eka (Data Array)
const pics = [
    {
        id: "1",
        image: "Happy Customers/picture (1).jpg",
    },
    {
        id: "2",
        image: "Happy Customers/picture (2).jpg",
    },
    {
        id: "3",
        image: "Happy Customers/picture (3).jpg",
    },
    {
        id: "4",
        image: "Happy Customers/picture (4).jpg",
    },
    {
        id: "5",
        image: "Happy Customers/picture (5).jpg",
    },
    {
        id: "6",
        image: "Happy Customers/picture (6).jpg",
    },
    {
        id: "7",
        image: "Happy Customers/picture (7).jpg",
    },
    {
        id: "8",
        image: "Happy Customers/picture (8).jpg",
    },
    {
        id: "9",
        image: "Happy Customers/picture (9).jpg",
    },
    {
        id: "10",
        image: "Happy Customers/picture (10).jpg",
    },
    {
        id: "11",
        image: "Happy Customers/picture (11).jpg",
    },
    {
        id: "12",
        image: "Happy Customers/picture (12).jpg",
    },
    {
        id: "13",
        image: "Happy Customers/picture (13).jpg",
    },
    {
        id: "14",
        image: "Happy Customers/picture (14).jpg",
    },
    {
        id: "15",
        image: "Happy Customers/picture (15).jpg",
    },
    {
        id: "16",
        image: "Happy Customers/picture (16).jpg",
    },
    {
        id: "17",
        image: "Happy Customers/picture (17).jpg",
    },
    {
        id: "18",
        image: "Happy Customers/picture (18).jpg",
    },
    {
        id: "19",
        image: "Happy Customers/picture (19).jpg",
    },
    {
        id: "20",
        image: "Happy Customers/picture (20).jpg",
    },
    {
        id: "21",
        image: "Happy Customers/picture (21).jpg",
    },
    {
        id: "22",
        image: "Happy Customers/picture (22).jpg",
    },
    {
        id: "23",
        image: "Happy Customers/picture (23).jpg",
    },
    {
        id: "24",
        image: "Happy Customers/picture (24).jpg",
    },
    {
        id: "25",
        image: "Happy Customers/picture (25).jpg",
    },
    {
        id: "26",
        image: "Happy Customers/picture (26).jpg",
    },
    {
        id: "27",
        image: "Happy Customers/picture (27).jpg",
    },
    {
        id: "28",
        image: "Happy Customers/picture (28).jpg",
    },
    {
        id: "29",
        image: "Happy Customers/picture (29).jpg",
    },
    {
        id: "30",
        image: "Happy Customers/picture (30).jpg",
    },
    {
        id: "31",
        image: "Happy Customers/picture (31).jpg",
    },
    {
        id: "32",
        image: "Happy Customers/picture (32).jpg",
    },
    {
        id: "33",
        image: "Happy Customers/picture (33).jpg",
    },
    {
        id: "34",
        image: "Happy Customers/picture (34).jpg",
    },
    {
        id: "35",
        image: "Happy Customers/picture (35).jpg",
    },
    {
        id: "36",
        image: "Happy Customers/picture (36).jpg",
    },
    {
        id: "37",
        image: "Happy Customers/picture (37).jpg",
    },
    {
        id: "38",
        image: "Happy Customers/picture (38).jpg",
    },
    {
        id: "39",
        image: "Happy Customers/picture (39).jpg",
    },
    {
        id: "40",
        image: "Happy Customers/picture (40).jpg",
    },
    {
        id: "41",
        image: "Happy Customers/picture (41).jpg",
    },
    {
        id: "42",
        image: "Happy Customers/picture (42).jpg",
    },
    {
        id: "43",
        image: "Happy Customers/picture (43).jpg",
    },
    {
        id: "44",
        image: "Happy Customers/picture (44).jpg",
    },
    {
        id: "45",
        image: "Happy Customers/picture (45).jpg",
    },
    {
        id: "46",
        image: "Happy Customers/picture (46).jpg",
    },
    {
        id: "47",
        image: "Happy Customers/picture (47).jpg",
    },
    {
        id: "48",
        image: "Happy Customers/picture (48).jpg",
    },
    {
        id: "49",
        image: "Happy Customers/picture (49).jpg",
    },
    {
        id: "50",
        image: "Happy Customers/picture (50).jpg",
    },


];

function displayPics() {
    const gridContainer = document.getElementById('picsGridContainer');

    if (gridContainer) {
        const root = gridContainer.getAttribute('data-root') || "";
        const limit = parseInt(gridContainer.getAttribute('data-limit')) || null;
        const targetIdsString = gridContainer.getAttribute('data-ids');

        gridContainer.innerHTML = "";
        let filteredPics = [...pics];

        // A. HTML eke prathama washayenma SPECIFIC IDs thiyenawanam ewa thoragannawa
        if (targetIdsString) {
            const targetIds = targetIdsString.split(',').map(id => id.trim());
            filteredPics = filteredPics.filter(pic => targetIds.includes(pic.id.toString()));
            filteredPics.sort((a, b) => targetIds.indexOf(a.id.toString()) - targetIds.indexOf(b.id.toString()));
        }



        filteredPics.forEach(pic => {
            const cardHTML = `
        <div class="gallery-item" data-idx="0"
                        data-url="${root}${pic.image}" data-caption="">
                        <img src="${root}${pic.image}" alt="Akuru Kiyaweema ceremony moment 1" loading="eager">
                        <div class="gallery-item-overlay">
                            <i class="bi bi-zoom-in"></i>
                        </div>
                    </div>

            `;
            gridContainer.innerHTML += cardHTML;
            (function () {
            const items = Array.from(document.querySelectorAll('.gallery-item'));
            const lb = document.getElementById('lightbox');
            const lbImg = document.getElementById('lbImg');
            const lbCap = document.getElementById('lbCaption');
            const lbCtr = document.getElementById('lbCounter');
            let current = 0;

            function open(idx) {
                current = idx;
                const item = items[idx];
                lbImg.src = item.dataset.url;
                lbImg.alt = item.dataset.caption || 'AKuru Kiyaweema' + (idx + 1);
                lbCap.textContent = item.dataset.caption || '';
                lbCtr.textContent = (idx + 1) + ' / ' + items.length;
                lb.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function close() {
                lb.classList.remove('active');
                document.body.style.overflow = '';
                lbImg.src = '';
            }

            function prev() { open((current - 1 + items.length) % items.length); }
            function next() { open((current + 1) % items.length); }

            items.forEach((item, i) => item.addEventListener('click', () => open(i)));
            document.getElementById('lbClose').addEventListener('click', close);
            document.getElementById('lbPrev').addEventListener('click', prev);
            document.getElementById('lbNext').addEventListener('click', next);
            lb.addEventListener('click', e => { if (e.target === lb) close(); });

            document.addEventListener('keydown', e => {
                if (!lb.classList.contains('active')) return;
                if (e.key === 'Escape') close();
                if (e.key === 'ArrowLeft') prev();
                if (e.key === 'ArrowRight') next();
            });
        })();
        });
    }
}

document.addEventListener('DOMContentLoaded', displayPics);



