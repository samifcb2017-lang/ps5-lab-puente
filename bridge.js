(function () {
  'use strict';
  var input = document.getElementById('lan-url');
  var open = document.getElementById('open');
  var clear = document.getElementById('clear');
  var status = document.getElementById('status');

  // Accept only the exact URL shape emitted by the reviewed server.py.
  // No URL normalization, hostnames, redirects, queries or fragments.
  function valid(value) {
    var match = /^http:\/\/((?:\d{1,3}\.){3}\d{1,3}):(\d{4,5})\/([a-f0-9]{24})\/$/.exec(value);
    if (!match) { return false; }
    var parts = match[1].split('.');
    var octets = [];
    for (var i = 0; i < 4; i++) {
      if (parts[i].length > 1 && parts[i].charAt(0) === '0') { return false; }
      octets[i] = Number(parts[i]);
      if (octets[i] > 255) { return false; }
    }
    var privateIP = octets[0] === 10 ||
      (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
      (octets[0] === 192 && octets[1] === 168);
    var port = Number(match[2]);
    return privateIP && match[2].charAt(0) !== '0' && port >= 1024 && port <= 65535;
  }

  function erase() {
    input.value = '';
    status.textContent = 'Campo borrado. Introduce la URL de la sesión actual.';
  }
  open.onclick = function () {
    var target = input.value.replace(/^\s+|\s+$/g, '');
    if (!valid(target)) {
      status.textContent = 'Revisa la URL: http://IP-privada:puerto/clave-de-24-caracteres/. No uses C:/, localhost, HTTPS ni la dirección del informe.';
      input.focus();
      return;
    }
    input.value = '';
    status.textContent = 'Abriendo el servidor local. Si falla, revisa servidor, red y permisos de la vista web.';
    window.location.assign(target);
  };
  clear.onclick = function () { erase(); input.focus(); };
  window.addEventListener('pagehide', erase, false);
  window.addEventListener('pageshow', erase, false);
  input.value = '';
  open.disabled = false;
  clear.disabled = false;
  status.textContent = 'Listo. Introduce la URL LAN y pulsa Abrir servidor PS5 Lab.';
}());
