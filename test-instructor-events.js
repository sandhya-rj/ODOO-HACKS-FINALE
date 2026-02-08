const http = require('http');

const instructorId = '30daa450-de2f-4089-952f-5162926a6b58'; // Michael Chen

const options = {
  hostname: 'localhost',
  port: 5000,
  path: `/api/events/instructor?instructorId=${instructorId}&limit=5`,
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('\nInstructor Events:');
      console.log(JSON.stringify(json, null, 2));
      
      if (json.data && json.data.length > 0) {
        console.log(`\n✅ Found ${json.data.length} events for instructor's courses`);
        json.data.forEach((event, i) => {
          const meta = typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata;
          console.log(`\n${i+1}. ${event.type} - ${meta.quizTitle || meta.lessonTitle || 'N/A'}`);
        });
      } else {
        console.log('\n⚠️ No events found');
      }
    } catch (e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
