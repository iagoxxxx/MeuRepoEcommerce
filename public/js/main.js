async function loadBanners() {
    const res = await fetch('/api/banners');
    const banners = await res.json();
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = '';

    if (banners.length === 0) {
        document.getElementById('promo-banners').style.display = 'none';
        return;
    }

    banners.forEach((b, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <a href="${b.link || '#'}" target="_blank">
                <img src="${b.image}" class="d-block w-100" alt="${b.alt || ''}" onerror="this.src='https://via.placeholder.com/800x400?text=Banner+não+encontrado'">
            </a>
        `;
        carouselInner.appendChild(item);
    });
}

// Função de busca
document.getElementById('search-input').addEventListener('input', filterProducts);

function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const products = document.querySelectorAll('#products .card');
    products.forEach(card => {
        const name = card.querySelector('.card-title').textContent.toLowerCase();
        const brand = card.querySelector('.card-text') ? card.querySelector('.card-text').textContent.toLowerCase() : '';
        card.style.display = (name.includes(query) || brand.includes(query)) ? 'block' : 'none';
    });
}

// Carregar banners + produtos
document.addEventListener('DOMContentLoaded', () => {
    loadBanners();
    loadProducts();
});

async function loadProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();

    const container = document.getElementById('products');
    container.innerHTML = '';

    // Agrupa produtos por marca
    const brands = [...new Set(products.map(p => p.brand))];

    brands.forEach(brand => {
        const brandSection = document.createElement('div');
        brandSection.innerHTML = `<h3 class="mt-4 mb-3">${brand}</h3>`;
        container.appendChild(brandSection);

        const row = document.createElement('div');
        row.className = 'row g-4';

        products.filter(p => p.brand === brand).forEach(p => {
            const col = document.createElement('div');
            col.className = 'col-md-4';

            const flavorsList = p.flavors ? `<ul class="flavors-list">${p.flavors.map(f => `<li>${f}</li>`).join('')}</ul>` : '';

            col.innerHTML = `
                <div class="card h-100" onclick="window.open('${p.groupLink}', '_blank')">
                    <img src="${p.image}" class="card-img-top" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+não+encontrada'">
                    <div class="card-body text-center">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="card-text price">${p.price}</p>
                        <p class="card-text description">${p.description || ''}</p>
                        ${flavorsList}
                        <a href="${p.whatsapp}" target="_blank" class="btn btn-success">Contate-me</a>
                    </div>
                </div>
            `;
            row.appendChild(col);
        });

        container.appendChild(row);
    });

}

loadProducts();
