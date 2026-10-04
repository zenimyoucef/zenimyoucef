let productSearchTerm='';
function changeCartLine(index,delta){cart[index].qty+=delta;if(cart[index].qty<=0)cart.splice(index,1);updateCart();}
function removeCartLine(index){cart.splice(index,1);updateCart();}
function toggleSearch(){const panel=document.getElementById('searchPanel');panel.hidden=!panel.hidden;if(!panel.hidden)document.getElementById('productSearch').focus();}
function searchCollection(value){productSearchTerm=value.trim().toLocaleLowerCase('fr');renderProducts();document.getElementById('collection').scrollIntoView({behavior:'smooth'});}
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('searchPanel').hidden=true;});
const looks={work:[11,12],weekend:[3,6],evening:[2,14]};
function renderLook(){
 const ids=looks[document.getElementById('lookSelect').value];const items=ids.map(id=>products.find(p=>p.id===id));
 document.getElementById('lookImages').innerHTML=items.map(p=>`<img src="${p.img}" alt="${p.name}" loading="lazy" width="600" height="800">`).join('');
 document.getElementById('lookPieces').textContent=items.map(p=>p.name).join(' + ');
 document.getElementById('lookTotal').textContent=fmtDZD(items.reduce((sum,p)=>sum+p.price,0));
}
function addLook(){
 const size=document.getElementById('lookSize').value;if(!size){showToast('','Choisissez votre taille.');return;}
 const ids=looks[document.getElementById('lookSelect').value];
 if(ids.some(id=>!products.find(p=>p.id===id).stock)){showToast('','Une pièce de ce look est épuisée.');return;}
 ids.forEach(id=>{const p=products.find(p=>p.id===id);const keySize=p.cat==='accessories'?'Unique':size;const existing=cart.find(item=>item.id===id&&(item.size||'M')===keySize);if(existing)existing.qty++;else cart.push({...p,size:keySize,qty:1});});updateCart();showToast('','Le look a été ajouté à votre sac.');
}
document.getElementById('lookSelect').addEventListener('change',renderLook);document.getElementById('addLook').addEventListener('click',addLook);renderLook();
document.querySelectorAll('.filter-links a').forEach(el=>{el.setAttribute('role','button');el.tabIndex=0;el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});});
document.querySelectorAll('.of-group').forEach(group=>{const input=group.querySelector('input,select,textarea');const label=group.querySelector('label');if(input&&label)label.htmlFor=input.id;});
