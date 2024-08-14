const fs = require('fs')

const BASE_URI = 'https://api-trial.cognigy.ai'
const API_KEY = process.env.COGNIGY_API_KEY
const PROJECT_ID = process.env.COGNIGY_PROJECT_ID

function findExtensionId() {
    const url = BASE_URI + '/v2.0/extensions?filter=vier-voice&projectId=' + PROJECT_ID

    return fetch(url, {
        headers: { "X-API-Key": API_KEY },
    }).then(async (res) => {
        console.log(res.status)
        const fullExtensionUrl = await res.json().then(data => data._embedded.extensions[0]._links.self.href)
        const splittedUrl = fullExtensionUrl.split('/')
        return splittedUrl[splittedUrl.length - 1]
    })
}

function update(extensionId) {
    const url = BASE_URI + '/v2.0/extensions/update'

    const form = new FormData();
    form.append('file', new Blob([fs.readFileSync('vier_voice.tar.gz')]), 'vier_voice.tar.gz');
    form.append('projectId', PROJECT_ID);
    form.append('extension', extensionId);

    fetch(url, {
        method: 'POST',
        body: form,
        headers: { "X-API-Key": API_KEY },
        timeout: 1000 * 30,
    }).then((res) => {
        console.log(res.status)
        res.json().then(data => console.log(data))
    })
}

findExtensionId().then(id => update(id))