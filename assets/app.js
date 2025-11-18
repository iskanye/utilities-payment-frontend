const baseURL = window.BASE_API_URL || 'http://localhost:8080';

function log(v){
  const out = document.getElementById('log');
  out.textContent = JSON.stringify(v, null, 2);
}

function tokenHeader(){
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function postForm(path, form) {
  const body = new URLSearchParams();
  for (const [k,v] of new FormData(form).entries()) body.append(k, v);
  const res = await fetch(baseURL + path, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' }, tokenHeader()),
    body: body.toString()
  });
  const text = await res.text();
  try { return { status: res.status, body: JSON.parse(text) } } catch(e){ return { status: res.status, body: text } }
}

async function getJSON(path){
  const res = await fetch(baseURL + path, { headers: tokenHeader() });
  const text = await res.text();
  try { return { status: res.status, body: JSON.parse(text) } } catch(e){ return { status: res.status, body: text } }
}

document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const out = await postForm('/users/register', e.target);
  log(out);
});

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const out = await postForm('/users/login', e.target);
  if (out && out.body && out.body.token) localStorage.setItem('token', out.body.token);
  log(out);
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  const res = await postForm('/users/logout', {});
  localStorage.removeItem('token');
  log(res);
});

document.getElementById('listBillsBtn').addEventListener('click', async () => {
  const out = await getJSON('/bills');
  log(out);
});

document.getElementById('getBillBtn').addEventListener('click', async () => {
  const id = document.getElementById('billIdInput').value.trim();
  if (!id) return alert('Provide bill id');
  const out = await getJSON(`/bills/${encodeURIComponent(id)}`);
  log(out);
});

document.getElementById('payForm').addEventListener('submit', async e => {
  e.preventDefault();
  const out = await postForm('/bills/pay', e.target);
  log(out);
});

document.getElementById('createBillForm').addEventListener('submit', async e => {
  e.preventDefault();
  const out = await postForm('/admin/bills', e.target);
  log(out);
});

document.getElementById('whoamiBtn').addEventListener('click', async () => {
  const out = await getJSON('/admin/users');
  log(out);
});

// Show stored token
if (localStorage.getItem('token')) log({ token: 'present' });
