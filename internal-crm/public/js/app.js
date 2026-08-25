const KEY='devlogics-crm-final-v5';
let filters={stage:'All'};
let dragged=null;
let columns=[
{id:'contacted',title:'Contacted',limit:5,cards:[
{id:1,name:'Sarah Johnson',company:'Acme Corporation',email:'sarah@acme.com',phone:'+1 555 013 2201',value:12500,source:'Website',assignee:'Devlogics'},
{id:2,name:'Michael Chen',company:'Nova Labs',email:'michael@novalabs.com',phone:'+1 555 013 2202',value:8400,source:'Referral',assignee:'Devlogics'}]},
{id:'meeting',title:'Meeting Booked',limit:4,cards:[
{id:3,name:'Emily Davis',company:'Brightside',email:'emily@brightside.com',phone:'+1 555 013 2203',value:15200,source:'LinkedIn',assignee:'Devlogics'},
{id:4,name:'James Wilson',company:'Orbit Systems',email:'james@orbit.io',phone:'+1 555 013 2204',value:6900,source:'Website',assignee:'Devlogics'}]},
{id:'proposal',title:'Proposal Sent',limit:4,cards:[
{id:5,name:'Olivia Brown',company:'Vertex Group',email:'olivia@vertex.co',phone:'+1 555 013 2205',value:22000,source:'Referral',assignee:'Devlogics'},
{id:6,name:'Daniel Miller',company:'Apex Digital',email:'daniel@apex.digital',phone:'+1 555 013 2206',value:31500,source:'Website',assignee:'Devlogics'}]},
{id:'closed',title:'Closed',limit:null,cards:[
{id:7,name:'Noah Taylor',company:'Northstar',email:'noah@northstar.co',phone:'+1 555 013 2207',value:18750,source:'Referral',assignee:'Devlogics'}]},
{id:'lost',title:'Closed Lost',limit:null,cards:[
{id:8,name:'Emma Williams',company:'Pioneer Labs',email:'emma@pioneer.io',phone:'+1 555 013 2208',value:4500,source:'Website',assignee:'Devlogics'}]}
];

function money(n){return '$'+Number(n||0).toLocaleString()}
function initials(n){return n.split(' ').map(x=>x[0]).join('').slice(0,2)}
function allLeads(){return columns.flatMap(c=>c.cards.map(l=>({...l,stage:c.title,column:c.id})))}
function save(){localStorage.setItem(KEY,JSON.stringify(columns))}
function restore(){try{let x=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(x)&&x.length===columns.length)columns=x}catch(e){}}
function notify(msg='No new notifications.'){toast(msg)}
function toast(msg){document.querySelector('.toast')?.remove();let t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2300)}
function navigate(page){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(page).classList.add('active');
 document.querySelectorAll('.nav button,.side-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 renderAll();
}
document.querySelectorAll('.nav button,.side-link').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));

