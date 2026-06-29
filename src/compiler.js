// src/compiler.js
const dictionary = require('./dictionary');

function escapeRegExp(str) {
    str = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (/^\w+$/.test(str)) {
        str = '\\b' + str + '\\b';
    }
    return str;
}

function peopleReplaceAll(str, search, replacement) {
    const re = new RegExp(escapeRegExp(search), 'g');
    return str.replace(re, replacement);
}

/**
 * @param text текст, по которому следует пройтись
 * @param to язык текста ('js' or 'ps')
 */
function iterateText(text, to = 'ps') {
    const langCol = to === 'ps' ? 1 : 0;
    const dick = [...dictionary.dictionary];
    dick.sort((a, b) => b[langCol].length - a[langCol].length).forEach((pair) => {
        text = peopleReplaceAll(text, pair[langCol], pair[+!langCol]);
    });
    return text;
}

/**
 * Переводит PeopleScript в JavaScript и обратно
 * @param text Строка для перевода
 * @param lang Язык строки (ps/js)
 * @returns {string} Переведённый текст
 */
function compile(text, lang = 'ps') {
    const tmpToken = 'ps_' + new Date().getTime() + '_';
    
    // Сохраняем строки в кавычках
    const rStringLiterals = {};
    text = text.replace(
        /\"(?:\\.|[^\"\\])*\"|\'(?:\\.|[^\'\\])*\'/g,
        (val, pos) => {
            const needKey = tmpToken + pos;
            rStringLiterals[needKey] = val;
            return needKey;
        }
    );

    // Сохраняем комментарии
    const commentRegExp = /((?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:\/\/.*))/g;
    const commentsArray = text.match(commentRegExp) || [];

    // Заменяем ключевые слова
    text = iterateText(text, lang);

    // Возвращаем комментарии
    text = text.replace(commentRegExp, () => commentsArray.shift() || '');

    // Возвращаем строки
    for (const key in rStringLiterals) {
        text = text.replace(key, rStringLiterals[key]);
    }

    return text;
}

module.exports = {
    compile,
    iterateText,
    escapeRegExp
};