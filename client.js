// /assets/client.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://aecifmxziwddaqihjjey.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Kq-2FsEdgffq0bMt-zfXZg_TbiOJcdP";
const SITE_URL = "https://lorenzodelaunay430-byte.github.io/ldastudio";
const CLIENT_URL = `${SITE_URL}/client.html`;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = (id) => document.getElementById(id);

function setHide(el, hide){ el.classList.toggle('hide', hide); }

function initials(name){
  const s = (name || '').trim();
  if(!s) return "LD";
  return s.split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||"").join("") || "LD";
}

function setPage(key){
  // nav active
  document.querySelectorAll('#nav button').forEach(b=>{
    b.classList.toggle('active', b.dataset.page === key);
  });
  // pages
  document.querySelectorAll('.page').forEach(p=>{
    const is = p.id === `page-${key}`;
    setHide(p, !is);
  });

  const map = {
    dashboard: ["Dashboard","Bienvenue. Tout est centralisé ici."],
    projects: ["Projets","Suivi de tes projets."],
    orders: ["Commandes","Historique et statut."],
    deliverables: ["Livrables","Fichiers & liens."],
    support: ["Support","Tickets & messages."],
    settings: ["Paramètres","Profil & préférences."]
  };
  const [t,s] = map[key] || ["Espace client","—"];
  $("pageTitle").textContent = t;
  $("pageSub").textContent = s;
}

async function showCorrectScreen(){
  const { data: { session } } = await supabase.auth.getSession();
  const logged = !!session?.user;
  setHide($("auth"), logged);
  setHide($("app"), !logged);
  $("btnTopLogout").style.display = logged ? "inline-flex" : "none";

  if(logged){
    await hydrate(session.user);
    await loadAll(session.user.id);
  }
}

async function hydrate(user){
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || meta.user_name || "Client";
  const email = user.email || "—";

  $("avatar").textContent = initials(name);
  $("userName").textContent = name;
  $("userEmail").textContent = email;

  $("pillProvider").textContent = `Provider: ${user.app_metadata?.provider || "email"}`;

  // ensure profile row exists
  await supabase
    .from("profiles")
    .upsert({ id: user.id, email, full_name: name }, { onConflict: "id" });

  // load profile for settings
  const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  $("profileName").value = prof?.full_name || name;

  // plan badge from latest order
  const { data: lastOrder } = await supabase
    .from("orders")
    .select("plan")
    .eq("user_id", user.id)
    .order("created_at", { ascending:false })
    .limit(1);

  $("pillPlan").textContent = `Plan: ${lastOrder?.[0]?.plan || "—"}`;
}

async function loadAll(userId){
  await Promise.all([
    loadProjects(userId),
    loadOrders(userId),
    loadTickets(userId),
    loadDeliverables(userId)
  ]);

  // dashboard metrics
  const pCount = Number($("bProj").textContent || 0);
  const oCount = Number($("bOrders").textContent || 0);
  const tCount = Number($("bTickets").textContent || 0);

  $("mProjects").textContent = String(pCount);
  $("mOrders").textContent = String(oCount);
  $("mTickets").textContent = String(tCount);

  // activity
  const now = new Date().toLocaleString("fr-FR");
  $("activity").innerHTML = `
    <tr><td>${now}</td><td>Connexion</td><td>Session active</td></tr>
    <tr><td>${now}</td><td>Chargement</td><td>Données synchronisées</td></tr>
  `;
}

function emptyRow(cols, msg){
  return `<tr><td colspan="${cols}" style="color:rgba(255,255,255,.62);">${msg}</td></tr>`;
}

