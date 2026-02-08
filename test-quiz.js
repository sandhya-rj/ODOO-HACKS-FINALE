const http = require('http');

const data = JSON.stringify({
  userId: 'cac7caff-6f69-483f-a39d-50abbf8f54ac', // Emma Wilson
  quizId: 'quiz-js-fundamentals',
  score: 8,
  totalQuestions: 10
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/quiz/submit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
    try {
      const json = JSON.parse(responseData);
      console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Not JSON:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
