// Importa os SDKs necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCEhq8amIbCjVo1lHEpE3gEmpnSn96e7Bs",
  authDomain: "novaera-d786b.firebaseapp.com",
  projectId: "novaera-d786b",
  storageBucket: "novaera-d786b.firebasestorage.app",
  messagingSenderId: "1084665946573",
  appId: "1:1084665946573:web:81a19c6a998df89913e484",
  databaseURL: "https://novaera-d786b-default-rtdb.firebaseio.com/" // 👈 ADICIONA TEU LINK AQUI
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- LÓGICA DE LOGIN ---
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const dbRef = ref(db);
  get(child(dbRef, `usuarios/${phone}`)).then((snapshot) => {
    if (snapshot.exists()) {
      const user = snapshot.val();
      if (user.senha === password) {
        alert("✅ Login bem-sucedido!");
        localStorage.setItem("usuarioAtivo", phone);
        window.location.href = "dashboard.html";
      } else {
        alert("❌ Senha incorreta!");
      }
    } else {
      alert("⚠️ Usuário não encontrado!");
    }
  });
});

// --- CADASTRO ---
document.getElementById("registerBtn").addEventListener("click", function() {
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  if (phone === "" || password === "") {
    alert("Preencha todos os campos!");
    return;
  }

  set(ref(db, "usuarios/" + phone), {
    telefone: phone,
    senha: password,
    saldo: 0,
    investimento: 0
  }).then(() => {
    alert("✅ Conta criada com sucesso!");
  }).catch((error) => {
    alert("Erro: " + error);
  });
});