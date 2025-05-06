function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.querySelector('.hamburger');

  // Aggiunge la classe per mostrare la sidebar
  sidebar.classList.add('active');
  hamburger.style.display = 'none';

  // Chiudi sidebar al click esterno
  document.addEventListener("click", function handleClickOutside(event) {
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
      sidebar.classList.remove('active');
      hamburger.style.display = 'block';
      document.removeEventListener("click", handleClickOutside);
    }
  });

  // Chiudi sidebar al click su uno dei link
  const links = sidebar.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('active');
      hamburger.style.display = 'block';
    });
  });
}

function togglePassword(inputId, btnElement) {
  const input = document.getElementById(inputId);
  const isVisible = input.type === 'text';

  input.type = isVisible ? 'password' : 'text';
  btnElement.textContent = isVisible ? 'Mostra password' : 'Nascondi password';
}
// ✅ Protezione completa: attiva Select2 solo se jQuery è presente
if (typeof $ !== "undefined" && typeof $.fn.select2 !== "undefined") {
  $(function () {
    // Campo statico (profilo)
    if ($('#nazionalita').length > 0) {
      $('#nazionalita').select2({
        placeholder: "Seleziona una nazionalità...",
        allowClear: true,
        width: '100%'
      });
    }

    // Campo dinamico (area-clienti)
    if ($('#campo-nazionalita').length > 0) {
      setTimeout(() => {
        $('#campo-nazionalita').select2({
          placeholder: "Seleziona la tua nazionalità",
          allowClear: true,
          width: '100%'
        });
      }, 300);
    }
  });
}

function salvaModifiche() {
  const form = document.getElementById("modificaForm");
  const btn = document.getElementById("salvaBtn");
  const spinner = document.getElementById("spinnerSalvataggio");

  if (!form || !btn || !spinner) {
    alert("Errore nel caricamento della pagina.");
    return;
  }

  const codiceCliente = localStorage.getItem("codiceClienteYUTA");
  if (!codiceCliente) {
    alert("Codice cliente non disponibile. Effettua il login.");
    return;
  }

  // Disattiva bottone e mostra clessidra
  btn.disabled = true;
  spinner.style.display = "block";

  const dati = {};
const gruppi = [];
const inputs = form.querySelectorAll("input, select, textarea");

inputs.forEach(input => {
  const key = input.name;
  if (!key) return;

  if (key === "componenti_gruppo") {
    const val = input.value.trim();
    if (val) gruppi.push(val);
    return;
  }

  if (input.type === "select-multiple") {
    const values = Array.from(input.selectedOptions).map(opt => opt.value.trim());
    if (values.length > 0) {
      dati[key] = values;
    }
  } else {
    dati[key] = input.value.trim();
  }
});

if (gruppi.length > 0) {
  dati["componenti_gruppo"] = gruppi;
}

dati.codice = codiceCliente;
dati["Codice Cliente"] = codiceCliente;

fetch("https://yuta-invio-profilo.azurewebsites.net/api/invio-api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tipoRichiesta: "update",
    ...dati
  })
})
    .then(response => {
      if (!response.ok) throw new Error("Errore nella risposta");
      return response.json();
    })
    .then(result => {
      if (result.status === 'success' || result.codice) {
        alert("Modifiche salvate con successo!");
      } else {
        alert("Salvataggio completato, ma senza conferma esplicita.");
      }
    })
    .catch(error => {
      console.error("Errore durante il salvataggio:", error);
      alert("Si è verificato un errore durante il salvataggio.");
    })
    .finally(() => {
      btn.disabled = false;
      spinner.style.display = "none";
    });
}

function sbloccaBadge(id, nomeImg) {
  const badge = document.getElementById(id);
  if (badge) {
    badge.classList.remove("locked");
    const img = badge.querySelector("img");
    img.src = `assets/badges/${nomeImg}.png`;
  }
}

async function caricaVideoBacheca() {
  const codiceCliente = localStorage.getItem("codiceClienteYUTA") || "pubblico";
  const urlIndex = "https://yutarga700.blob.core.windows.net/yuta-videos/videoIndex.json";

  try {
    const response = await fetch(urlIndex);
    const videoList = await response.json();
    const griglia = document.getElementById("griglia-video");
    if (!griglia) return;

    griglia.innerHTML = "";

    videoList.forEach(video => {
      if (video.clienteId !== "pubblico" && video.clienteId !== codiceCliente) return;

      const card = document.createElement("div");
      card.className = "trofeo";

      const player = document.createElement("video");
      player.src = video.url;
      player.controls = true;
      player.muted = true;
      player.preload = "none";
      player.style.width = "100%";
      player.style.borderRadius = "12px";

      const titolo = document.createElement("h3");
      titolo.textContent = video.titolo;

      const descrizione = document.createElement("p");
      descrizione.textContent = video.descrizione;

      card.appendChild(player);
      card.appendChild(titolo);
      card.appendChild(descrizione);
      griglia.appendChild(card);
    });
  } catch (e) {
    console.error("Errore nel caricamento video:", e);
  }
}


// Esempio test temporaneo
document.addEventListener("DOMContentLoaded", () => {
  // Simulazione: questi due badge sono "sbloccati"
  sbloccaBadge("badge-curry", "curry");
  sbloccaBadge("badge-shibuya", "shibuya");
});

