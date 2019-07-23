// Quick & Dirty script
// extract baggers from main repo, filter only Rennes ones and print them back into our readme

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// #SingleSourceOfTruth
const speakersJs = 'https://data.brownbaglunch.fr/baggers.js';
const output = path.resolve(__dirname, 'README.adoc');


const tmpl = (filename) => Handlebars.compile(fs.readFileSync(path.resolve(__dirname, 'templates', filename), 'utf8'));

const templates = {
  readme: tmpl('README.adoc'),
};


(async () => {
  // retrieve speakers & sessions
  const bbl = await fetch(speakersJs);
  const body = await bbl.text();
  eval(body);

  const speakers = data.speakers
    .filter(speaker => speaker.cities.includes('Rennes'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sessions = speakers
    // flatMap `sessions` attribute add `speaker` attribute to every sessions
    .reduce((m, speaker) => m.concat(speaker.sessions.map(session => Object.assign(session, {
      speaker: speaker,
    }))), [])
    .sort((a, b) => a.title.localeCompare(b.title));

  const result = templates.readme({
    speakers,
    sessions,
  });

  fs.writeFileSync(output, result, 'utf8');
})();
