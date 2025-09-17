// === Produtos (já existente) ===
async function loadProducts() {
    const res = await fetch('/api/products');
    const data = await res.json();

    const list = document.getElementById('admin-product-list');
    list.innerHTML = '';

    data.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        col.innerHTML = `
            <div class="card h-100 p-2">
                <img src="${p.image}" class="card-img-top" alt="${p.name}">
                <div class="card-body">
                    <h5>${p.name}</h5>
                    <p>${p.price}</p>
                    <p>WhatsApp: <a href="${p.whatsapp}" target="_blank">Contato</a></p>
                    <p>Grupo: <a href="${p.groupLink}" target="_blank">Entrar</a></p>
                    <p>Marca: ${p.brand}</p>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Excluir</button>
                </div>
            </div>
        `;
        list.appendChild(col);
    });
}

async function deleteProduct(id) {
    await fetch('/api/products/' + id, { method: 'DELETE' });
    loadProducts();
}

document.getElementById('product-form').addEventListener('submit', async e => {
    e.preventDefault();
    const product = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        image: document.getElementById('image').value,
        whatsapp: document.getElementById('whatsapp').value,
        groupLink: document.getElementById('groupLink').value,
        brand: document.getElementById('brand').value
    };

    await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    e.target.reset();
    loadProducts();
});

// === Banners ===
async function loadBanners() {
    const res = await fetch('/api/banners');
    const banners = await res.json();

    const list = document.getElementById('admin-product-list');
    // Adiciona os banners acima dos produtos
    const bannerSection = document.createElement('div');
    bannerSection.className = 'mb-4';
    bannerSection.innerHTML = '<h2>Banners</h2><div id="banner-list" class="row g-3"></div>';
    list.prepend(bannerSection);

    const bannerList = document.getElementById('banner-list');
    bannerList.innerHTML = '';

    banners.forEach(b => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card h-100 p-2">
                <img src="${b.image}" class="card-img-top" alt="${b.alt || ''}">
                <div class="card-body">
                    <p>Link: <a href="${b.link || '#'}" target="_blank">${b.link || '—'}</a></p>
                    <button class="btn btn-danger btn-sm" onclick="deleteBanner(${b.id})">Excluir</button>
                </div>
            </div>
        `;
        bannerList.appendChild(col);
    });
}

async function deleteBanner(id) {
    await fetch('/api/banners/' + id, { method: 'DELETE' });
    loadBanners();
}

document.getElementById('banner-form').addEventListener('submit', async e => {
    e.preventDefault();
    const banner = {
        image: document.getElementById('banner-image').value,
        link: document.getElementById('banner-link').value,
        alt: document.getElementById('banner-alt').value
    };

    await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
    });

    e.target.reset();
    loadBanners();
});

// Carrega produtos e banners ao abrir o painel
document.addEventListener('DOMContentLoaded', () => {
    loadBanners();
    loadProducts();
});
