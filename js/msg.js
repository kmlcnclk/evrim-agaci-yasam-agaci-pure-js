window.addEventListener('resize', () => {
  let msg = document.getElementById('msg');

  if (window.innerWidth <= 769 && !msg) {
    let msgDiv = document.getElementById('msgBox');
    let msg = document.createElement('p');

    msg.id = 'msg';
    msg.innerHTML = 'Cihazınızı yan çevirebilirsiniz';

    msgDiv.append(msg);
  } else if (window.innerWidth > 769 && msg) {
    msg.remove();
  }
});

function closeMsgBox() {
  let msg = document.getElementById('msg');

  msg.remove();
}
