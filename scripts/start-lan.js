// Arranca Expo forzando la IP de la red local a la que estemos conectados
// ahora mismo. Sin esto, cuando hay VPNs o adaptadores virtuales activos
// (ProtonVPN, OpenVPN, Tailscale, WSL, Hyper-V) Expo autodetecta mal y le
// anuncia al telefono una IP que no puede alcanzar.
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

// Adaptadores que nunca sirven para que el telefono llegue al bundler.
const VIRTUAL = /vpn|tun|tap|tailscale|proton|virtual|vethernet|wsl|hyper-?v|docker|bluetooth|loopback/i;
// Adaptadores fisicos tipicos, en orden de preferencia.
const PHYSICAL = /wi-?fi|wlan|inalambric|ethernet|eth\d|en\d/i;

function privateRank(ip) {
  const [a, b] = ip.split('.').map(Number);
  if (a === 192 && b === 168) return 3; // el caso normal de un router casero
  if (a === 172 && b >= 16 && b <= 31) return 2;
  if (a === 10) return 1; // tambien lo usan muchas VPNs, por eso va ultimo
  return 0;
}

function findLanIp() {
  const candidates = [];

  for (const [name, addresses] of Object.entries(os.networkInterfaces())) {
    if (VIRTUAL.test(name)) continue;

    for (const address of addresses || []) {
      const family = typeof address.family === 'string' ? address.family : `IPv${address.family}`;
      if (family !== 'IPv4' || address.internal) continue;
      if (address.address.startsWith('169.254.')) continue; // APIPA: sin DHCP

      const rank = privateRank(address.address);
      if (rank === 0) continue; // descarta CGNAT de Tailscale (100.64/10) y publicas

      candidates.push({ name, ip: address.address, rank, physical: PHYSICAL.test(name) ? 1 : 0 });
    }
  }

  candidates.sort((a, b) => b.physical - a.physical || b.rank - a.rank);
  return candidates[0];
}

const found = findLanIp();
const env = { ...process.env };

if (found) {
  env.REACT_NATIVE_PACKAGER_HOSTNAME = found.ip;
  console.log(`> Usando ${found.ip} (${found.name}) para el bundler\n`);
} else {
  console.warn('> No se encontro una IP de red local; Expo va a autodetectar.\n');
}

const cli = path.join(__dirname, '..', 'node_modules', 'expo', 'bin', 'cli');
const child = spawn(process.execPath, [cli, 'start', '--lan', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
});

child.on('exit', (code) => process.exit(code ?? 0));
