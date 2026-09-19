const $=s=>document.querySelector(s);
let items=[{name:"Design sprint",qty:1,price:1200},{name:"Development",qty:1,price:2400}];
function money(n){return $("#currency").value+Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2})}
function sum(){return items.reduce((t,i)=>t+(Number(i.qty)||0)*(Number(i.price)||0),0)}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(){const box=$("#items");box.innerHTML="";items.forEach((i,n)=>{const d=document.createElement("div");d.className="item";d.innerHTML='<input data-i="'+n+'" data-k="name" aria-label="Service" value="'+esc(i.name)+'"><input data-i="'+n+'" data-k="qty" type="number" min="0" step="1" aria-label="Quantity" value="'+i.qty+'"><input data-i="'+n+'" data-k="price" type="number" min="0" step="0.01" aria-label="Price" value="'+i.price+'"><button type="button" data-r="'+n+'" aria-label="Remove">×</button>';box.appendChild(d)})}
function update(){const t=sum(),p=Math.max(0,Math.min(100,Number($("#deposit").value)||0)),dep=t*p/100,bal=t-dep,title=$("#title").value.trim()||"Untitled project",client=$("#client").value.trim()||"Client";$("#outTitle").textContent=title;$("#outClient").textContent="Prepared for "+client;$("#outTotal").textContent=money(t);$("#outDeposit").textContent=money(dep);$("#outBalance").textContent=money(bal);$("#outNote").textContent=$("#note").value||"Payment terms";$("#outItems").innerHTML=items.map(i=>'<div class="row"><span>'+esc(i.name)+'</span><b>'+money((Number(i.qty)||0)*(Number(i.price)||0))+"</b></div>").join("");document.title=title+" — Revenue Dock"}
function save(){localStorage.setItem("revenue-dock",JSON.stringify({title:$("#title").value,client:$("#client").value,currency:$("#currency").value,deposit:$("#deposit").value,note:$("#note").value,items}));const b=$("#save"),x=b.textContent;b.textContent="Saved ✓";setTimeout(()=>b.textContent=x,900)}
function load(){try{const d=JSON.parse(localStorage.getItem("revenue-dock")||"null");if(!d)return;$("#title").value=d.title||"";$("#client").value=d.client||"";$("#currency").value=d.currency||"$";$("#deposit").value=d.deposit??50;$("#note").value=d.note||"";if(Array.isArray(d.items)&&d.items.length)items=d.items}catch{}}
$("#offerForm").addEventListener("submit",e=>{e.preventDefault();update()});
$("#add").addEventListener("click",()=>{items.push({name:"New service",qty:1,price:0});render();update()});
$("#save").addEventListener("click",save);$("#print").addEventListener("click",()=>{update();window.print()});
$("#items").addEventListener("input",e=>{const i=e.target.dataset.i,k=e.target.dataset.k;if(i===undefined)return;items[Number(i)][k]=k==="name"?e.target.value:Number(e.target.value);update()});
$("#items").addEventListener("click",e=>{const i=e.target.dataset.r;if(i===undefined)return;items.splice(Number(i),1);render();update()});
["title","client","deposit","note"].forEach(id=>$( "#"+id).addEventListener("input",update));
$("#currency").addEventListener("change",update);
document.querySelectorAll(".wallet").forEach(w=>w.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(w.dataset.copy);const b=w.querySelector("b"),old=b.textContent;b.textContent=old+" • copied";setTimeout(()=>b.textContent=old,900)}catch{}}));
load();render();update();