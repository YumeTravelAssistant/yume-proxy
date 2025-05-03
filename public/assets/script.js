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
$(document).ready(function () {
  $('#nazionalita').select2({
    placeholder: "Seleziona una nazionalità...",
    allowClear: true,
    width: '100%'
  });
});

$(document).ready(function () {
  // Applica Select2 solo se il campo esiste (es. profilo o area-clienti)
  setTimeout(() => {
    if ($('#campo-nazionalita').length > 0) {
      $('#campo-nazionalita').select2({
        placeholder: "Seleziona la tua nazionalità",
        allowClear: true,
        width: '100%'
      });
    }
  }, 300); // Ritardo per garantire che il DOM sia caricato
});

