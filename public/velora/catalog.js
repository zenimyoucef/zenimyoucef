const catalogLabels={dresses:'Robes',tops:'Hauts',bottoms:'Pantalons',outerwear:'Vestes & manteaux',accessories:'Accessoires'};
const generatedPhotos={3:'knit',4:'shirt',7:'coat',8:'jacket',9:'scarf',13:'shirt'};
products.forEach(p=>{p.img=p.id===11?'assets/campaign.webp':generatedPhotos[p.id]?`assets/${generatedPhotos[p.id]}.webp`:`assets/product-${p.id}.webp`;});
Object.assign(products.find(p=>p.id===1),{name:'Robe Rouge',desc:'Une robe longue rouge, à la silhouette fluide.',materiau:'Composition à confirmer',fit:'Coupe fluide'});
Object.assign(products.find(p=>p.id===12),{name:'Pantalon Rose Poudré',desc:'Un pantalon à taille haute dans une nuance rose poudré.',materiau:'Composition à confirmer',fit:'Jambe fuselée'});
Object.assign(products.find(p=>p.id===5),{name:'Pantalon à Pinces',desc:'Un pantalon rose à pinces pour composer votre silhouette.',materiau:'Composition à confirmer',fit:'Jambe fuselée'});
Object.assign(products.find(p=>p.id===14),{name:'Sac Le Quotidien',desc:'Un sac rouge structuré pour vos essentiels.',materiau:'Composition à confirmer',fit:'Taille unique'});
Object.assign(products.find(p=>p.id===10),{name:'Sac Rouge Structuré',desc:'Une silhouette rouge à poignée et bandoulière.',materiau:'Composition à confirmer',fit:'Taille unique'});
Object.assign(products.find(p=>p.id===9),{name:'Écharpe Sable',desc:'Une écharpe douce couleur sable, pour les journées fraîches.',materiau:'Laine',fit:'Taille unique'});
cart.forEach(item=>{const current=products.find(p=>p.id===item.id);if(current){item.img=current.img;item.name=current.name;}});
const previewNote=document.createElement('p');previewNote.className='catalog-preview-note';previewNote.textContent='Collection de démonstration · Prix, compositions et disponibilités à titre d’exemple.';document.querySelector('.collection-header').after(previewNote);

