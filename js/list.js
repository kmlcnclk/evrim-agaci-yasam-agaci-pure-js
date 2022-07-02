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

async function list() {
  const data = await f();

  let allNamesAndUrl = [];

  await getAllNameAndUrl(data, allNamesAndUrl);

  allNamesAndUrl.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  for (const i of allNamesAndUrl) {
    let listItem = document.createElement('li');
    let a = document.createElement('a');
    let list = document.querySelector('.table-list');

    a.style.cursor = 'pointer';
    a.style.textDecoration = 'none';
    a.style.color = '#333';
    a.setAttribute('href', i.url);
    a.setAttribute('target', '_blank');

    let word = i.name;
    a.innerHTML = word;

    listItem.append(a);

    listItem.classList.add('table-list-items');

    document.querySelector('.table-list').appendChild(listItem);
  }
}

document.addEventListener('click', (e) => {
  const { target } = e;
  if (
    !target.matches('nav a') ||
    target.href.split('5500/')[1] != 'yasam-agaci-list'
  ) {
    return;
  }
  list();
});
