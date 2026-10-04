/* ── Buy Now (Achat Direct) ── */
function openBuyNow(id){
const p=products.find(x=>x.id===id);if(!p||!p.stock){showToast('❌','Rupture');return;}
const ol=document.getElementById('buynowOverlay');const el=document.getElementById('buynowModal');
el.innerHTML='<button class="bn-close" onclick="document.getElementById(\\'buynowOverlay\\').classList.remove(\\'open\\')" style="float:right;background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;">✕</button><div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;"><div style="background:url('+p.img+') center/cover;border-radius:12px;min-height:260px;"></div><div><div style="font-size:0.5rem;text-transform:uppercase;letter-spacing:3px;color:var(--rose-dark);font-weight:600;">'+p.cat+'</div><h2 style="font-family:\\'Playfair Display\\',serif;font-size:1.2rem;font-weight:600;margin:0.3rem 0;">'+p.name+'</h2><div style="font-size:1.2rem;font-weight:600;color:var(--rose-dark);margin-bottom:0.3rem;">'+fmtDZD(p.price)+'</div><div style="font-size:0.55rem;color:var(--text-muted);margin-bottom:0.5rem;">🧵 '+(p.materiau||'—')+'</div><hr style="border:none;border-top:1px solid var(--border);margin:0.5rem 0;"><form id="bnForm"><div style="margin-bottom:0.5rem;"><label style="font-size:0.55rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:600;display:block;">Nom complet</label><input type="text" id="bnName" placeholder="Votre nom" required style="width:100%;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:10px;font-family:inherit;font-size:0.75rem;"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.5rem;"><div><label style="font-size:0.55rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:600;display:block;">Téléphone</label><input type="tel" id="bnPhone" placeholder="05XX XX XX XX" required style="width:100%;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:10px;font-family:inherit;font-size:0.75rem;"></div><div><label style="font-size:0.55rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:600;display:block;">Wilaya</label><select id="bnWilaya" required style="width:100%;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:10px;font-family:inherit;font-size:0.75rem;"><option value="">Choisissez...</option><option>Alger</option><option>Oran</option><option>Constantine</option><option>Annaba</option><option>Sétif</option><option>Blida</option><option>Tizi Ouzou</option><option>Bejaia</option><option>Autre</option></select></div></div><div style="margin-bottom:0.5rem;"><label style="font-size:0.55rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:600;display:block;">Paiement</label><select id="bnPayment" style="width:100%;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:10px;font-family:inherit;font-size:0.75rem;"><option value="cash">À la livraison</option><option value="ccp">CCP</option><option value="baridi">BaridiMob</option><option value="edahabia">Edahabia</option></select></div><div style="margin-bottom:0.5rem;"><label style="font-size:0.55rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:600;display:block;">Adresse</label><textarea id="bnAddress" placeholder="Rue, numéro, cité..." required style="width:100%;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:10px;font-family:inherit;font-size:0.75rem;min-height:50px;"></textarea></div></form><div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:700;color:var(--rose-dark);margin:0.5rem 0;"><span>Total</span><span>'+fmtDZD(p.price)+'</span></div><button class="btn btn-primary" onclick="submitBuyNow('+p.id+')" style="width:100%;padding:0.6rem;">✅ Confirmer la commande</button></div></div>';
ol.classList.add('open');
}
function submitBuyNow(id){
const p=products.find(x=>x.id===id);if(!p)return;
const name=document.getElementById('bnName').value.trim();
const phone=document.getElementById('bnPhone').value.trim();
const wilaya=document.getElementById('bnWilaya').value;
const address=document.getElementById('bnAddress').value.trim();
if(!name||!phone||!wilaya||!address){showToast('⚠️','Remplissez tous les champs');return;}
const ref='VL-'+Math.floor(1000+Math.random()*9000);
const order={id:ref,name:name,phone:phone,wilaya:wilaya,address:address,payment:document.getElementById('bnPayment').value,notes:'',items:[{name:p.name,qty:1,price:p.price}],total:p.price,date:new Date().toISOString(),status:'pending'};
const all=JSON.parse(localStorage.getItem('vl_orders')||'[]');all.push(order);localStorage.setItem('vl_orders',JSON.stringify(all));
p.stock=Math.max(0,p.stock-1);
document.getElementById('buynowOverlay').classList.remove('open');
showToast('✨','Commande confirmée ! Réf: '+ref);
}

