function toggleLanguage() {
  const lang = document.documentElement.lang === 'en' ? 'nl' : 'en';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en][data-nl]').forEach(el => {
    el.textContent = el.dataset[lang];
  });
}

document.getElementById('workshop-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const titleEn = document.getElementById('title-en').value;
  const titleNl = document.getElementById('title-nl').value;
  const contentEn = document.getElementById('content-en').value;
  const contentNl = document.getElementById('content-nl').value;
  const studyEn = document.getElementById('study-en').value;
  const studyNl = document.getElementById('study-nl').value;
  const projectEn = document.getElementById('project-en').value;
  const projectNl = document.getElementById('project-nl').value;
  const careerEn = document.getElementById('career-en').value;
  const careerNl = document.getElementById('career-nl').value;

  const card = document.createElement('div');
  card.className = 'entry';
  card.innerHTML = `
    <a href="workshop${Date.now()}.html">
      <p data-en="${titleEn}" data-nl="${titleNl}">${titleEn}</p>
      <p>In Progress</p>
      <p data-en="${contentEn}" data-nl="${contentNl}">${contentEn}</p>
    </a>
  `;
  document.querySelector('.timeline').appendChild(card);

  const workshops = JSON.parse(localStorage.getItem('workshops') || '[]');
  workshops.push({ id: Date.now(), titleEn, titleNl, contentEn, contentNl, studyEn, studyNl, projectEn, projectNl, careerEn, careerNl });
  localStorage.setItem('workshops', JSON.stringify(workshops));

  this.reset();
});