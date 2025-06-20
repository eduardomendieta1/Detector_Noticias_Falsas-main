// scripts.js
let recognition;
initSpeech();
loadFromStorage();

function initSpeech() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'es-ES';
  recognition.onresult = e => {
    document.getElementById('noticia').value = e.results[0][0].transcript;
  };
}

function grabarTexto() {
  if (!recognition) {
    Swal.fire({ title: 'Error', text: 'Tu navegador no soporta reconocimiento de voz.', icon: 'error' });
    return;
  }
  recognition.start();
}

function clasificar() {
  const textarea = document.getElementById('noticia');
  const texto = textarea.value.trim();
  if (!texto) return;

  showLoader(true);
  addMessage(texto, 'user-message');
  textarea.value = '';

  fetch('/predecir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto })
  })
    .then(res => res.json())
    .then(data => {
      showLoader(false);
      const resultado = `Resultado: ${data.resultado} (${data.confianza}% confianza)`;

      Swal.fire({
        title: data.resultado === "Verdadera" ? "✅ Noticia verdadera" : "🚫 Noticia falsa",
        text: `Confianza: ${data.confianza}%`,
        icon: data.resultado === "Verdadera" ? "success" : "warning",
        confirmButtonText: "Entendido"
      });

      const voz = new SpeechSynthesisUtterance(`La noticia es ${data.resultado}, con ${data.confianza} por ciento de confianza`);
      voz.lang = 'es-ES';
      window.speechSynthesis.speak(voz);

      addMessage(resultado, 'ai-message', data.confianza);
      saveToStorage(texto, resultado);
    })
    .catch(() => {
      showLoader(false);
      Swal.fire({ title: "Error", text: "No se pudo clasificar la noticia.", icon: "error" });
    });
}

function addMessage(text, type, confianza = null) {
  const container = document.getElementById('chat-history');

  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = text;
  container.appendChild(msg);

  if (confianza !== null) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = '0%'; // se animará a la confianza real

    const label = document.createElement('span');
    label.className = 'progress-label';
    label.textContent = `${confianza.toFixed(2)}% de confianza`;

    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(label);
    msg.appendChild(progressContainer);

    // animación progresiva
    setTimeout(() => {
      progressBar.style.width = `${confianza}%`;
    }, 100);
  }

  msg.scrollIntoView({ behavior: 'smooth' });
}

function limpiarHistorial() {
  localStorage.removeItem('historial');
  document.getElementById('chat-history').innerHTML = `
    <div class="welcome">
      <h2>Bienvenido al modelo de Noticias Falsas</h2>
      <p>Inicie una conversación escribiendo una noticia o usando el micrófono.</p>
    </div>
  `;
  document.getElementById('conversation-list').innerHTML = '';
}

function saveToStorage(texto, resultado) {
  const historial = JSON.parse(localStorage.getItem('historial') || '[]');
  const fecha = new Date().toLocaleString();
  historial.push({ texto, resultado, fecha });
  localStorage.setItem('historial', JSON.stringify(historial));
  addToSidebar(texto, fecha);
}

function addToSidebar(titulo, fecha) {
  const list = document.getElementById('conversation-list');
  const item = document.createElement('div');
  item.className = 'conversation-item';
  item.innerHTML = `
    <div class="title">${titulo.slice(0, 25)}...</div>
    <div class="date">${fecha}</div>
  `;
  item.addEventListener('click', () => {
    document.getElementById('chat-history').innerHTML = '';
    addMessage(titulo, 'user-message');
    addMessage(historial.find(h => h.texto === titulo)?.resultado || 'Sin resultado', 'ai-message');
  });
  list.appendChild(item);
}

function loadFromStorage() {
  const historial = JSON.parse(localStorage.getItem('historial') || '[]');
  const list = document.getElementById('conversation-list');
  historial.forEach(({ texto, resultado, fecha }) => {
    addMessage(texto, 'user-message');
    addMessage(resultado, 'ai-message');
    addToSidebar(texto, fecha);
  });
}

function showLoader(state) {
  const loader = document.getElementById('loader');
  loader.classList.toggle('hidden', !state);

  // Toggle sidebar al hacer clic en el botón
document.querySelector('.toggle-sidebar').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('collapsed');
});

}