/* ── ♥ Wishlist (Favoris) ── */
function toggleWishlist(id) {
  let wl = JSON.parse(localStorage.getItem('vl_wishlist') || '[]');
  const idx = wl.indexOf(id);
  if (idx > -1) {
    wl.splice(idx, 1);
    showToast('♡', 'Retiré des favoris');
  } else {
    wl.push(id);
    showToast('♥', 'Ajouté aux favoris');
  }
  localStorage.setItem('vl_wishlist', JSON.stringify(wl));
  updateWishlistUI();
  renderProducts();
}

function isInWishlist(id) {
  const wl = JSON.parse(localStorage.getItem('vl_wishlist') || '[]');
  return wl.indexOf(id) > -1;
}

function updateWishlistUI() {
  const wl = JSON.parse(localStorage.getItem('vl_wishlist') || '[]');
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    badge.textContent = wl.length;
    badge.classList.toggle('show', wl.length > 0);
  }
}

/* ── Quick View Modal ── */
function quickView(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const ol = document.getElementById('quickViewOverlay');
  const el = document.getElementById('quickViewModal');
  const inWl = isInWishlist(id);
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  el.innerHTML = '<button class="qv-close" onclick="closeQuickView()">✕</button>' +
    '<div class="qv-grid">' +
    '<div class="qv-image-wrap"><div class="qv-image" style="background-image:url(' + p.img + ')"></div></div>' +
    '<div class="qv-details">' +
    '<div class="qv-cat">' + p.cat + '</div>' +
    '<h2 class="qv-name">' + p.name + '</h2>' +
    '<div class="qv-price">' + fmtDZD(p.price) + '</div>' +
    '<div class="qv-stars">' + '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars) + '</div>' +
    '<p class="qv-desc">' + (p.desc || 'Description du produit') + '</p>' +
    '<div class="qv-meta"><span>🧵 ' + (p.materiau || '—') + '</span><span>👗 ' + (p.fit || '—') + '</span></div>' +
    '<div class="qv-section"><label>Taille</label><div class="qv-sizes">' +
    sizes.map(function(s) { return '<button class="qv-size-btn' + (s === 'M' ? ' selected' : '') + '" onclick="selectSize(this)">' + s + '</button>'; }).join('') +
    '</div></div>' +
    '<div class="qv-section"><label>Quantité</label><div class="qv-qty">' +
    '<button onclick="changeQty(-1)">−</button><span id="qvQty">1</span><button onclick="changeQty(1)">+</button></div></div>' +
    '<div class="qv-actions">' +
    '<button class="btn btn-primary" onclick="quickViewAddToCart(' + p.id + ')">🛒 Ajouter au panier</button>' +
    '<button class="qv-wish-btn' + (inWl ? ' active' : '') + '" onclick="var self=this;toggleWishlist(' + p.id + ');self.classList.toggle(\\'active\\');self.textContent=self.classList.contains(\\'active\\')?\\'♥\\':\\'♡\\';">' + (inWl ? '♥' : '♡') + '</button></div></div></div>';
  ol.classList.add('open');
}

function closeQuickView() {
  document.getElementById('quickViewOverlay').classList.remove('open');
}

function selectSize(btn) {
  document.querySelectorAll('.qv-size-btn').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
}

function changeQty(delta) {
  var el = document.getElementById('qvQty');
  var q = parseInt(el.textContent) + delta;
  if (q < 1) q = 1;
  if (q > 10) q = 10;
  el.textContent = q;
}

function quickViewAddToCart(id) {
  var p = products.find(function(x) { return x.id === id; });
  if (!p) return;
  var qty = parseInt(document.getElementById('qvQty').textContent);
  for (var i = 0; i < qty; i++) {
    var ex = cart.find(function(x) { return x.id === id; });
    if (ex) ex.qty++;
    else cart.push(Object.assign({}, p, { qty: 1 }));
  }
  updateCart();
  closeQuickView();
  showToast('✅', qty + '× ' + p.name + ' ajouté !');
}

/* ── Sort Products ── */
function sortProducts(order) {
  if (order === 'default') {
    products.sort(function(a, b) { return a.id - b.id; });
  } else if (order === 'low-high') {
    products.sort(function(a, b) { return a.price - b.price; });
  } else if (order === 'high-low') {
    products.sort(function(a, b) { return b.price - a.price; });
  }
  renderProducts();
}

/* ── Empty Cart HTML ── */
function getEmptyCartHTML() {
  return '<div class="empty-cart">' +
    '<div class="empty-cart-icon">🛍️</div>' +
    '<h3>Votre sac est vide</h3>' +
    '<p>Découvrez notre collection et ajoutez vos coups de cœur.</p>' +
    '<button class="btn btn-primary" onclick="toggleCart();setTimeout(function(){document.getElementById(\\'collection\\').scrollIntoView({behavior:\\'smooth\\'})},300);">Découvrir la collection</button></div>';
}
