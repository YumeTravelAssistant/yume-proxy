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

function togglePassword(idCampo, idBottone) {
  const input = document.getElementById(idCampo);
  const btn = document.getElementById(idBottone);
  const isVisible = input.type === 'text';

  input.type = isVisible ? 'password' : 'text';
  btn.textContent = isVisible ? '👁' : '🙈';
}

