const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
    const formData = new FormData();
    formData.append('name', 'Test');
    formData.append('email', 'test@example.com');
    formData.append('phone', '123456');
    formData.append('position', 'Developer');
    
    // create dummy pdf
    fs.writeFileSync('dummy.pdf', 'dummy content');
    formData.append('resume', fs.createReadStream('dummy.pdf'));

    try {
        const res = await fetch('http://localhost:5957/api/resumes', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        console.log("Success:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
testUpload();
