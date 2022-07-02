async function f() {
  // 'https://evrimagaci.org/public/json/taxonomy-tree.json', -- CORS'dan dolayı istek atmama izin vermedi ben de verileri alım kendi fake apime istek attım.
  const res = await fetch('http://localhost:5000/yasamAgaci', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
}

function removeElements() {
  let items = document.querySelectorAll('#list li');
  items.forEach((item) => {
    item.remove();
  });
}

function displayNames(i) {
  let data = i.split(' _%?^-^?%_ ');

  input.value = data[0];
  removeElements();
  let a = document.getElementById('search-btn-link');
  a.setAttribute('href', data[1]);
  a.setAttribute('target', '_blank');
}

function getAllNameAndUrl(data, allNamesAndUrl) {
  if (data.children) {
    data.children.forEach((c) => getAllNameAndUrl(c, allNamesAndUrl));
    for (let i = 0; i < data.children.length; i++) {
      let obj = {
        name: data.children[i].name,
        url: data.children[i].url,
      };
      allNamesAndUrl.push(obj);
    }
  }
}

async function autoComplete() {
  const data = await f();
  let allNamesAndUrl = [];

  getAllNameAndUrl(data, allNamesAndUrl);

  allNamesAndUrl.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  let input = document.getElementById('input');

  let currentFocus = -1;

  input.addEventListener('keydown', (e) => {
    let items = document.querySelectorAll('ul li');

    if (e.key == 'ArrowUp') {
      currentFocus--;
      addActive(items);
    } else if (e.key == 'ArrowDown') {
      currentFocus++;
      addActive(items);
    } else if (e.key == 'Enter') {
      e.preventDefault();
      if (currentFocus > -1) {
        if (items) items[currentFocus].click();
      }
    }
  });
  function addActive(d) {
    if (!d) return false;
    removeActive(d);
    if (currentFocus >= d.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = d.length - 1;

    d[currentFocus].classList.add('list-items-active');
  }
  function removeActive(d) {
    for (var i = 0; i < d.length; i++) {
      d[i].classList.remove('list-items-active');
    }
  }

  input.addEventListener('input', (e) => {
    removeElements();
    for (const i of allNamesAndUrl) {
      if (
        i.name
          .toLocaleLowerCase('tr-TR')
          .startsWith(input.value.toLocaleLowerCase('tr-TR')) &&
        input.value != ''
      ) {
        let listItem = document.createElement('li');
        listItem.classList.add('list-items');
        listItem.style.cursor = 'pointer';
        listItem.setAttribute(
          'onclick',
          "displayNames('" + i.name + ' _%?^-^?%_ ' + i.url + "')"
        );
        let word = '<b>' + i.name.substr(0, input.value.length) + '</b>';
        word += i.name.substr(input.value.length);

        listItem.innerHTML = word;
        document.querySelector('.list').appendChild(listItem);
      }
    }
  });
}

document.addEventListener('click', (e) => {
  const { target } = e;
  if (
    target.matches('nav a') &&
    (target.href.split('5500/')[1] != 'yasam-agaci' ||
      target.href.split('5500/')[1] != 'yasam-agaci-list')
  ) {
    autoComplete();
  }

  return;
});
