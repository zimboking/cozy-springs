export function icon(name, size = 22) {
  const paths = {
    drop: '<path d="M12 3C10 7 5 11 5 15a7 7 0 0 0 14 0c0-4-5-8-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
    moon: '<path d="M20.5 13.1A8.7 8.7 0 0 1 10.9 3.5 8.8 8.8 0 1 0 20.5 13.1Z"/>',
    home: '<path d="m3 11 9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    journal: '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M5 7H3m2 5H3m2 5H3m7-9h6m-6 4h6m-6 4h4"/>',
    leaf: '<path d="M20 3C8 1 2 8 5 15s16 6 15-12ZM5 20 15 9M9 15v-4m0 4h5"/>',
    settings: '<path d="m9 3-1 3-3 1 1 4-1 3 3 2 1 4h5l1-4 3-2-1-3 1-4-3-1-1-3Z"/><circle cx="11.5" cy="11.5" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    edit: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15Z"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
    cup: '<path d="M4 8h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM17 9h2a3 3 0 0 1 0 6h-2M7 3v2m5-3v3"/>',
    tea: '<path d="M4 10h14v5a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6ZM18 11h1a3 3 0 0 1 0 6h-1M9 3c-3 3 3 3 0 6M14 2c-3 3 3 3 0 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
    heart: '<path d="M12 21 3 12C-2 5 7-1 12 6c5-7 14-1 9 6Z"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.drop}</svg>`;
}

export function animalArt(animal, { towel = false, happy = false } = {}) {
  const face = happy ? '<path d="m77 93 5-4 5 4m30 0 5-4 5 4"/>' : '<path d="M77 92h9m30 0h9"/>';
  if (animal === 'frog') return `<g class="animal-body"><ellipse cx="100" cy="151" rx="67" ry="16" fill="#719878"/><path d="M37 150q-17-37 17-55 46-31 92 0 34 18 17 55Z" fill="#a3b984"/><circle cx="70" cy="82" r="24" fill="#a3b984"/><circle cx="130" cy="82" r="24" fill="#a3b984"/><circle cx="70" cy="81" r="12" fill="#f9f5df"/><circle cx="130" cy="81" r="12" fill="#f9f5df"/><circle cx="72" cy="83" r="5" fill="#354a34"/><circle cx="128" cy="83" r="5" fill="#354a34"/><ellipse cx="100" cy="133" rx="35" ry="22" fill="#cbd5aa"/><path d="M79 111q21 17 42 0" fill="none" stroke="#3e5a3f" stroke-width="3" stroke-linecap="round"/><ellipse cx="60" cy="105" rx="10" ry="5" fill="#d7ad93"/><ellipse cx="140" cy="105" rx="10" ry="5" fill="#d7ad93"/><path d="m48 141-8 9m15-7-2 10m99-12 8 9m-15-7 2 10" stroke="#66835d" stroke-width="3" stroke-linecap="round"/></g>`;
  if (animal === 'otter') return `<g class="animal-body"><path d="M144 127q49-1 30 20-17 13-42-1" fill="#8e6651"/><ellipse cx="103" cy="139" rx="54" ry="30" fill="#a7795d"/><ellipse cx="101" cy="134" rx="35" ry="22" fill="#dcc3a0"/><circle cx="62" cy="65" r="12" fill="#92664f"/><circle cx="140" cy="65" r="12" fill="#92664f"/><rect x="52" y="62" width="98" height="66" rx="32" fill="#b88968"/><path d="M64 96q36-37 74 0v10q-2 24-36 24-35 0-38-24Z" fill="#e2c8a5"/><g fill="none" stroke="#49382d" stroke-width="3" stroke-linecap="round">${face}<path d="m97 106 5 3 5-3m-5 3v5m0 0q-6 5-11 0m11 0q6 5 11 0M58 108l17 2m-18 5 17-1m56-4 17-2m-17 6 17 1"/></g><ellipse cx="85" cy="134" rx="13" ry="8" fill="#956a52"/><ellipse cx="118" cy="134" rx="13" ry="8" fill="#956a52"/><ellipse cx="101" cy="136" rx="12" ry="8" fill="#929d8e"/></g>`;
  return `<g class="animal-body"><ellipse cx="100" cy="143" rx="66" ry="31" fill="#bb8e6b"/><ellipse cx="67" cy="58" rx="14" ry="18" fill="#a87857"/><ellipse cx="134" cy="58" rx="14" ry="18" fill="#a87857"/><ellipse cx="67" cy="57" rx="7" ry="10" fill="#ce9b78"/><ellipse cx="134" cy="57" rx="7" ry="10" fill="#ce9b78"/><path d="M48 89q0-35 52-35t52 35v33q0 30-52 30t-52-30Z" fill="#cca17d"/><path d="M50 113q50-28 100 0v16q-6 23-50 23t-50-23Z" fill="#d8b38e"/><g fill="none" stroke="#563e2e" stroke-width="3.3" stroke-linecap="round">${face}<path d="M97 114h8m-4 0v6m-8 3q8 5 16 0"/></g><ellipse cx="66" cy="106" rx="9" ry="5" fill="#d9a187"/><ellipse cx="136" cy="106" rx="9" ry="5" fill="#d9a187"/><ellipse cx="62" cy="143" rx="12" ry="7" fill="#b38665"/><ellipse cx="139" cy="143" rx="12" ry="7" fill="#b38665"/>${towel ? '<g class="towel"><path d="M71 54q0-16 30-16 31 0 31 16v10H71Z" fill="#faf5e6"/><path d="M75 52h53m-45-8q19-7 35 0" fill="none" stroke="#ded9c6" stroke-width="2"/></g>' : '<g><ellipse cx="101" cy="52" rx="12" ry="10" fill="#e5b454"/><path d="M100 42q5-9 13-6-3 8-13 6" fill="#6c8753"/></g>'}</g>`;
}
export function animalPortrait(animal, size = 64) { return `<svg width="${size}" height="${size}" viewBox="25 30 150 145" fill="none" aria-hidden="true">${animalArt(animal, { towel: true })}</svg>`; }

export function scene(animal, pct, decorations = []) {
  const lilies = decorations.includes('lilies');
  const lanterns = decorations.includes('lanterns');
  const duck = decorations.includes('duck');
  return `<svg class="spring-art" viewBox="0 0 760 470" role="img" aria-label="A peaceful illustrated hot spring with your ${animal} companion. ${Math.min(pct, 100)} percent of your daily goal.">
  <defs><linearGradient id="pond" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#aecdc0"/><stop offset="1" stop-color="#8bb5a5"/></linearGradient><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f0f1e5"/><stop offset="1" stop-color="#e1e7d4"/></linearGradient><clipPath id="scene-clip"><rect width="760" height="470" rx="24"/></clipPath></defs>
  <g clip-path="url(#scene-clip)">
  <rect width="760" height="470" fill="url(#sky)"/><circle cx="577" cy="78" r="37" fill="#f6e5b5"/>
  <path d="M-20 213Q110 63 268 197 395 69 560 183 697 99 799 179V400H-20Z" fill="#ced9bd"/>
  <path d="M-40 260Q100 133 248 229 401 150 537 226 681 142 800 230v260H-40Z" fill="#b9caaa"/>
  <path d="M0 328Q170 232 387 286T760 266V470H0Z" fill="#d6dfc2"/>
  <g stroke="#899a70" stroke-width="8" stroke-linecap="round"><path d="M87 294V80M116 294V30M141 294V112M665 286V77M688 286V35M714 286V107"/></g>
  <g stroke="#afc093" stroke-width="3"><path d="M83 120h8m-8 54h8m-8 55h8m21-151h16m-16 66h16m-16 60h16m17-43h8m-8 61h8m520-113h10m-10 69h10m12-93h12m-12 71h12m-12 62h12m12-30h10m-10 58h10"/></g>
  <g fill="#8fa779"><path d="M114 107Q48 67 40 95q35 28 74 12M117 151q53-53 70-29-21 35-70 29M89 188q-58-28-62-5 28 24 62 5M689 99q-47-48-71-28 20 31 71 28M686 148q59-38 67-10-28 24-67 10M666 210q-53-35-64-12 23 24 64 12"/></g>
  <g fill="#87986c" opacity=".65"><ellipse cx="35" cy="279" rx="53" ry="34"/><ellipse cx="744" cy="273" rx="62" ry="42"/></g>
  <ellipse cx="384" cy="382" rx="286" ry="65" fill="#a8b694" opacity=".45"/>
  <path d="M118 319Q128 253 375 251T649 319v51q-10 74-267 74-254 0-264-74Z" fill="#9da591"/>
  <ellipse cx="384" cy="326" rx="266" ry="88" fill="#b9beac"/>
  <ellipse cx="384" cy="320" rx="238" ry="73" fill="url(#pond)"/>
  <g fill="none" stroke="#d8e5d7" stroke-width="2.5" opacity=".7"><ellipse class="ripple ripple-one" cx="386" cy="328" rx="121" ry="25"/><ellipse class="ripple ripple-two" cx="386" cy="330" rx="161" ry="39"/><path d="M182 312q40-18 82-9m239 49q42 3 75-13"/></g>
  <g fill="#cbd0bf"><ellipse cx="166" cy="284" rx="35" ry="16" transform="rotate(-22 166 284)"/><ellipse cx="222" cy="260" rx="35" ry="15" transform="rotate(-13 222 260)"/><ellipse cx="291" cy="248" rx="35" ry="14"/><ellipse cx="362" cy="244" rx="35" ry="14"/><ellipse cx="433" cy="246" rx="35" ry="14"/><ellipse cx="503" cy="255" rx="35" ry="14" transform="rotate(10 503 255)"/><ellipse cx="567" cy="274" rx="35" ry="16" transform="rotate(21 567 274)"/><ellipse cx="612" cy="301" rx="29" ry="17" transform="rotate(35 612 301)"/></g>
  ${decorations.includes('bamboo') ? '<g><path d="M572 231v-75h-61" fill="none" stroke="#8a9e65" stroke-width="16" stroke-linecap="round"/><path d="M572 227v-72h-59" fill="none" stroke="#b4c28e" stroke-width="7"/><ellipse cx="508" cy="155" rx="5" ry="8" fill="#667c4e"/><path class="fountain" d="M506 159q-17 51-10 114" fill="none" stroke="#dcebe1" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 8"/><ellipse cx="495" cy="278" rx="18" ry="5" fill="none" stroke="#dcebe1" stroke-width="2"/></g>' : ''}
  <g class="companion-float" transform="translate(279 164) scale(1.05)">${animalArt(animal, { towel: pct >= 25, happy: pct >= 100 })}
    <g class="behavior-effects" aria-hidden="true">
      <g class="effect-hearts" fill="#bc7965"><path d="M47 63 36 51C29 40 43 35 47 44c5-9 18-4 12 7Z"/><path d="m155 44-8-9c-6-8 5-12 8-5 4-7 14-3 9 5Z"/></g>
      <g class="effect-bubbles" fill="none" stroke="#e5f1df" stroke-width="2.5"><circle cx="52" cy="79" r="7"/><circle cx="150" cy="60" r="10"/><circle cx="166" cy="91" r="5"/></g>
      <g class="effect-splash" fill="#cbe5d9"><ellipse cx="39" cy="125" rx="4" ry="9" transform="rotate(-30 39 125)"/><ellipse cx="160" cy="121" rx="4" ry="10" transform="rotate(35 160 121)"/><ellipse cx="174" cy="140" rx="3" ry="7" transform="rotate(55 174 140)"/></g>
      <g class="effect-sleep" fill="#fff7df" stroke="#607555" stroke-width=".6" paint-order="stroke"><text x="148" y="68" font-family="Georgia,serif" font-size="16">z</text><text x="161" y="51" font-family="Georgia,serif" font-size="21">z</text></g>
    </g>
  </g>
  <path d="M293 333q85 22 176-2" fill="none" stroke="#cce1d3" stroke-width="5" stroke-linecap="round"/>
  ${pct >= 50 ? '<g fill="#e5c36f"><ellipse cx="262" cy="303" rx="8" ry="5" transform="rotate(20 262 303)"/><ellipse cx="466" cy="347" rx="7" ry="4" transform="rotate(-20 466 347)"/></g>' : ''}
  ${pct >= 75 ? '<g fill="#f3e1cc"><path d="M169 239q-12-14-1-15 1-17 9-4 17-3 8 8 8 15-7 10-12 10-9 1"/><path d="M606 226q-12-14-1-15 1-17 9-4 17-3 8 8 8 15-7 10-12 10-9 1"/></g>' : ''}
  ${pct >= 100 ? '<g fill="#f9f0cd" class="steam"><circle cx="280" cy="218" r="4"/><circle cx="481" cy="211" r="5"/><circle cx="461" cy="241" r="3"/><circle cx="302" cy="185" r="3"/></g>' : ''}
  <g class="steam" fill="none" stroke="#fffdf2" stroke-width="6" stroke-linecap="round" opacity=".6"><path d="M252 231q-14-16 0-32t0-32M458 204q-14-16 0-32t0-32M391 148q-12-14 0-28t0-28"/></g>
  <g fill="#bcc2af"><ellipse cx="145" cy="346" rx="30" ry="21" transform="rotate(24 145 346)"/><ellipse cx="190" cy="379" rx="38" ry="20" transform="rotate(20 190 379)"/><ellipse cx="265" cy="402" rx="42" ry="21" transform="rotate(9 265 402)"/><ellipse cx="350" cy="412" rx="44" ry="20"/><ellipse cx="437" cy="411" rx="43" ry="20"/><ellipse cx="517" cy="394" rx="40" ry="21" transform="rotate(-13 517 394)"/><ellipse cx="584" cy="368" rx="35" ry="20" transform="rotate(-26 584 368)"/><ellipse cx="625" cy="338" rx="24" ry="20"/></g>
  <g fill="#d1d5c3" opacity=".7"><ellipse cx="188" cy="374" rx="20" ry="5"/><ellipse cx="266" cy="396" rx="23" ry="5"/><ellipse cx="350" cy="405" rx="24" ry="5"/><ellipse cx="436" cy="404" rx="24" ry="5"/><ellipse cx="515" cy="388" rx="21" ry="5"/></g>
  ${lilies ? '<g><ellipse cx="220" cy="331" rx="24" ry="10" fill="#78996e"/><path d="m220 331 20-7-7 11Z" fill="#aecdc0"/><path d="M208 323q-5-15 8-7 4-18 9-1 15-9 10 5-11 12-27 3" fill="#efd0bd"/></g>' : ''}
  ${duck ? '<g transform="translate(526 309)"><ellipse cy="11" rx="19" ry="10" fill="#e8bf61"/><circle cx="-10" cy="-1" r="10" fill="#f0cc70"/><path d="m-19-3-9 4 10 3" fill="#cb8b40"/><circle cx="-12" cy="-3" r="1.7" fill="#594d30"/></g>' : ''}
  ${lanterns ? '<g><path d="M69 39q304 95 626 0" fill="none" stroke="#7d8064" stroke-width="2"/><g fill="#e9c78d" stroke="#b49765" stroke-width="1.5"><rect x="193" y="75" width="29" height="36" rx="13"/><rect x="532" y="76" width="29" height="36" rx="13"/></g><path d="M207 111v8m339-7v8" stroke="#b49765" stroke-width="2"/></g>' : ''}
  <g fill="#8d9c70"><path d="m97 409-7-21 14 13 5-26 7 29 18-12-12 22ZM653 415l-8-24 15 15 4-29 9 28 15-8-10 20Z"/></g>
  <g fill="#ece6cc"><ellipse cx="62" cy="373" rx="15" ry="9"/><ellipse cx="684" cy="345" rx="17" ry="10"/></g>
  </g></svg>`;
}
