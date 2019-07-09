const fetch = require("node-fetch");
const fs = require("fs");

const speakersJs = 'https://data.brownbaglunch.fr/baggers.js';
const readme = 'README.md';
let speakers = "";


(async () => {
    const bbl = await fetch(speakersJs);
    const body = await bbl.text();
    eval(body);
    const rennesSpeakers = data.speakers.filter(speaker => speaker.cities.includes('Rennes'));

    rennesSpeakers.forEach(function(speaker) {
        speakers += getSpeakerInfos(speaker);
    });

    fs.readFile(readme, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/(?<=\#startspeakers)([\S\s]*?)(?=\[\/\/\]\: \#endspeakers)/gm, speakers);

        fs.writeFile(readme, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });

})();


function getSpeakerInfos(speaker) {
    let content = '\r\n\r\n### ' + speaker.name + '\r\n\r\n';

    if (speaker.sessions) {

        speaker.sessions.forEach(function(session) {
            content += '#### ' + session.title + '\r\n\r\n';
            if (session.abstract) {
                content += session.abstract + '\r\n\r\n';
            }
        });
        return content;
    }
}
