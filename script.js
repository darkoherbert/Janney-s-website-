// ====== LOADER & YEAR ======
window.addEventListener('load', () => {
  const l = document.getElementById('loader');
  if (l) { setTimeout(()=> { l.style.opacity='0'; setTimeout(()=> l.style.display='none',500);}, 800); }
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
});

// ====== DATA ======
// Note: some products include sizes/colors arrays; others don't.
const products = [
  { id:1, name:"Ladies Elegant Dress", price:100, category:"Dresses", image:"images/dresse.jpg.jpg",sizes:["S","M","L","XL"],colors:["Blue","Black","Brown","Gray"] },
   { id:2, name:"Ladies Elegant Dress", price:35, category:"Dresses", image:"images/dress.jpg (2).jpg" },
  { id:3, name:"Ladies Short", price:70, category:"Dresses", image:"images/dress.jpg.jpg", colors:["White","Black","Blue"] },
  { id:4, name:"Ladies Crop Top (2 for GH50)", price:50, category:"Dresses", image:"images/Whatcrop.jpg" },
   { id:5, name:"Shirt", price:50, category:"Dresses", image:"images/shirt.jpg",sizes:["M","L","XL","XXL","XXXL"]  },
  { id:6, name:"Short Sleeves", price:50, category:"Dresses", image:"images/short sleeves.jpg",sizes:["M","L","XL","XXL","XXXL"]  },
   { id:7, name:"Ladies Shorts", price:40, category:"Dresses", image:"images/short.jpg", colors:[" Multi-Colours"] },
  { id:8, name:"Ladies Elegant Dress ", price:100, category:"Dresses", image:" images/dresses.jpg", colors:["White","Blue","Pink"], Sizes:["S","M","L","XL"] },
   { id:9, name:"Classic Handbag", price:100, category:"Bags", image:"images/bages.jpg.jpg", colors:["White","Black","Blue","Pink"] },
    { id:10, name:"Classic Handbag", price:50, category:"Bags", image:"images/bags.jpg .jpg", colors:["White","Black","Brown","Pink", "Tinted Beown"] },
    { id:11, name:"Classic Handbag", price:50, category:"Bags", image:"images/bags.jpg", colors:["Multi-Coloures"] },
  { id:12, name:"Beauty Facial Set", price:70, category:"Facial Products", image:"images/facial.jpg.jpg" },
    { id:12, name:"Beauty Facial Set", price:80, category:"Facial Products", image:"images/facial.jpg (2).jpg" },
   { id:13, name:"Beauty Facial Set", price:100, category:"Facial Products", image:"images/Facial product.jpg" },
   { id:14, name:"Face Scrub (3 For GH100)", price: 100, category:"Facial Products", image:" images/Facial product (2).jpg" },
  { id:15, name:"Comfort Flat Shoes", price:55, category:"Flat Shoes", image:"images/low heel.jpg.jpg", sizes:["36","37","38","39","40","41","42","43"],colors:["Red","Black"]  },
  { id:16, name:"Laides Cap(2 For GH50)", price:50, category:"Caps", image:"images/caps.jpg", colors:["White","Black","Pink","Blue"] },
  { id:17, name:"Glasses(2 For GH70)", price:50, category:"Glasses", image:"images/glasses.jpg"  },
  { id:18, name:"Hair Band(3 For GH20)", price:20, category:"Hair Band", image:"images/band.jpg",colors:["All Kinds Of Colours"] },
  { id:19, name:"Classic Handbag", price:60, category:"Bags", image:"images/bags.jpg.jpg", colors:["White","Brown","Black","Pink"] },
   { id:20, name:"Handheld Dumpling Maker 2 For GH50 And 1 For GH30", price:50, category:"Home Appliances", image:"images/home.jpg" },
 { id:21, name:"Microwave Oven", price:800, category:"Home Appliances", image:"images/Home App (3).jpg" },
  { id:22, name:"Rice Cooker", price:370, category:"Home Appliances", image:"images/Home App (2).jpg" },
  { id:23, name:"Multi- Function Blender", price:300, category:"Home Appliances", image:"images/Home App.jpg" },
]

// categories auto from products
const categories = ["All", ...Array.from(new Set(products.map(p=>p.category)))];

// ====== RENDER CATEGORIES ======
const categoryBar = document.getElementById('categoryBar');
categories.forEach(cat=>{
  const btn = document.createElement('button');
  btn.className='category-btn';
  btn.textContent=cat;
  btn.onclick = ()=> filterProducts(cat);
  categoryBar.appendChild(btn);
});
document.querySelector('.category-btn').classList.add('active');

// ====== RENDER PRODUCTS ======
const productArea = document.getElementById('productArea');

function cleanText(s){ return String(s).replace(/<[^>]*>/g,'').trim(); }

