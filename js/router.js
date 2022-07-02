const urlPageTitle = 'Evrim Ağacı';

document.addEventListener('click', (e) => {
  const { target } = e;
  if (!target.matches('nav a')) {
    return;
  }
  e.preventDefault();
  urlRoute();
});

const urlRoutes = {
  404: {
    template: '/templates/404.html',
    title: '404 | ' + urlPageTitle,
    description: 'Page not found',
  },
  '/': {
    template: '/templates/home.html',
    title: 'Evrim Ağacı | ' + urlPageTitle,
    description: 'Yasam Ağacı',
  },
  '/index.html': {
    template: '/templates/home.html',
    title: 'Evrim Ağacı | ' + urlPageTitle,
    description: 'Yasam Ağacı',
  },
  '/yasam-agaci': {
    template: '/templates/yasam-agaci.html',
    title: 'Evrim Ağacı | ' + urlPageTitle,
    description: 'Yasam Ağacı',
  },
  '/yasam-agaci-list': {
    template: '/templates/yasam-agaci-list.html',
    title: 'Evrim Ağacı | ' + urlPageTitle,
    description: 'Yasam Agacı List',
  },
};

const urlRoute = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  urlLocationHandler();
};

const urlLocationHandler = async () => {
  const location = window.location.pathname;
  if (location.length == 0) {
    location = '/';
  }

  const route = urlRoutes[location] || urlRoutes['404'];
  const html = await fetch(route.template).then((response) => response.text());

  document.getElementById('app').innerHTML = html;
  document.title = route.title;
  document
    .querySelector('meta[name="description"]')
    .setAttribute('content', route.description);
};

window.onpopstate = urlLocationHandler;
window.route = urlRoute;
urlLocationHandler();
