const PRACTICAL_FACTOR = 0.66667;

const courseTypeInputs = document.querySelectorAll('input[name="courseType"]');
const hasElearning = document.getElementById('hasElearning');
const elearningMode = document.getElementById('elearningMode');
const theoryHours = document.getElementById('theoryHours');
const practicalHours = document.getElementById('practicalHours');
const elearningHours = document.getElementById('elearningHours');
const resultHours = document.getElementById('resultHours');
const calculationText = document.getElementById('calculationText');

const theoryHoursField = document.getElementById('theoryHoursField');
const practicalHoursField = document.getElementById('practicalHoursField');
const elearningModeField = document.getElementById('elearningModeField');
const elearningHoursField = document.getElementById('elearningHoursField');
const blendedNoteBox = document.getElementById('blendedNoteBox');
const courseTypeGroup = document.getElementById('courseTypeGroup');

const helpPopover = document.getElementById('helpPopover');
const helpButtons = document.querySelectorAll('.help-btn');

function getSelectedCourseType() {
  return document.querySelector('input[name="courseType"]:checked').value;
}

function toNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function formatNumber(value) {
  return Number(value).toFixed(2);
}

function updateSegmentedState() {
  courseTypeGroup.querySelectorAll('.seg-item').forEach((item) => {
    const input = item.querySelector('input');
    item.classList.toggle('active', input.checked);
  });
}

function updateVisibility() {
  const courseType = getSelectedCourseType();
  const elearningEnabled = hasElearning.checked;

  elearningModeField.classList.toggle('hidden', !elearningEnabled);
  elearningHoursField.classList.toggle('hidden', !elearningEnabled);
  blendedNoteBox.classList.toggle('hidden', !(elearningEnabled && courseType === 'twoParts'));

  if (courseType === 'twoParts') {
    practicalHoursField.classList.remove('hidden');
    theoryHoursField.classList.toggle('hidden', elearningEnabled);
  } else if (courseType === 'singleTheory') {
    theoryHoursField.classList.remove('hidden');
    practicalHoursField.classList.add('hidden');
  } else if (courseType === 'singlePractical') {
    practicalHoursField.classList.remove('hidden');
    theoryHoursField.classList.add('hidden');
  }
}

