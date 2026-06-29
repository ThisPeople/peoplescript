// src/browser.js
const { compile } = require('./compiler');
const dictionary = require('./dictionary');

const PeopleScript = {
    compile,
    dictionary,
    version: '1.0.0'
};

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.PeopleScript = PeopleScript;
}

// Функция для компиляции всех скриптов
function compilePeopleScripts() {
    const scripts = document.querySelectorAll('script[type="peoplescript"]');
    let compiledCount = 0;
    
    scripts.forEach((script) => {
        try {
            const code = script.textContent || script.innerText;
            const compiled = compile(code);
            
            const newScript = document.createElement('script');
            newScript.textContent = compiled;
            
            Array.from(script.attributes).forEach(attr => {
                if (attr.name !== 'type') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });
            
            script.parentNode.replaceChild(newScript, script);
            compiledCount++;
        } catch (error) {
            console.error('Ошибка компиляции PeopleScript:', error.message);
        }
    });
    
    if (compiledCount > 0) {
        console.log(`Скомпилировано ${compiledCount} PeopleScript скриптов`);
    }
    return compiledCount;
}

// Автоматическая компиляция
function autoCompile() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', compilePeopleScripts);
    } else {
        compilePeopleScripts();
    }
}

// Добавляем методы
PeopleScript.compileAll = compilePeopleScripts;
PeopleScript.compileInline = compilePeopleScripts;

// Автозапуск
autoCompile();

console.log('PeopleScript готов! Версия:', PeopleScript.version);

module.exports = PeopleScript;