function renderBoard(){
 const q=(document.getElementById('search')?.value||'').toLowerCase();
 document.getElementById('board').innerHTML=columns.map(c=>{
  const cards=c.cards.filter(l=>(l.name+' '+l.company+' '+l.email).toLowerCase().includes(q));
  const over=c.limit&&c.cards.length>c.limit;
  return `<section class="column" ondragover="allowDrop(event,this)" ondragleave="leaveDrop(this)" ondrop="dropCard(event,'${c.id}')">
  <div class="column-head"><div><h3>${c.title} ${c.limit?`<span class="limit ${over?'over':''}">WIP ${c.cards.length}/${c.limit}</span>`:''}</h3><span class="meta">${c.cards.length} lead${c.cards.length===1?'':'s'}</span></div><button class="column-menu" onclick="notify('${c.title} column menu')">•••</button></div>
  <div class="cards">${cards.map(l=>cardHTML(l,c)).join('')||'<div class="empty">No leads found</div>'}</div>
  <button class="add-card" onclick="openAddLead('${c.id}')">＋ Add lead</button></section>`}).join('');
}
function cardHTML(l,c){return `<button class="lead-card" draggable="true" onclick="openLead(${l.id})" ondragstart="startDrag(event,${l.id},'${c.id}')" ondragend="endDrag(event)">
<div class="card-top"><div class="avatar">${initials(l.name)}</div><span>•••</span></div>
<div class="lead-name">${l.name}</div><div class="company">▣ ${l.company}</div>
<div class="card-info"><span>✉ ${l.email}</span><span>☎ ${l.phone}</span></div>
<div class="assignee"><div class="avatar">${initials(l.assignee)}</div><span>Assigned to <b>${l.assignee}</b></span></div>
<div class="card-bottom"><span>${money(l.value)}</span><span class="status-pill">${c.title}</span></div></button>`}
function startDrag(e,id,columnId){dragged={id,columnId};e.dataTransfer.setData('text/plain',id);e.dataTransfer.effectAllowed='move';e.currentTarget.classList.add('dragging')}
function endDrag(e){e.currentTarget.classList.remove('dragging');document.querySelectorAll('.column').forEach(c=>c.classList.remove('drag-over'));dragged=null}
function allowDrop(e,el){e.preventDefault();el.classList.add('drag-over');e.dataTransfer.dropEffect='move'}
function leaveDrop(el){el.classList.remove('drag-over')}
function dropCard(e,targetId){e.preventDefault();let id=Number(e.dataTransfer.getData('text/plain')||dragged?.id);if(!id)return;let lead=null,from=null;
for(const c of columns){let i=c.cards.findIndex(x=>x.id===id);if(i>-1){lead=c.cards.splice(i,1)[0];from=c;break}}
let target=columns.find(c=>c.id===targetId);document.querySelectorAll('.column').forEach(c=>c.classList.remove('drag-over'));
if(!lead||!target){renderAll();return}target.cards.push(lead);save();renderAll();if(from.id!==target.id)toast(`${lead.name} moved to ${target.title}.`)}