function displayProducts(list){
  productArea.innerHTML = '';
  list.forEach(p=>{
    productArea.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${cleanText(p.name)}" onerror="this.style.opacity=0.6" />
        <h3>${p.name}</h3>
        <div class="muted">${p.category}</div>
        <div style="margin:8px 0;font-weight:700">GH¢${p.price.toFixed(2)}</div>
        <button onclick="openOrderModal(${p.id})">Order Now</button>
      </div>
    `;
  });
}
displayProducts(products);

// ====== FILTER & SEARCH ======
function filterProducts(category){
  document.querySelectorAll('.category-btn').forEach(b=>b.classList.remove('active'));
  [...categoryBar.children].find(b=>b.textContent===category)?.classList.add('active');
  if (category==='All') displayProducts(products);
  else displayProducts(products.filter(p=>p.category===category));
}
document.getElementById('searchInput').addEventListener('input', e=>{
  const v = e.target.value.toLowerCase();
  displayProducts(products.filter(p => cleanText(p.name).toLowerCase().includes(v) || p.category.toLowerCase().includes(v)));
});

// ====== ORDER MODAL LOGIC ======
const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');
const optionsArea = document.getElementById('optionsArea');
const qtyVal = document.getElementById('qtyVal');
const qtyInc = document.getElementById('qtyInc');
const qtyDec = document.getElementById('qtyDec');
const unitPriceEl = document.getElementById('unitPrice');
const totalPriceEl = document.getElementById('totalPrice');

let currentProduct = null;
let currentQty = 1;
let selectedSize = null;
let selectedColor = null;

function openOrderModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  currentProduct = p;
  currentQty = 1;
  selectedSize = null;
  selectedColor = null;

  modalImg.src = p.image;
  modalTitle.textContent = cleanText(p.name);
  modalCategory.textContent = p.category || '';
  modalDesc.textContent = ''; // optional description

  // render options
  optionsArea.innerHTML = '';
  if(Array.isArray(p.sizes) && p.sizes.length){
    const g = document.createElement('div'); g.className='option-group';
    g.innerHTML = `<label>Size</label><div class="size-list" id="sizeList"></div>`;
    optionsArea.appendChild(g);
    const sizeList = g.querySelector('#sizeList');
    p.sizes.forEach(s=>{
      const b = document.createElement('button');
      b.className='size-item';
      b.textContent = s;
      b.onclick = ()=> { document.querySelectorAll('.size-item').forEach(x=>x.classList.remove('active')); b.classList.add('active'); selectedSize=s; updateTotal(); };
      sizeList.appendChild(b);
    });
  }
  if(Array.isArray(p.colors) && p.colors.length){
    const g = document.createElement('div'); g.className='option-group';
    g.innerHTML = `<label>Color</label><div class="color-list" id="colorList"></div>`;
    optionsArea.appendChild(g);
    const colorList = g.querySelector('#colorList');
    p.colors.forEach(c=>{
      const b = document.createElement('button');
      b.className='color-item';
      b.textContent = c;
      b.onclick = ()=> { document.querySelectorAll('.color-item').forEach(x=>x.classList.remove('active')); b.classList.add('active'); selectedColor=c; updateTotal(); };
      colorList.appendChild(b);
    });
  }

  // reset qty and prices
  qtyVal.textContent = currentQty;
  unitPriceEl.textContent = `GH¢${p.price.toFixed(2)}`;
  updateTotal();

  // show modal
  orderModal.setAttribute('aria-hidden','false');
}

closeOrderModal.onclick = ()=> { orderModal.setAttribute('aria-hidden','true'); };
document.getElementById('cancelOrder').onclick = ()=> { orderModal.setAttribute('aria-hidden','true'); };

qtyInc.onclick = ()=> { currentQty++; qtyVal.textContent=currentQty; updateTotal(); };
qtyDec.onclick = ()=> { if(currentQty>1) currentQty--; qtyVal.textContent=currentQty; updateTotal(); };

function updateTotal(){
  if(!currentProduct) return;
  const total = currentProduct.price * currentQty;
  totalPriceEl.textContent = `GH¢${total.toFixed(2)}`;
}

// ====== SEND TO WHATSAPP (with validation) ======
document.getElementById('sendWhatsApp').onclick = ()=>{
  // validate required fields
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const location = document.getElementById('custLocation').value.trim();
  const delivery = document.getElementById('deliveryMethod').value;
  const notes = document.getElementById('custNotes').value.trim();

  if(!name){ alert('Please enter your name'); return; }
  if(!phone){ alert('Please enter your phone number'); return; }

  // if product has sizes but none selected -> ask
  if(Array.isArray(currentProduct.sizes) && currentProduct.sizes.length && !selectedSize){
    alert('Please select a size');
    return;
  }
  if(Array.isArray(currentProduct.colors) && currentProduct.colors.length && !selectedColor){
    alert('Please select a color');
    return;
  }

  // build message
  const prodName = cleanText(currentProduct.name);
  const unit = currentProduct.price.toFixed(2);
  const total = (currentProduct.price * currentQty).toFixed(2);
  const imgUrl = `${window.location.origin}/${currentProduct.image}`.replace(/([^:]\/)\/+/g,'$1'); // clean double slashes

  let details = [];
  if(selectedSize) details.push(`Size: ${selectedSize}`);
  if(selectedColor) details.push(`Color: ${selectedColor}`);

  const message =
`🛍️ *New Order Request*

*Customer:* ${name}
*Phone:* ${phone}
*Location:* ${location || 'Not provided'}
*Delivery:* ${delivery}

*Product:* ${prodName}
*Category:* ${currentProduct.category || ''}
${ details.length ? ('*Options:* ' + details.join(' • ')) : '' }
*Quantity:* ${currentQty}
*Unit Price:* GH¢${unit}
*Total Price:* GH¢${total}

🖼️ Product Image:
${imgUrl}

📝 Notes:
${notes || '—'}

Please confirm availability. Thank you! 🙏`;

  const whatsappNumber = "233557063898";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank');

  // close modal
  orderModal.setAttribute('aria-hidden','true');
};

// ====== featured button ======
document.getElementById('featuredBtn').onclick = ()=> displayProducts(products.slice(0,4));

// ====== bottom nav actions (small) ======
document.getElementById('navHome').onclick = ()=> window.scrollTo({top:0,behavior:'smooth'});
document.getElementById('navCategory').onclick = ()=> document.getElementById('categoryBar').scrollIntoView({behavior:'smooth'});
document.getElementById('navSearch').onclick = ()=> document.getElementById('searchInput').focus();
document.getElementById('navAccount').onclick = ()=> alert('Account feature coming soon!');
