// ===== Supabase (LOGIN PAGE) =====
const SUPABASE_URL = "https://aecifmxziwddaqihjjey.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Kq-2FsEdgffq0bMt-zfXZg_TbiOJcdP";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById("loginForm");
const authMsg = document.getElementById("authMsg");
const registerBtn = document.getElementById("registerBtn");
const resetBtn = document.getElementById("resetBtn");

async function goIfLogged(){
  const { data: { user } } = await sb.auth.getUser();
  if (user) window.location.href = "client.html";
}
goIfLogged();

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMsg.textContent = "Connexion…";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error){
    authMsg.textContent = "Erreur : " + error.message;
    return;
  }
  authMsg.textContent = "Connecté ✅";
  window.location.href = "client.html";
});

registerBtn?.addEventListener("click", async () => {
  authMsg.textContent = "Création du compte…";
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;

  const { error } = await sb.auth.signUp({ email, password });
  authMsg.textContent = error ? ("Erreur : " + error.message) : "Compte créé ✅ (connecte-toi)";
});

resetBtn?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  if (!email) { authMsg.textContent = "Mets ton email d’abord."; return; }

  authMsg.textContent = "Envoi du mail…";
  const { error } = await sb.auth.resetPasswordForEmail(email);
  authMsg.textContent = error ? ("Erreur : " + error.message) : "Mail envoyé ✅";
});
