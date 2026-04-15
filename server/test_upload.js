const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Create a dummy pdf
fs.writeFileSync('dummy.pdf', 'dummy content');

const form = new FormData();
form.append('resume', fs.createReadStream('dummy.pdf'));
form.append('jobMatrix', JSON.stringify([{ job_title: "UI/UX", requirements: ["Canva"] }]));

fetch('http://localhost:5957/api/applications/match-jobs', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
}).then(res => res.json()).then(data => console.log("Response:", data)).catch(e => console.error(e));
