function toggleTextVisibility() {
  const d = document.getElementById('d');
  const btnText = document.getElementById('btn-text');

  if (d.classList.value == 'd-down' || d.classList.value == '') {
    d.classList.add('d-up');
    setTimeout(() => {
      btnText.classList.add('btn-text-invisible');
    }, 2000);

    d.classList.remove('d-down');
    d.classList.remove('d-normal');
    btnText.classList.remove('btn-text-visible');
  } else {
    d.classList.add('d-down');
    btnText.classList.add('btn-text-visible');

    d.classList.remove('d-up');
    d.classList.remove('d-normal');
    btnText.classList.remove('btn-text-invisible');
  }
}