function renderLeads(){
 let q=(document.getElementById('leadSearch')?.value||'').toLowerCase();
 document.getElementById('leadTable').innerHTML=allLeads().filter(l=>(l.name+' '+l.company+' '+l.email).toLowerCase().includes(q)).map(l=>`<tr><td><strong>${l.name}</strong></td><td>${l.company}</td><td>${money(l.value)}</td><td><span class="status-pill">${l.stage}</span></td><td>${l.assignee}</td><td><button class="open-link" onclick="openLead(${l.id})">Open</button></td></tr>`).join('')||'<tr><td colspan="6">No leads found.</td></tr>';
}
function renderContacts(){
 document.getElementById('contactTable').innerHTML=allLeads().map(l=>`<tr><td><strong>${l.name}</strong></td><td>${l.company}</td><td>${l.email}</td><td>${l.phone}</td><td>${l.stage}</td><td><button class="open-link" onclick="openLead(${l.id})">Open</button></td></tr>`).join('');
}
function renderStats(){
 let leads=allLeads(),value=leads.reduce((a,l)=>a+l.value,0);
 document.getElementById('dashStats').innerHTML=[['Total leads',leads.length],['Pipeline value',money(value)],['Meetings booked',columns.find(c=>c.id==='meeting').cards.length],['Closed won',columns.find(c=>c.id==='closed').cards.length]].map(x=>`<div class="stat"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join('');
 document.getElementById('reportStats').innerHTML=[['Total leads',leads.length],['Pipeline value',money(value)],['Proposal value',money(columns.find(c=>c.id==='proposal').cards.reduce((a,l)=>a+l.value,0))],['Closed value',money(columns.find(c=>c.id==='closed').cards.reduce((a,l)=>a+l.value,0))]].map(x=>`<div class="stat"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join('');
 document.getElementById('pipelineMini').innerHTML=columns.map(c=>`<div class="report-row"><span>${c.title}</span><div class="bar"><i style="width:${Math.min(100,c.cards.length*18+10)}%"></i></div><b>${c.cards.length}</b></div>`).join('');
 document.getElementById('reportBars').innerHTML=columns.map(c=>`<div class="report-row"><span>${c.title}</span><div class="bar"><i style="width:${Math.min(100,c.cards.length*18+10)}%"></i></div><b>${c.cards.length}</b></div>`).join('');
 document.getElementById('valueRows').innerHTML=columns.map(c=>`<div class="report-row"><span>${c.title}</span><div class="bar"><i style="width:${Math.min(100,(c.cards.reduce((a,l)=>a+l.value,0)/value*100)||0)}%"></i></div><b>${money(c.cards.reduce((a,l)=>a+l.value,0))}</b></div>`).join('');
}
function renderAll(){renderBoard();renderLeads();renderContacts();renderStats()}


function moveLeadToStage(leadId,targetId){
 const current=columns.find(c=>c.cards.some(x=>x.id===leadId));
 const target=columns.find(c=>c.id===targetId);
 if(!current||!target){showToast('Stage could not be changed.');return}
 if(current.id===target.id){showToast(`Lead is already in ${target.title}.`);return}
 const idx=current.cards.findIndex(x=>x.id===leadId);
 const lead=current.cards.splice(idx,1)[0];
 target.cards.push(lead);
 lead.status=target.title;
 save();
 renderAll();
 closeModal();
 showToast(`${lead.name} moved to ${target.title}.`);
 setTimeout(()=>openLead(lead.id),150);
}

function moveLeadTo(leadId,targetId){
 const target=columns.find(c=>c.id===targetId);
 if(!target){showToast('Target stage not found.');return}
 let lead=null,from=null;
 for(const c of columns){
   const idx=c.cards.findIndex(x=>x.id===leadId);
   if(idx!==-1){lead=c.cards.splice(idx,1)[0];from=c;break}
 }
 if(!lead||!from){showToast('Lead could not be moved.');return}
 target.cards.push(lead);
 lead.status=target.title;
 save();
 render();
 closeModal();
 showToast(`${lead.name} moved to ${target.title}.`);
 setTimeout(()=>openLead(lead.id),120);
}
function saveLeadNote(id){
 const note=document.getElementById('leadNote')?.value?.trim();
 closeModal();
 showToast(note?'Lead note saved.':'Lead changes saved.');
}
function openLead(id){
 const l=allLeads().find(x=>x.id===id); if(!l)return;
 const stageIndex=columns.findIndex(c=>c.cards.some(x=>x.id===id));
 const stage=stageIndex>=0?columns[stageIndex].title:'';
 const next=stageIndex>=0 && stageIndex<columns.length-1 ? columns[stageIndex+1] : null;
 const previous=stageIndex>0 ? columns[stageIndex-1] : null;

 document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" onclick="closeModal()">
 <section class="modal" onclick="event.stopPropagation()">
  <header class="modal-header">
   <div class="modal-title"><div class="avatar">${initials(l.name)}</div><div><h2>${l.name}</h2><p>${l.company} • Lead #${l.id}</p></div></div>
   <button class="icon-btn" onclick="closeModal()">✕</button>
  </header>

  <div class="modal-body">
   <div class="lead-hero">
    <div class="lead-hero-main"><div class="avatar">${initials(l.name)}</div><div><h2>${l.name}</h2><p>${l.company} • ${l.value}</p></div></div>
    <span class="status-pill">${stage}</span>
   </div>

   <div class="pipeline-stepper">
    ${columns.map((c,i)=>`<button type="button" class="pipeline-step ${i===stageIndex?'active':''}" onclick="moveLeadToStage(${l.id},'${c.id}')">${c.title}</button>${i<columns.length-1?'<span class="pipeline-arrow">→</span>':''}`).join('')}
   </div>

   <div style="font-size:11px;color:#8a919c;margin:8px 0 12px">Click any stage above to move this lead directly to that stage.</div>
   <div class="next-stage">
    <span>Current stage: <b>${stage}</b></span>
    ${next?`<button class="workflow-btn primary" onclick="moveLeadToStage(${l.id},'${next.id}')">Move to ${next.title} →</button>`:`<span><b>Pipeline complete</b></span>`}
   </div>

   <div class="section">
    <div class="section-title">Lead information</div>
    <div class="detail-grid">
     <div class="detail-item">✉<div><small>Email</small><strong>${l.email}</strong></div></div>
     <div class="detail-item">☎<div><small>Phone</small><strong>${l.phone}</strong></div></div>
     <div class="detail-item">👤<div><small>Assignee</small><strong>${l.assignee}</strong></div></div>
     <div class="detail-item">▣<div><small>Company</small><strong>${l.company}</strong></div></div>
    </div>
   </div>

   <div class="section">
    <div class="section-title">Activity / history</div>
    <div class="activity">
     <div class="activity-item"><span class="activity-dot"></span><div><strong>Lead opened</strong><small>${stage} stage • CRM</small></div></div>
     <div class="activity-item"><span class="activity-dot"></span><div><strong>Assigned to ${l.assignee}</strong><small>Owner of this lead</small></div></div>
     <div class="activity-item"><span class="activity-dot"></span><div><strong>Deal value ${l.value}</strong><small>Current opportunity value</small></div></div>
    </div>
   </div>

   <div class="section">
    <div class="section-title">Comments</div>
    <textarea id="leadNote" placeholder="Add a note about this lead..."></textarea>
   </div>
  </div>

  <footer class="modal-footer">
   ${previous?`<button class="secondary" onclick="moveLeadTo(${l.id},'${previous.id}')">← ${previous.title}</button>`:''}
   <button class="secondary" onclick="closeModal()">Close</button>
   <button class="primary" onclick="saveLeadNote(${l.id})">Save changes</button>
  </footer>
 </section></div>`;
}
function saveComment(id){closeModal();toast('Lead changes saved successfully.')}
function openAddLead(target='contacted'){
 document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" onclick="closeModal()"><section class="modal" onclick="event.stopPropagation()"><header class="modal-header"><div class="modal-title"><div class="avatar">＋</div><div><h2>Create Lead Card</h2><p>Add a lead to the CRM pipeline</p></div></div><button class="icon-btn" onclick="closeModal()">✕</button></header>
<div class="modal-body"><div class="form-grid">
<div class="field"><label>Name</label><input id="fName" class="field-input" placeholder="Lead name"></div><div class="field"><label>Company</label><input id="fCompany" class="field-input" placeholder="Company"></div>
<div class="field"><label>Email</label><input id="fEmail" class="field-input" placeholder="name@company.com"></div><div class="field"><label>Phone</label><input id="fPhone" class="field-input" placeholder="+1 555 000 0000"></div>
<div class="field"><label>Value</label><input id="fValue" class="field-input" placeholder="10000"></div><div class="field"><label>Assignee</label><input id="fAssignee" class="field-input" value="Devlogics"></div>
<div class="field"><label>Stage</label><select id="fStage" class="field-input">${columns.map(c=>`<option value="${c.id}" ${c.id===target?'selected':''}>${c.title}</option>`).join('')}</select></div>
<div class="field"><label>Source</label><select id="fSource" class="field-input"><option>Website</option><option>Referral</option><option>LinkedIn</option><option>Manual</option></select></div></div></div>
<footer class="modal-footer"><button class="btn" onclick="closeModal()">Cancel</button><button class="primary" onclick="createLead()">Create lead</button></footer></section></div>`;
}
function createLead(){let stage=document.getElementById('fStage').value;let l={id:Date.now(),name:document.getElementById('fName').value.trim()||'New Lead',company:document.getElementById('fCompany').value.trim()||'New Company',email:document.getElementById('fEmail').value.trim()||'lead@example.com',phone:document.getElementById('fPhone').value.trim()||'+1 555 000 0000',value:Number(document.getElementById('fValue').value)||5000,assignee:document.getElementById('fAssignee').value.trim()||'Devlogics',source:document.getElementById('fSource').value};columns.find(c=>c.id===stage).cards.unshift(l);save();closeModal();renderAll();toast('Lead card created successfully.')}
function openAddContact(){openAddLead();toast('You can create the contact as a lead; contacts are linked to CRM leads.')}
function openFilters(){document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" onclick="closeModal()"><section class="modal" onclick="event.stopPropagation()"><header class="modal-header"><div class="modal-title"><div class="avatar">☷</div><div><h2>Filter Leads</h2><p>Choose a pipeline stage</p></div></div><button class="icon-btn" onclick="closeModal()">✕</button></header><div class="modal-body"><div class="field"><label>Stage</label><select id="filterStage" class="field-input"><option>All</option>${columns.map(c=>`<option>${c.title}</option>`).join('')}</select></div></div><footer class="modal-footer"><button class="btn" onclick="closeModal()">Cancel</button><button class="primary" onclick="applyFilter()">Apply filter</button></footer></section></div>`}
function applyFilter(){let s=document.getElementById('filterStage').value;closeModal();if(s==='All'){renderBoard();return}let q=document.getElementById('search').value;let original=columns.map(c=>({...c,cards:[...c.cards]}));columns.forEach(c=>{if(c.title!==s)c.cards=[]});renderBoard();columns.splice(0,columns.length,...original);toast(`Showing ${s} leads.`)}
function closeModal(){document.getElementById('modalRoot').innerHTML=''}
document.getElementById('search').addEventListener('input',renderBoard);document.getElementById('leadSearch').addEventListener('input',renderLeads);


// ==================== SUBTASK 3: BACKEND API INTEGRATION ====================

const API_BASE_URL = window.location.origin + '/api';

// 1. Authentication Integration
window.handleLogin = async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  
  errorDiv.style.display = 'none';
  btn.textContent = 'Signing in...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    
    // Success
    localStorage.setItem('auth_token', data.token);
    checkAuth();
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
  } finally {
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
}

window.checkAuth = function() {
  const token = localStorage.getItem('auth_token');
  if (token) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    fetchLeads();
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
  }
}