async function loadProjects(userId){
  const { data, error } = await supabase
    .from("projects")
    .select("title,status,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending:false });

  if(error){
    $("projectsBody").innerHTML = emptyRow(3, `Erreur: ${error.message}`);
    $("bProj").textContent = "0";
    return;
  }
  $("bProj").textContent = String(data?.length || 0);

  if(!data || data.length === 0){
    $("projectsBody").innerHTML = emptyRow(3, "Aucun projet pour le moment.");
    return;
  }

  $("projectsBody").innerHTML = data.map(r=>{
    const d = r.updated_at ? new Date(r.updated_at).toLocaleDateString("fr-FR") : "—";
    return `<tr><td>${escapeHtml(r.title)}</td><td>${escapeHtml(r.status || "—")}</td><td>${d}</td></tr>`;
  }).join("");
}

async function loadOrders(userId){
  const { data, error } = await supabase
    .from("orders")
    .select("plan,amount,currency,status,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending:false });

  if(error){
    $("ordersBody").innerHTML = emptyRow(4, `Erreur: ${error.message}`);
    $("bOrders").textContent = "0";
    return;
  }
  $("bOrders").textContent = String(data?.length || 0);

  if(!data || data.length === 0){
    $("ordersBody").innerHTML = emptyRow(4, "Aucune commande enregistrée pour le moment.");
    return;
  }

  $("ordersBody").innerHTML = data.map(r=>{
    const d = r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : "—";
    const money = (r.amount != null) ? `${r.amount} ${r.currency || "EUR"}` : "—";
    return `<tr><td>${escapeHtml(r.plan || "—")}</td><td>${escapeHtml(money)}</td><td>${escapeHtml(r.status || "—")}</td><td>${d}</td></tr>`;
  }).join("");
}

async function loadTickets(userId){
  const { data, error } = await supabase
    .from("tickets")
    .select("id,subject,status,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending:false });

  if(error){
    $("ticketsBody").innerHTML = emptyRow(4, `Erreur: ${error.message}`);
    $("bTickets").textContent = "0";
    return;
  }
  $("bTickets").textContent = String(data?.length || 0);

  if(!data || data.length === 0){
    $("ticketsBody").innerHTML = emptyRow(4, "Aucun ticket pour le moment.");
    return;
  }

  $("ticketsBody").innerHTML = data.map(r=>{
    const d = r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : "—";
    return `<tr><td>#${r.id}</td><td>${escapeHtml(r.subject || "—")}</td><td>${escapeHtml(r.status || "open")}</td><td>${d}</td></tr>`;
  }).join("");
}

async function loadDeliverables(userId){
  const { data, error } = await supabase
    .from("deliverables")
    .select("name,type,url,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending:false });

  if(error){
    $("deliverablesBody").innerHTML = emptyRow(4, `Erreur: ${error.message}`);
    $("bDeliv").textContent = "0";
    return;
  }
  $("bDeliv").textContent = String(data?.length || 0);

  if(!data || data.length === 0){
    $("deliverablesBody").innerHTML = emptyRow(4, "Aucun livrable pour le moment.");
    return;
  }

  $("deliverablesBody").innerHTML = data.map(r=>{
    const d = r.created_at ? new Date(r.created_at).toLocaleDateString("fr-FR") : "—";
    const link = r.url ? `<a class="btn" style="padding:7px 10px; font-size:12px;" href="${r.url}" target="_blank" rel="noreferrer">Ouvrir</a>` : "—";
    return `<tr><td>${escapeHtml(r.name || "—")}</td><td>${escapeHtml(r.type || "—")}</td><td>${link}</td><td>${d}</td></tr>`;
  }).join("");
}

async function loginDiscord(){
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: CLIENT_URL }
  });
  if(error) alert(error.message);
}

async function loginEmail(){
  const email = $("email").value.trim();
  const password = $("password").value.trim();
  if(!email || !password) return alert("Email + mot de passe requis.");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if(error) return alert(error.message);

  await showCorrectScreen();
}

async function signupEmail(){
  const email = $("email").value.trim();
  const password = $("password").value.trim();
  if(!email || !password) return alert("Email + mot de passe requis.");

  const { error } = await supabase.auth.signUp({ email, password });
  if(error) return alert(error.message);

  alert("Compte créé. Vérifie ton email si la confirmation est activée.");
  await showCorrectScreen();
}

async function logout(){
  const { error } = await supabase.auth.signOut();
  if(error) alert(error.message);
  await showCorrectScreen();
}

async function sendTicket(){
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) return;

  const subject = $("ticketSubject").value.trim();
  const message = $("ticketMessage").value.trim();
  if(!subject || !message) return alert("Sujet + message requis.");

  const { error } = await supabase.from("tickets").insert({
    user_id: user.id,
    subject,
    message,
    status: "open"
  });

  if(error) return alert(error.message);

  $("ticketSubject").value = "";
  $("ticketMessage").value = "";
  await loadTickets(user.id);
  $("mTickets").textContent = $("bTickets").textContent;
}

async function saveProfile(){
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) return;

  const full_name = $("profileName").value.trim();
  const { error } = await supabase.from("profiles").update({ full_name }).eq("id", user.id);
  if(error) return alert(error.message);

  $("userName").textContent = full_name || $("userName").textContent;
  $("avatar").textContent = initials(full_name);
  alert("Profil sauvegardé.");
}

/* helpers */
function escapeHtml(str){
  return String(str ?? "").replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}

/* events */
$("btnDiscord").addEventListener("click", loginDiscord);
$("btnLogin").addEventListener("click", loginEmail);
$("btnSignup").addEventListener("click", signupEmail);
$("btnLogout").addEventListener("click", logout);
$("btnTopLogout").addEventListener("click", logout);
$("btnSendTicket").addEventListener("click", sendTicket);
$("btnSaveProfile").addEventListener("click", saveProfile);

document.querySelectorAll('#nav button').forEach(b=>{
  b.addEventListener('click', ()=> setPage(b.dataset.page));
});

/* init */
setPage("dashboard");
await showCorrectScreen();

supabase.auth.onAuthStateChange(async ()=>{
  await showCorrectScreen();
});
