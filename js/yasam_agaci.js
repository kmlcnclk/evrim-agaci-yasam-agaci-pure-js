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

async function yasamAgaci() {
  var treeData = await f();

  var margin = {
      top: 20,
      right: 90,
      bottom: 30,
      left: 90,
    },
    width = window.innerWidth - margin.left - margin.right - 30,
    height = window.innerHeight - margin.top - margin.bottom;

  var svg = d3
    .select('.container')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .style('cursor', 'all-scroll')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var i = 0,
    duration = 750,
    root;

  let zoom = d3.zoom().on('zoom', handleZoom);

  function handleZoom(e) {
    d3.select('svg g').attr('transform', e.transform);
  }

  function initZoom() {
    d3.select('svg').call(zoom);
  }
  initZoom();

  var treemap = d3.tree().size([height, width]);

  root = d3.hierarchy(treeData, function (d) {
    return d.children;
  });
  root.x0 = height / 2;
  root.y0 = 0;

  root.children.forEach(collapse);

  update(root);

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function update(source) {
    var treeData = treemap(root);

    var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    var node = svg.selectAll('g.node').data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    var nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function (d) {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      });

    nodeEnter
      .append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', function (d) {
        return d._children ? 'red' : '#fff';
      })
      .style('cursor', 'pointer')
      .on('click', click);

    nodeEnter
      .append('a')
      .attr('href', function (d) {
        if (d?.data?.url) return d.data.url;
      })
      .attr('target', '_blank')
      .append('text')
      .attr('dy', '.35em')
      .attr('x', function (d) {
        return d.children || d._children ? -20 : 20;
      })
      .attr('text-anchor', function (d) {
        return d.children || d._children ? 'end' : 'start';
      })
      .text(function (d) {
        return d.data.name;
      });

    var nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', function (d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    nodeUpdate
      .select('circle.node')
      .attr('r', 6)
      .style('fill', function (d) {
        return d._children ? 'red' : '#fff';
      });

    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr('transform', function (d) {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    nodeExit.select('circle').attr('r', 1e-6);

    nodeExit.select('text').style('fill-opacity', 1e-6);

    var link = svg.selectAll('path.link').data(links, function (d) {
      return d.id;
    });

    var linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('stroke-width', function (d) {
        return 1;
      })
      .attr('d', function (d) {
        var o = {
          x: source.x0,
          y: source.y0,
        };
        return diagonal(o, o);
      })
      .attr('opacity', '0.3');

    var linkUpdate = linkEnter.merge(link);

    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', function (d) {
        return diagonal(d, d.parent);
      });

    var linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', function (d) {
        var o = {
          x: source.x,
          y: source.y,
        };
        return diagonal(o, o);
      })
      .remove();

    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    function diagonal(s, d) {
      let path = `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;

      return path;
    }

    function click(event, d) {
      setTimeout(() => {
        const gNodes = document.querySelectorAll('g.node');
        if (gNodes.length <= 15) {
          width = 1336;
          height = 432;
        } else if (gNodes.length > 15 && gNodes.length <= 40) {
          width = 2000;
          height = 1100;
        } else if (gNodes.length > 40 && gNodes.length <= 60) {
          width = 3000;
          height = 2100;
        } else if (gNodes.length > 60 && gNodes.length <= 80) {
          width = 4000;
          height = 3100;
        } else if (gNodes.length > 80 && gNodes.length <= 120) {
          width = 5000;
          height = 4100;
        } else if (gNodes.length > 120 && gNodes.length <= 160) {
          width = 6000;
          height = 5100;
        } else if (gNodes.length > 160 && gNodes.length <= 230) {
          width = 7000;
          height = 6100;
        } else if (gNodes.length > 230 && gNodes.length <= 305) {
          width = 8000;
          height = 8000;
        }

        if (width < 1336) {
          width = 1336;
        }
        if (height < 432) {
          height = 432;
        }

        d3.select('svg').attr('width', width).attr('height', height);
        treemap = d3.tree().size([height, width]);
      }, 1000);

      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }

      update(d);
    }
  }
}

document.addEventListener('click', (e) => {
  const { target } = e;
  if (
    !target.matches('nav a') ||
    target.href.split('5500/')[1] != 'yasam-agaci'
  ) {
    return;
  }

  yasamAgaci();
});