function calculateLoad() {
  const courseType = getSelectedCourseType();
  const elearningEnabled = hasElearning.checked;
  const elearningType = elearningMode.value;
  const theory = toNumber(theoryHours.value);
  const practical = toNumber(practicalHours.value);
  const eHours = toNumber(elearningHours.value);

  let total = 0;
  let explanation = '';

  if (!elearningEnabled) {
    if (courseType === 'twoParts') {
      const practicalCalculated = practical * PRACTICAL_FACTOR;
      total = theory + practicalCalculated;
      explanation = `مقرر ذو شقين بدون تدريب إلكتروني: ${formatNumber(theory)} نظري + (${formatNumber(practical)} عملي × ${PRACTICAL_FACTOR}) = ${formatNumber(total)} ساعة.`;
    } else if (courseType === 'singleTheory') {
      total = theory;
      explanation = `مقرر شق واحد نظري: تحتسب ساعات النظري كاملة = ${formatNumber(total)} ساعة.`;
    } else {
      total = practical * PRACTICAL_FACTOR;
      explanation = `مقرر شق واحد عملي: ${formatNumber(practical)} × ${PRACTICAL_FACTOR} = ${formatNumber(total)} ساعة.`;
    }
  } else {
    if (elearningType === 'self') {
      if (courseType === 'twoParts') {
        const practicalCalculated = practical * PRACTICAL_FACTOR;
        total = practicalCalculated;
        explanation = `مقرر ذو شقين مع تدريب ذاتي: ساعات الشق الإلكتروني لا تحتسب، ويحتسب العملي فقط بالمعامل ${PRACTICAL_FACTOR}. النتيجة: (${formatNumber(practical)} × ${PRACTICAL_FACTOR}) = ${formatNumber(total)} ساعة.`;
      } else if (courseType === 'singleTheory') {
        total = 0;
        explanation = 'مقرر شق واحد إلكتروني بنمط تدريب ذاتي: لا يتم احتساب ساعات اتصال للنصاب التدريبي، لذلك النتيجة = 0.00 ساعة.';
      } else {
        total = practical * PRACTICAL_FACTOR;
        explanation = `مقرر شق واحد عملي مع تدريب ذاتي: التدريب الذاتي لا يضيف ساعات إلكترونية، ويحتسب العملي فقط بالمعامل ${PRACTICAL_FACTOR}. النتيجة: (${formatNumber(practical)} × ${PRACTICAL_FACTOR}) = ${formatNumber(total)} ساعة.`;
      }
    } else {
      if (courseType === 'twoParts') {
        const practicalCalculated = practical * PRACTICAL_FACTOR;
        total = practicalCalculated + eHours;
        explanation = `مقرر ذو شقين مع تدريب عن بعد: العملي يحتسب بالمعامل ${PRACTICAL_FACTOR}، وتضاف ساعات الشق الإلكتروني كاملة. النتيجة: (${formatNumber(practical)} × ${PRACTICAL_FACTOR}) + ${formatNumber(eHours)} = ${formatNumber(total)} ساعة.`;
      } else if (courseType === 'singleTheory') {
        total = eHours;
        explanation = `مقرر شق واحد نظري مع تدريب عن بعد: تحتسب ساعات الشق الإلكتروني كاملة = ${formatNumber(total)} ساعة.`;
      } else {
        total = (practical * PRACTICAL_FACTOR) + eHours;
        explanation = `مقرر شق واحد عملي مع تدريب عن بعد: يحتسب العملي بالمعامل ${PRACTICAL_FACTOR} وتضاف ساعات الشق الإلكتروني كاملة. النتيجة: (${formatNumber(practical)} × ${PRACTICAL_FACTOR}) + ${formatNumber(eHours)} = ${formatNumber(total)} ساعة.`;
      }
    }
  }

  resultHours.value = `${formatNumber(total)} ساعة`;
  calculationText.textContent = explanation;
}

function updateAll() {
  updateSegmentedState();
  updateVisibility();
  calculateLoad();
}

courseTypeInputs.forEach((input) => input.addEventListener('change', updateAll));
[hasElearning, elearningMode, theoryHours, practicalHours, elearningHours].forEach((element) => {
  element.addEventListener('input', updateAll);
  element.addEventListener('change', updateAll);
});

function showPopover(button) {
  const text = button.dataset.help || '';
  helpPopover.textContent = text;
  helpPopover.classList.add('show');
  helpPopover.setAttribute('aria-hidden', 'false');

  const rect = button.getBoundingClientRect();
  const popRect = helpPopover.getBoundingClientRect();
  let top = rect.bottom + 10;
  let left = rect.left + (rect.width / 2) - (popRect.width / 2);

  if (left < 12) left = 12;
  if (left + popRect.width > window.innerWidth - 12) {
    left = window.innerWidth - popRect.width - 12;
  }

  if (top + popRect.height > window.innerHeight - 12) {
    top = rect.top - popRect.height - 10;
  }

  helpPopover.style.top = `${top}px`;
  helpPopover.style.left = `${left}px`;
}

function hidePopover() {
  helpPopover.classList.remove('show');
  helpPopover.setAttribute('aria-hidden', 'true');
}

helpButtons.forEach((button) => {
  button.addEventListener('mouseenter', () => showPopover(button));
  button.addEventListener('mouseleave', hidePopover);
  button.addEventListener('focus', () => showPopover(button));
  button.addEventListener('blur', hidePopover);
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    if (helpPopover.classList.contains('show') && helpPopover.textContent === button.dataset.help) {
      hidePopover();
    } else {
      showPopover(button);
    }
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.help-btn') && !event.target.closest('.popover')) {
    hidePopover();
  }
});

window.addEventListener('resize', hidePopover);
window.addEventListener('scroll', hidePopover, true);

updateAll();
