// Sample observational fish drawings (generated SVG "pencil + crayon" sketches),
// seeded once on first run so the journey can be tried immediately.
// Early samples are simpler and rounder; later ones notice more (fins, scales, gills) —
// just so there is something visible to look at, not as a measure of anything.

(function () {
  const colors = ['#f2a65a', '#6fb7b0', '#e87d6a', '#8fb8de', '#f0c75e', '#a5c882'];

  function fishSvg(i, n) {
    const t = n > 1 ? i / (n - 1) : 0;           // 0..1 across the samples
    const cx = 400, cy = 300, rx = 185;
    const ry = 125 - t * 38;                      // rounder -> more oval
    const col = colors[i % colors.length];
    const tilt = [-4, 3, -2, 5, -3, 2][i % 6];
    const p = [];                                 // drawing parts
    const line = (d, w = 4) => `<path d="${d}" fill="none" stroke="#4a3f35" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

    // Tail
    p.push(`<path d="M${cx - rx + 8},${cy} Q${cx - rx - 40},${cy - 30} ${cx - rx - 70},${cy - 85} Q${cx - rx - 40},${cy} ${cx - rx - 70},${cy + 85} Q${cx - rx - 40},${cy + 30} ${cx - rx + 8},${cy}Z" fill="${col}" fill-opacity=".45" stroke="#4a3f35" stroke-width="4" stroke-linejoin="round"/>`);
    // Body wash + outline
    p.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col}" fill-opacity=".4" stroke="#4a3f35" stroke-width="4.5"/>`);
    // Dorsal fin
    p.push(`<path d="M${cx - 60},${cy - ry + 6} Q${cx - 20},${cy - ry - 70} ${cx + 70},${cy - ry + 10}" fill="${col}" fill-opacity=".45" stroke="#4a3f35" stroke-width="4" stroke-linecap="round"/>`);
    // Eye + mouth
    p.push(`<circle cx="${cx + rx - 55}" cy="${cy - 18}" r="${16 + t * 2}" fill="#fffaf0" stroke="#4a3f35" stroke-width="4"/>`);
    p.push(`<circle cx="${cx + rx - 52}" cy="${cy - 18}" r="${6 + t * 2}" fill="#4a3f35"/>`);
    p.push(line(`M${cx + rx - 6},${cy + 14} q-14,8 -30,2`, 3.5));

    if (t > 0.15) {                               // pectoral fin
      p.push(`<path d="M${cx + 20},${cy + 10} q-45,20 -50,62 q40,-6 60,-40" fill="${col}" fill-opacity=".5" stroke="#4a3f35" stroke-width="3.5" stroke-linejoin="round"/>`);
    }
    if (t > 0.3) {                                // gill line
      p.push(line(`M${cx + rx - 105},${cy - ry * 0.7} q-26,${ry * 0.7} 0,${ry * 1.4}`, 3.5));
    }
    if (t > 0.45) {                               // fin rays on dorsal + tail
      for (let k = 0; k < 6; k++) {
        const x = cx - 50 + k * 17;
        p.push(line(`M${x},${cy - ry + 4} l${(k - 2.5) * 2},${-26 - (k % 3) * 6}`, 2));
      }
      p.push(line(`M${cx - rx + 4},${cy} L${cx - rx - 55},${cy - 62}`, 2));
      p.push(line(`M${cx - rx + 4},${cy} L${cx - rx - 58},${cy}`, 2));
      p.push(line(`M${cx - rx + 4},${cy} L${cx - rx - 55},${cy + 62}`, 2));
    }
    if (t > 0.6) {                                // scales
      for (let row = -2; row <= 2; row++) {
        for (let x = cx - 110; x < cx + 80; x += 30) {
          const xx = x + (row % 2 ? 15 : 0), yy = cy + row * 24;
          if (((xx - cx) / (rx - 30)) ** 2 + ((yy - cy) / (ry - 14)) ** 2 < 1) {
            p.push(line(`M${xx},${yy - 9} q12,9 0,18`, 2.2));
          }
        }
      }
    }
    if (t > 0.8) {                                // belly fin + stripes
      p.push(`<path d="M${cx - 10},${cy + ry - 4} q-10,45 -48,52 q10,-30 8,-52" fill="${col}" fill-opacity=".5" stroke="#4a3f35" stroke-width="3.5" stroke-linejoin="round"/>`);
      p.push(line(`M${cx - 130},${cy - ry * 0.55} q10,${ry * 0.55} 0,${ry * 1.1}`, 3));
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
<defs><filter id="r" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${i + 3}"/><feDisplacementMap in="SourceGraphic" scale="${6 - t * 3}"/></filter></defs>
<rect width="800" height="600" fill="#fffaf0"/>
<g filter="url(#r)" transform="rotate(${tilt} 400 300)">${p.join('')}</g>
</svg>`;
  }

  const SAMPLES = [
    { daysAgo: 70, title: 'My first fish', note: 'I drew the fish how I think a fish looks.' },
    { daysAgo: 56, title: '', note: 'I tried looking more carefully at the shape of the fish.' },
    { daysAgo: 41, title: 'Fish with a big tail', note: 'The tail was difficult to draw.' },
    { daysAgo: 27, title: '', note: 'I noticed the fish’s body was more oval than I remembered.' },
    { daysAgo: 13, title: 'Looking at the fins', note: 'I noticed more details in the fins today.' },
    { daysAgo: 2,  title: 'Scales!', note: '' },
  ];

  function isoDaysAgo(n) {
    const d = new Date(); d.setDate(d.getDate() - n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  window.Placeholders = {
    // Seeds samples once per browser; never re-adds them if the family removes them.
    async seedIfFirstRun() {
      let seeded = false;
      try { seeded = localStorage.getItem('maj.seeded') === '1'; } catch { /* ignore */ }
      if (seeded || (await ArtStore.count()) > 0) return;
      for (let i = 0; i < SAMPLES.length; i++) {
        const s = SAMPLES[i];
        await ArtStore.add({
          practiceId: 'fish',
          date: isoDaysAgo(s.daysAgo),
          title: s.title,
          note: s.note,
          image: new Blob([fishSvg(i, SAMPLES.length)], { type: 'image/svg+xml' }),
          sample: true,
        });
      }
      try { localStorage.setItem('maj.seeded', '1'); } catch { /* ignore */ }
    },
  };
})();