function renderProducts(){
 let visible=products.filter(p=>filter==='all'||filter==='wishlist'&&isInWishlist(p.id)||p.cat===filter);
 if(productSearchTerm)visible=visible.filter(p=>`${p.name} ${p.desc} ${p.materiau}`.toLocaleLowerCase('fr').includes(productSearchTerm));
 const sort=document.querySelector('.sort-select').value;
 if(sort==='low-high')visible=[...visible].sort((a,b)=>a.price-b.price);
 else if(sort==='high-low')visible=[...visible].sort((a,b)=>b.price-a.price);
 else if(matchMedia('(max-width:768px)').matches&&filter==='all'&&!productSearchTerm){
  const editorialOrder=[11,12,13,3];
  visible=[...visible].sort((a,b)=>(editorialOrder.includes(a.id)?editorialOrder.indexOf(a.id):editorialOrder.length)-(editorialOrder.includes(b.id)?editorialOrder.indexOf(b.id):editorialOrder.length));
 }
 document.getElementById('skeletonGrid').style.display='none';
 const grid=document.getElementById('productGrid');grid.style.display='grid';
 document.getElementById('searchStatus').textContent=`${visible.length} pièce${visible.length===1?'':'s'}`;
 grid.innerHTML=visible.length?visible.map(p=>`<article class="lookbook-item" data-product="${p.id}"><button class="wishlist-heart ${isInWishlist(p.id)?'active':''}" onclick="toggleWishlist(${p.id})" aria-label="${isInWishlist(p.id)?'Retirer des':'Ajouter aux'} favoris : ${p.name}" aria-pressed="${isInWishlist(p.id)}"><span aria-hidden="true">${isInWishlist(p.id)?'♥':'♡'}</span></button><button class="lb-img-wrap" onclick="quickView(${p.id})" aria-label="Découvrir ${p.name}"><img src="${p.img}" alt="${p.name}" width="600" height="800" loading="lazy"></button><div class="lb-info"><p class="lb-cat">${catalogLabels[p.cat]}</p><h3>${p.name}</h3><p class="lb-price">${fmtDZD(p.price)}</p><div class="product-actions"><button class="btn btn-primary" onclick="quickView(${p.id})">Choisir ma taille</button><button class="btn btn-secondary" onclick="quickView(${p.id})">Aperçu</button></div></div></article>`).join(''):'<div class="catalog-empty"><p>Aucune pièce ne correspond à votre recherche.</p><button class="btn btn-secondary" onclick="resetCatalog()">Voir toute la collection</button></div>';
}
function sortProducts(){renderProducts();}
matchMedia('(max-width:768px)').addEventListener('change',()=>renderProducts());
function resetCatalog(){filter='all';productSearchTerm='';document.getElementById('productSearch').value='';document.querySelectorAll('.filter-links a').forEach((a,i)=>a.classList.toggle('active',i===0));renderProducts();}
function addToCart(id){quickView(id);}
const originalQuickView=quickView;
let lastProductFocus;
quickView=function(id){
 lastProductFocus=document.activeElement;originalQuickView(id);
 const modal=document.getElementById('quickViewModal');modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label',products.find(p=>p.id===id).name);
 const close=modal.querySelector('.qv-close');close.setAttribute('aria-label','Fermer l’aperçu');close.focus();
 if(products.find(p=>p.id===id).cat==='accessories')modal.querySelector('.qv-sizes').innerHTML='<button class="qv-size-btn selected" type="button">Unique</button>';
};
const originalCloseQuickView=closeQuickView;
closeQuickView=function(){originalCloseQuickView();lastProductFocus?.focus();};
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&document.getElementById('quickViewOverlay').classList.contains('open'))closeQuickView();
 if(e.key!=='Tab'||!document.getElementById('quickViewOverlay').classList.contains('open'))return;
 const controls=[...document.getElementById('quickViewModal').querySelectorAll('button,a,input,select')].filter(el=>!el.disabled);
 const first=controls[0],last=controls.at(-1);
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
function submitOrder(){
 const name=document.getElementById('ofName').value.trim(),phone=document.getElementById('ofPhone').value.trim(),address=document.getElementById('ofAddress').value.trim();
 if(!name||!/^\+?[\d\s()-]{9,18}$/.test(phone)||!address){showToast('','Indiquez votre nom, un téléphone valide et votre adresse.');return;}
 if(!cart.length){showToast('','Ajoutez une pièce à votre panier.');return;}
 const ref=`VL-${Date.now().toString(36).toUpperCase()}`;
 const orders=JSON.parse(localStorage.getItem('vl_orders')||'[]');
 orders.push({id:ref,name,phone,address,wilaya:document.getElementById('ofWilaya').value,payment:document.getElementById('ofPayment').value,items:cart.map(p=>({id:p.id,name:p.name,size:p.size||'M',qty:p.qty,price:p.price})),total:cart.reduce((s,p)=>s+p.qty*p.price,0),date:new Date().toISOString(),status:'draft'});
 localStorage.setItem('vl_orders',JSON.stringify(orders));showToast('',`Demande enregistrée dans ce navigateur · ${ref}`);
}
renderProducts();updateCart();
const campaignHero=document.querySelector('.reference-hero');
function updateCampaignComposition(){
 const frame=document.querySelector('.campaign-background');
 const width=frame.clientWidth,height=frame.clientHeight;
 const scale=Math.max(width/1505,height/1045);
 const offsetY=(1045*scale-height)/2,offsetX=(1505*scale-width)/2;
 const contour=[[24,65],[26,30.8],[28,26],[32,22],[37,20],[42,21],[46,24],[49,30.8],[56,65]];
 document.querySelector('.campaign-foreground').style.clipPath=`polygon(${contour.map(([x,y])=>`${(x/100*1505*scale-offsetX)/width*100}% ${(y/100*1045*scale-offsetY)/height*100}%`).join(',')})`;
 const masthead=document.querySelector('.velora-masthead');
 masthead.style.transform=innerWidth>768?`scaleX(${campaignHero.clientWidth*.87/masthead.scrollWidth})`:'none';
}
new ResizeObserver(updateCampaignComposition).observe(campaignHero);
document.fonts.ready.then(updateCampaignComposition);
