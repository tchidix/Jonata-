<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TCHIDIX KHALIFA</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Poppins',sans-serif;}
body{background:#f7fff7;color:#333;}
.container{max-width:400px;margin:0 auto;padding:20px;}
.logo{text-align:center;font-size:28px;font-weight:800;color:#006400;text-shadow:0 0 10px #00ff00;margin-bottom:10px;}
input,button{width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ccc;font-size:16px;}
button{background:linear-gradient(to right,#228B22,#FFD700);color:#000;font-weight:600;border:none;}
a{text-decoration:none;color:#DAA520;font-weight:600;text-align:center;display:block;margin-top:10px;}
.card{background:#fff;border-radius:12px;box-shadow:0 0 10px rgba(0,0,0,0.1);padding:15px;margin:10px 0;}
.nav{display:flex;flex-wrap:wrap;gap:8px;}
.nav button{flex:1;}
.hidden{display:none;}
header{background:#006400;color:#fff;text-align:center;padding:15px 0;font-size:20px;font-weight:bold;}
.suporte-btn{position:fixed;bottom:20px;right:20px;background:#25D366;color:white;border:none;border-radius:50%;width:60px;height:60px;font-size:24px;box-shadow:0 0 10px rgba(0,0,0,0.3);}
</style>
</head>
<body>

<!-- Login -->
<div class="container" id="loginPage">
  <h1 class="logo">TCHIDIX KHALIFA</h1>
  <h2 style="text-align:center;color:#006400;">Acesse sua conta</h2>
  <label>Número de Telefone:</label>
  <input type="tel" id="phone">
  <label>Senha:</label>
  <input type="password" id="password">
  <button onclick="login()">ENTRAR</button>
  <a href="#" onclick="showRegister()">Não tem conta? Cadastre-se</a>
</div>

<!-- Cadastro -->
<div class="container hidden" id="registerPage">
  <h2 style="text-align:center;color:#006400;">Criar Conta</h2>
  <label>Número de Telefone:</label>
  <input type="tel" id="regPhone">
  <label>Senha:</label>
  <input type="password" id="regPass">
  <button onclick="register()">Cadastrar</button>
  <a href="#" onclick="showLogin()">Já tem conta? Entrar</a>
</div>

<!-- Painel Usuário -->
<div class="hidden" id="userPage">
  <header>Painel - TCHIDIX KHALIFA</header>
  <div class="container" id="userContainer">
    <div class="card">
      <p><b>Telefone:</b> <span id="userPhone"></span></p>
      <p><b>Saldo Ativo:</b> KZ <span id="saldo">0</span></p>
      <p><b>Retirada Total:</b> KZ <span id="retirada">0</span></p>
    </div>
    <div class="nav">
      <button onclick="showInvestir()">Investir</button>
      <button onclick="showDepositar()">Depositar</button>
      <button onclick="showLevantar()">Levantar</button>
      <button onclick="showHistorico()">Histórico</button>
      <button onclick="showConta()">Minha Conta</button>
      <button onclick="convidar()">Convidar Amigo</button>
    </div>
    <button style="background:red;margin-top:15px;" onclick="logout()">Sair da Conta</button>
  </div>
  <button class="suporte-btn" onclick="window.open('https://wa.me/qr/7NCPFRYRKHHHE1','_blank')">💬</button>
</div>

<!-- Painel Admin -->
<div class="container hidden" id="adminPage">
  <h2 style="text-align:center;color:#006400;">Painel do Administrador</h2>
  <div id="listaUsers"></div>
  <button style="background:red" onclick="logout()">Sair</button>
</div>

<script>
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function saveData(){localStorage.setItem('users',JSON.stringify(users));}
function showLogin(){document.getElementById('registerPage').classList.add('hidden');document.getElementById('loginPage').classList.remove('hidden');}
function showRegister(){document.getElementById('loginPage').classList.add('hidden');document.getElementById('registerPage').classList.remove('hidden');}

function register(){
  let phone=document.getElementById('regPhone').value;
  let pass=document.getElementById('regPass').value;
  if(!phone||!pass){alert("Preencha tudo");return;}
  if(users.find(u=>u.phone==phone)){alert("Usuário já existe");return;}
  users.push({phone,pass,saldo:0,retirada:0,historico:[],iban:"",nome:""});
  saveData();
  alert("Conta criada com sucesso!");
  showLogin();
}

function login(){
  let phone=document.getElementById('phone').value;
  let pass=document.getElementById('password').value;
  if(phone=="admin"&&pass=="1234"){showAdmin();return;}
  let u=users.find(x=>x.phone==phone&&x.pass==pass);
  if(!u){alert("Credenciais inválidas");return;}
  currentUser=u;
  localStorage.setItem('currentUser',JSON.stringify(u));
  showUser();
}

function logout(){localStorage.removeItem('currentUser');location.reload();}

function showUser(){
  document.querySelectorAll('div').forEach(d=>d.classList.add('hidden'));
  document.getElementById('userPage').classList.remove('hidden');
  document.getElementById('userPhone').innerText=currentUser.phone;
  document.getElementById('saldo').innerText=currentUser.saldo;
  document.getElementById('retirada').innerText=currentUser.retirada;
}

function showInvestir(){
  let planos=[[8000,800],[10000,1000],[15000,1500],[25000,2500],[30000,3000],[50000,5000]];
  let html="<h3>Planos de Investimento</h3>";
  planos.forEach(p=>{
    html+=`<div class='card'><b>${p[0]} KZ</b> → Retorno diário ${p[1]} KZ<br><button onclick='investir(${p[0]},${p[1]})'>Investir</button></div>`;
  });
  document.getElementById('userContainer').innerHTML=html+"<button onclick='location.reload()'>Voltar</button>";
}

function investir(valor,retorno){
  if(confirm(`Confirmar investimento de ${valor} KZ?`)){
    currentUser.saldo+=retorno;
    currentUser.historico.push({tipo:"Investimento",valor,retorno,data:new Date().toLocaleString()});
    users=users.map(u=>u.phone==currentUser.phone?currentUser:u);
    saveData();
    localStorage.setItem('currentUser',JSON.stringify(currentUser));
    alert("Investimento efetuado!");
    location.reload();
  }
}

function showDepositar(){
  document.getElementById('userContainer').innerHTML=`
  <h3>Depósito</h3>
  <p><b>Entidade:</b> 10116</p>
  <p><b>Referência:</b> 930 993 194</p>
  <p>Enviar comprovativo para WhatsApp 930 993 194</p>
  <button onclick='location.reload()'>Voltar</button>`;
}

function showLevantar(){
  document.getElementById('userContainer').innerHTML=`
  <h3>Levantamento</h3>
  <input type='number' id='valorLevantar' placeholder='Valor (KZ)'>
  <button onclick='levantar()'>Levantar</button>
  <button onclick='location.reload()'>Voltar</button>`;
}

function levantar(){
  let v=parseFloat(document.getElementById('valorLevantar').value);
  if(v>currentUser.saldo){alert("Saldo insuficiente");return;}
  currentUser.saldo-=v;
  currentUser.retirada+=v;
  currentUser.historico.push({tipo:"Levantamento",valor:-v,data:new Date().toLocaleString()});
  users=users.map(u=>u.phone==currentUser.phone?currentUser:u);
  saveData();localStorage.setItem('currentUser',JSON.stringify(currentUser));
  alert("Levantamento efetuado!");
  location.reload();
}

function showHistorico(){
  let h=currentUser.historico.map(x=>`<div class='card'>${x.tipo}: ${x.valor} KZ<br><small>${x.data}</small></div>`).join('');
  document.getElementById('userContainer').innerHTML="<h3>Histórico</h3>"+(h||"<p>Sem movimentos</p>")+"<button onclick='location.reload()'>Voltar</button>";
}

function showConta(){
  document.getElementById('userContainer').innerHTML=`
  <h3>Minha Conta</h3>
  <input id='nome' placeholder='Nome Completo' value='${currentUser.nome||""}'>
  <input id='iban' placeholder='IBAN (21 dígitos)' value='${currentUser.iban||""}'>
  <button onclick='salvarConta()'>Guardar</button>
  <button onclick='location.reload()'>Voltar</button>`;
}

function salvarConta(){
  currentUser.nome=document.getElementById('nome').value;
  currentUser.iban=document.getElementById('iban').value;
  users=users.map(u=>u.phone==currentUser.phone?currentUser:u);
  saveData();localStorage.setItem('currentUser',JSON.stringify(currentUser));
  alert("Dados guardados!");
  location.reload();
}

function convidar(){
  navigator.clipboard.writeText("https://tchidixkhalifa.com");
  alert("Link copiado! Envie para seus amigos.");
}

function showAdmin(){
  document.querySelectorAll('div').forEach(d=>d.classList.add('hidden'));
  document.getElementById('adminPage').classList.remove('hidden');
  let html="<h3>Usuários Cadastrados:</h3>";
  users.forEach(u=>{
    html+=`<div class='card'><b>${u.phone}</b><br>Saldo: ${u.saldo} KZ<br>Retirada: ${u.retirada} KZ</div>`;
  });
  document.getElementById('listaUsers').innerHTML=html;
}

if(currentUser){showUser();}
</script>
</body>
</html>
