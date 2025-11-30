// Node.js script to convert CSV to JavaScript array
const fs = require('fs');

// Read CSV file
const csvContent = fs.readFileSync('english_quiz_500.csv', 'utf-8');
const lines = csvContent.split('\n');

const vocabulary = [];

// Skip header line
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length < 7) continue;
    
    const word = parts[1];
    const choice1 = parts[2];
    const choice2 = parts[3];
    const choice3 = parts[4];
    const choice4 = parts[5];
    const correctOption = parseInt(parts[6]);
    
    if (!word || isNaN(correctOption) || correctOption < 1 || correctOption > 4) {
        continue;
    }
    
    // Determine correct answer and options
    const choices = [choice1, choice2, choice3, choice4];
    const correct = choices[correctOption - 1];
    const options = choices.filter((_, index) => index !== correctOption - 1);
    
    vocabulary.push({
        word: word,
        correct: correct,
        options: options
    });
}

// Generate JavaScript code
let jsCode = '// Vocabulary data (auto-generated from CSV)\nconst vocabulary = [\n';

vocabulary.forEach((item, index) => {
    jsCode += `    {\n`;
    jsCode += `        word: "${item.word}",\n`;
    jsCode += `        correct: "${item.correct}",\n`;
    jsCode += `        options: ["${item.options[0]}", "${item.options[1]}", "${item.options[2]}"]\n`;
    jsCode += `    }`;
    if (index < vocabulary.length - 1) {
        jsCode += ',';
    }
    jsCode += '\n';
});

jsCode += '];\n';

// Write to file
fs.writeFileSync('vocabulary_data.js', jsCode);
console.log(`Converted ${vocabulary.length} vocabulary items to vocabulary_data.js`);

