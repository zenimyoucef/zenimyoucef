/* Existing product and cart contracts stay authoritative. */
let compared = new Set();
const categoryNames={laptops:'Ordinateur portable',phones:'Téléphone',audio:'Audio'};
function renderProducts(){
 const list=tab==='all'?products:products.filter(p=>p.tab===tab);
 document.getElementById('productGrid').innerHTML=list.map(p=>`<article class="product-card"><div class="pc-img"><img src="${p.img}" alt="${p.name.replaceAll('"','&quot;')}" loading="lazy" width="600" height="400"></div><div class="pc-body"><div class="pc-cat">${categoryNames[p.tab]}</div><h3>${p.name}</h3><div class="pc-price">${fmtDZD(p.price)}</div><p class="pc-specs">${p.specs.join(' · ')}</p><div class="pc-actions"><button class="pc-buy" onclick="openDetail(${p.id})">Découvrir →</button><button class="pc-detail" onclick="addToCart(${p.id})" aria-label="Ajouter ${p.name.replaceAll('"','&quot;')} au panier">Ajouter</button></div><label class="compare-check"><input type="checkbox" data-compare="${p.id}" ${compared.has(p.id)?'checked':''} onchange="toggleCompare(${p.id},this)">Comparer</label></div></article>`).join('');
}
function toggleCompare(id,input){
 if(compared.has(id))compared.delete(id);else if(compared.size<3)compared.add(id);else{if(input)input.checked=false;showToast('','Comparez jusqu’à trois produits.');return;}
 renderComparison();document.querySelectorAll('[data-compare]').forEach(el=>el.checked=compared.has(Number(el.dataset.compare)));
}
function renderComparison(){
 const list=products.filter(p=>compared.has(p.id));
 document.getElementById('compareCount').textContent=`${list.length} / 3 produits`;
 const host=document.getElementById('comparisonTable');
 if(!list.length){host.innerHTML='<p class="compare-empty">Sélectionnez « Comparer » sous un produit.<br>Prix, usage et caractéristiques réunis pour décider.</p>';return;}
 const rows=[['Prix',p=>fmtDZD(p.price)],['Catégorie',p=>categoryNames[p.tab]],['Caractéristiques',p=>p.specs.join(' · ')]];
 host.innerHTML=`<table><thead><tr><th scope="col">Votre sélection</th>${list.map(p=>`<th scope="col" data-product="${p.id}"><img src="${p.img}" alt="" loading="lazy">${p.name}<button onclick="toggleCompare(${p.id})" aria-label="Retirer ${p.name.replaceAll('"','&quot;')} de la comparaison">Retirer ×</button></th>`).join('')}</tr></thead><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${label}</th>${list.map(p=>`<td>${value(p)}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">En savoir plus</th>${list.map(p=>`<td><button class="btn btn-ghost" onclick="openDetail(${p.id})">Découvrir</button></td>`).join('')}</tr></tbody></table>`;
}
function recommend(){
 const need=document.getElementById('quizNeed').value,budget=Number(document.getElementById('quizBudget').value);
 const categories={work:['laptops'],create:['laptops','phones'],play:['laptops','audio'],travel:['phones','audio']}[need];
 const list=products.filter(p=>categories.includes(p.tab)&&p.price<=budget).sort((a,b)=>b.price-a.price).slice(0,2);
 const host=document.getElementById('quizResult');host.classList.add('open');
 host.innerHTML=list.length?list.map(p=>`<article class="quiz-product"><img src="${p.img}" alt="" loading="lazy"><div class="qp-info"><h4>${p.name}</h4><span>${fmtDZD(p.price)}</span><p>Dans votre budget · ${p.specs[0]}</p><button onclick="openDetail(${p.id})">Voir les détails →</button></div></article>`).join(''):'<p>Aucun appareil adapté dans ce budget. Essayez un budget supérieur ou un autre usage.</p>';
}
function chooseNeed(need){document.getElementById('quizNeed').value=need;recommend();document.getElementById('quiz').scrollIntoView({behavior:'smooth'});}
function calcInstallments(){const amount=Number(document.getElementById('instAmount').value);const host=document.getElementById('instResults');if(!Number.isFinite(amount)||amount<10000){host.innerHTML='<p role="alert">Saisissez un montant d’au moins 10 000 DZD.</p>';return;}host.innerHTML=[3,6,12].map(n=>`<div class="inst-option"><div class="io-number">${fmtDZD(amount/n)}</div><div class="io-label">par mois · ${n} mensualités</div></div>`).join('');}
renderProducts();renderComparison();recommend();calcInstallments();
