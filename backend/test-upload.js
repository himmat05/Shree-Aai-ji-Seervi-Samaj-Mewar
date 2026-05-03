const fs = require('fs');

async function testUpload() {
  const formData = new FormData();
  formData.append('title', 'Test Event');
  formData.append('date', '2024-01-01');
  formData.append('location', 'Test');
  formData.append('description', 'Test');
  // Create a dummy file blob
  const blob = new Blob(['dummy content'], { type: 'image/png' });
  formData.append('image', blob, 'test.png');

  try {
    const res = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      body: formData
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.log(e);
  }
}

testUpload();