// Logout feature (Optional but good practice)
window.logout = function() {
  localStorage.removeItem('auth_token');
  checkAuth();
}
// Hook it to avatar click for testing
document.querySelectorAll('.avatar').forEach(a => {
    if(a.textContent === 'DV') {
        a.style.cursor = 'pointer';
        a.title = 'Logout';
        a.onclick = window.logout;
    }
});

// 2. Fetch Leads from API
window.fetchLeads = async function() {
  const token = localStorage.getItem('auth_token');
  
  // Show loading state in kanban board
  const board = document.getElementById('board');
  if(board) board.innerHTML = '<div style="padding:40px;text-align:center;color:#5F6B73;">Loading leads from API...</div>';
  
  try {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('auth_token');
      checkAuth();
      return;
    }
    
    if (!res.ok) throw new Error('Failed to fetch leads');
    
    const leadsData = await res.json();
    
    // Clear existing mock data
    columns.forEach(c => c.cards = []);
    
    if (leadsData && leadsData.length > 0) {
      leadsData.forEach(lead => {
        const targetCol = columns.find(c => c.id === (lead.stage || 'contacted') || c.title.toLowerCase() === (lead.stage || '').toLowerCase());
        if (targetCol) {
          targetCol.cards.push(lead);
        } else {
          columns[0].cards.push(lead); // fallback
        }
      });
    }
    
    // Save locally to keep existing vanilla logic happy, then render
    save();
    renderAll();
    
    if (leadsData.length === 0) {
      if(board) board.innerHTML = '<div style="padding:40px;text-align:center;color:#5F6B73;">No leads found. Create one to get started!</div>';
    }
    
  } catch (err) {
    console.error(err);
    if(board) board.innerHTML = `<div style="padding:40px;text-align:center;color:#e74c3c;">Error loading leads: ${err.message}</div>`;
  }
}

// Initialize
checkAuth();

window.apiUpdateLeadStage = async function(leadId, targetId) {
  const token = localStorage.getItem('auth_token');
  try {
    await fetch(`${API_BASE_URL}/leads/${leadId}/stage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ stage: targetId })
    });
  } catch(e) {
    console.error('Failed to sync stage update to API', e);
  }
};

const originalDropCard = dropCard;
window.dropCard = function(e, targetId) {
  originalDropCard(e, targetId);
  const id = Number(e.dataTransfer.getData('text/plain') || window.dragged?.id);
  if (id) window.apiUpdateLeadStage(id, targetId);
};

const originalMoveLeadTo = moveLeadTo;
window.moveLeadTo = function(leadId, targetId) {
  originalMoveLeadTo(leadId, targetId);
  window.apiUpdateLeadStage(leadId, targetId);
};

const originalMoveLeadToStage = moveLeadToStage;
window.moveLeadToStage = function(leadId, targetId) {
  originalMoveLeadToStage(leadId, targetId);
  window.apiUpdateLeadStage(leadId, targetId);
};
