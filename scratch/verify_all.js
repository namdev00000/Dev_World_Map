const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');
const quizData = fs.readFileSync('js/quiz-data.js', 'utf8');

// 1. Check DOM IDs
const regex = /getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const ids = new Set();
while ((match = regex.exec(app)) !== null) {
  ids.add(match[1]);
}

console.log('Total unique IDs referenced in app.js:', ids.size);
let missing = [];
ids.forEach(id => {
  if (!html.includes('id="' + id + '"')) {
    missing.push(id);
  }
});

if (missing.length > 0) {
  console.error('MISSING IDs in index.html:', missing);
  process.exit(1);
} else {
  console.log('✅ ALL', ids.size, 'IDs exist in index.html!');
}

// 2. Evaluate QUIZ_DATA
global.window = {};
eval(quizData);

const questions = global.window.QUIZ_DATA;
console.log('Total Quiz Questions:', questions.length);

if (questions.length !== 456) {
  console.error('❌ Expected 456 questions, got:', questions.length);
  process.exit(1);
}

// 3. Verify Portion count
const portions = new Set();
questions.forEach(q => portions.add(q.portionNumber));
console.log('Total Portions covered:', portions.size);
if (portions.size !== 228) {
  console.error('❌ Expected 228 portions, got:', portions.size);
  process.exit(1);
}

// 4. Verify options and correctIndex
let invalidCount = 0;
questions.forEach((q, idx) => {
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    console.error(`Question #${idx + 1} does not have 4 options`);
    invalidCount++;
  }
  if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
    console.error(`Question #${idx + 1} has invalid correctIndex: ${q.correctIndex}`);
    invalidCount++;
  }
  if (!q.question || q.question.trim().length === 0) {
    console.error(`Question #${idx + 1} has empty question`);
    invalidCount++;
  }
  if (!q.explanation || q.explanation.trim().length === 0) {
    console.error(`Question #${idx + 1} has empty explanation`);
    invalidCount++;
  }
});

if (invalidCount === 0) {
  console.log('✅ ALL 456 questions have 4 valid choices, correct index, and educational facts!');
} else {
  process.exit(1);
}

// 5. Category breakdown
const cats = {};
questions.forEach(q => cats[q.category] = (cats[q.category] || 0) + 1);
console.log('Categories:', cats);

const continents = {};
questions.forEach(q => continents[q.continent] = (continents[q.continent] || 0) + 1);
console.log('Continents/Regions:', continents);
