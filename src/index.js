// src/index.js
const { compile } = require('./compiler');
const dictionary = require('./dictionary');
const fs = require('fs');
const path = require('path');

const PeopleScript = {
    compile,
    dictionary,
    version: '1.0.0'
};

module.exports = PeopleScript;

// Если запускаем как CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
PeopleScript Compiler v1.0.0

Использование:
  node src/index.js <файл.ps> [опции]

Опции:
  --help, -h     Показать эту справку
  --output, -o   Указать выходной файл (по умолчанию заменяет .ps на .js)

Примеры:
  node src/index.js example.ps
  node src/index.js example.ps -o output.js
        `);
        process.exit(0);
    }

    const inputFile = args[0];
    
    if (!fs.existsSync(inputFile)) {
        console.error(`Ошибка: Файл "${inputFile}" не найден!`);
        process.exit(1);
    }

    let outputFile = args.includes('--output') || args.includes('-o') 
        ? args[args.indexOf(args.includes('-o') ? '-o' : '--output') + 1]
        : inputFile.replace(/\.ps$/i, '.js');

    if (!outputFile.endsWith('.js')) {
        outputFile += '.js';
    }

    try {
        const code = fs.readFileSync(inputFile, 'utf8');
        console.log(`Компиляция: ${inputFile} → ${outputFile}`);
        const compiled = compile(code);
        fs.writeFileSync(outputFile, compiled, 'utf8');
        console.log(`Успешно! Файл сохранён: ${outputFile}`);
        
        const inputLines = code.split('\n').length;
        const outputLines = compiled.split('\n').length;
        console.log(`Статистика: ${inputLines} строк → ${outputLines} строк`);
        
    } catch (error) {
        console.error(`Ошибка компиляции:`, error.message);
        process.exit(1);
    }
}