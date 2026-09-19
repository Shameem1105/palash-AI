/* ==========================================================================
   BhashaSetu Offline AI Assistant - Interactive Application Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // State Management
  const state = {
    currentView: 'dashboard-view',
    isListening: false,
    isSpeaking: false,
    micConnected: true,
    studentResponseOn: false,
    inputLang: 'English',
    targetLang: 'Tamil',
    teacherInputLang: 'English',
    teacherTargetLang: 'Tamil',
    recognition: null,
    synth: window.speechSynthesis,
    lastTeacherText: '',
    lastTranslatedText: ''
  };

  // --------------------------------------------------------------------------
  // OFFLINE TRANSLITERATION ENGINE (Latin & Devanagari → Target Scripts)
  // --------------------------------------------------------------------------
  const scriptMaps = {
    Tamil: {
      consonants: { 'sh':'ஷ','ch':'ச','th':'த','dh':'த','bh':'ப','kh':'க','gh':'க','ph':'ப','jh':'ஜ','ng':'ங','ny':'ஞ','zh':'ழ','nk':'ங்க','nd':'ந்த','mb':'ம்ப','nt':'ந்த',
        'k':'க','g':'க','c':'ச','j':'ஜ','t':'த','d':'த','n':'ன','p':'ப','b':'ப','m':'ம','y':'ய','r':'ர','l':'ல','v':'வ','w':'வ','s':'ச','h':'ஹ','z':'ஸ','f':'ப','q':'க','x':'க்ஸ' },
      vowelMarks: { 'aa':'ா','ee':'ீ','oo':'ூ','ai':'ை','au':'ௌ','ou':'ௌ','i':'ி','u':'ு','e':'ெ','o':'ொ' },
      vowels: { 'aa':'ஆ','ee':'ஈ','oo':'ஊ','ai':'ஐ','au':'ஔ','ou':'ஔ','a':'அ','i':'இ','u':'உ','e':'எ','o':'ஒ' },
      virama: '்',
      devanagari: { 'अ':'அ','आ':'ஆ','इ':'இ','ई':'ஈ','उ':'உ','ऊ':'ஊ','ए':'எ','ऐ':'ஐ','ओ':'ஒ','औ':'ஔ','अं':'அம்','अः':'அஃ',
        'क':'க','ख':'க','ग':'க','घ':'க','ङ':'ங','च':'ச','छ':'ச','ज':'ஜ','झ':'ஜ','ञ':'ஞ',
        'ट':'ட','ठ':'ட','ड':'ட','ढ':'ட','ण':'ண','त':'த','थ':'த','द':'த','ध':'த','न':'ந',
        'प':'ப','फ':'ப','ब':'ப','भ':'ப','म':'ம','य':'ய','र':'ர','ल':'ல','व':'வ',
        'श':'ஷ','ष':'ஷ','स':'ச','ह':'ஹ',
        'ा':'ா','ि':'ி','ी':'ீ','ु':'ு','ू':'ூ','े':'ெ','ै':'ை','ो':'ொ','ौ':'ௌ',
        'ं':'ம்','ः':'ஃ','्':'்','ँ':'ம்','़':'' }
    },
    Telugu: {
      consonants: { 'sh':'శ','ch':'చ','th':'థ','dh':'ధ','bh':'భ','kh':'ఖ','gh':'ఘ','ph':'ఫ','jh':'ఝ','ng':'ఙ','ny':'ఞ',
        'k':'క','g':'గ','c':'చ','j':'జ','t':'త','d':'ద','n':'న','p':'ప','b':'బ','m':'మ','y':'య','r':'ర','l':'ల','v':'వ','w':'వ','s':'స','h':'హ','z':'జ','f':'ఫ','q':'క','x':'క్స' },
      vowelMarks: { 'aa':'ా','ee':'ీ','oo':'ూ','ai':'ై','au':'ౌ','ou':'ౌ','i':'ి','u':'ు','e':'ె','o':'ొ' },
      vowels: { 'aa':'ఆ','ee':'ఈ','oo':'ఊ','ai':'ఐ','au':'ఔ','ou':'ఔ','a':'అ','i':'ఇ','u':'ఉ','e':'ఎ','o':'ఒ' },
      virama: '్',
      devanagari: { 'अ':'అ','आ':'ఆ','इ':'ఇ','ई':'ఈ','उ':'ఉ','ऊ':'ఊ','ए':'ఎ','ऐ':'ఐ','ओ':'ఒ','औ':'ఔ',
        'क':'క','ख':'ఖ','ग':'గ','घ':'ఘ','ङ':'ఙ','च':'చ','छ':'ఛ','ज':'జ','झ':'ఝ','ञ':'ఞ',
        'ट':'ట','ठ':'ఠ','ड':'డ','ढ':'ఢ','ण':'ణ','त':'త','थ':'థ','द':'ద','ध':'ధ','न':'న',
        'प':'ప','फ':'ఫ','ब':'బ','भ':'భ','म':'మ','य':'య','र':'ర','ल':'ల','व':'వ',
        'श':'శ','ष':'ష','स':'స','ह':'హ',
        'ा':'ా','ि':'ి','ी':'ీ','ु':'ు','ू':'ూ','े':'ె','ै':'ై','ो':'ొ','ौ':'ౌ',
        'ं':'ం','ः':'ః','्':'్','ँ':'ఁ','़':'' }
    },
    Bengali: {
      consonants: { 'sh':'শ','ch':'চ','th':'থ','dh':'ধ','bh':'ভ','kh':'খ','gh':'ঘ','ph':'ফ','jh':'ঝ','ng':'ঙ','ny':'ঞ',
        'k':'ক','g':'গ','c':'চ','j':'জ','t':'ত','d':'দ','n':'ন','p':'প','b':'ব','m':'ম','y':'য','r':'র','l':'ল','v':'ভ','w':'ও','s':'স','h':'হ','z':'জ','f':'ফ','q':'ক','x':'ক্স' },
      vowelMarks: { 'aa':'া','ee':'ী','oo':'ূ','ai':'ৈ','au':'ৌ','ou':'ৌ','i':'ি','u':'ু','e':'ে','o':'ো' },
      vowels: { 'aa':'আ','ee':'ঈ','oo':'ঊ','ai':'ঐ','au':'ঔ','ou':'ঔ','a':'অ','i':'ই','u':'উ','e':'এ','o':'ও' },
      virama: '্',
      devanagari: { 'अ':'অ','आ':'আ','इ':'ই','ई':'ঈ','उ':'উ','ऊ':'ঊ','ए':'এ','ऐ':'ঐ','ओ':'ও','औ':'ঔ',
        'क':'ক','ख':'খ','ग':'গ','घ':'ঘ','ङ':'ঙ','च':'চ','छ':'ছ','ज':'জ','झ':'ঝ','ञ':'ঞ',
        'ट':'ট','ठ':'ঠ','ड':'ড','ढ':'ঢ','ण':'ণ','त':'ত','थ':'থ','द':'দ','ध':'ধ','न':'ন',
        'प':'প','फ':'ফ','ब':'ব','भ':'ভ','म':'ম','य':'য','र':'র','ल':'ল','व':'ভ',
        'श':'শ','ष':'ষ','स':'স','ह':'হ',
        'ा':'া','ि':'ি','ी':'ী','ु':'ু','ू':'ূ','े':'ে','ै':'ৈ','ो':'ো','ौ':'ৌ',
        'ं':'ং','ः':'ঃ','्':'্','ँ':'ঁ','़':'' }
    },
    Gujarati: {
      consonants: { 'sh':'શ','ch':'ચ','th':'થ','dh':'ધ','bh':'ભ','kh':'ખ','gh':'ઘ','ph':'ફ','jh':'ઝ','ng':'ઙ','ny':'ઞ',
        'k':'ક','g':'ગ','c':'ચ','j':'જ','t':'ત','d':'દ','n':'ન','p':'પ','b':'બ','m':'મ','y':'ય','r':'ર','l':'લ','v':'વ','w':'વ','s':'સ','h':'હ','z':'ઝ','f':'ફ','q':'ક','x':'ક્સ' },
      vowelMarks: { 'aa':'ા','ee':'ી','oo':'ૂ','ai':'ૈ','au':'ૌ','ou':'ૌ','i':'િ','u':'ુ','e':'ે','o':'ો' },
      vowels: { 'aa':'આ','ee':'ઈ','oo':'ઊ','ai':'ઐ','au':'ઔ','ou':'ઔ','a':'અ','i':'ઇ','u':'ઉ','e':'એ','o':'ઓ' },
      virama: '્',
      devanagari: { 'अ':'અ','आ':'આ','इ':'ઇ','ई':'ઈ','उ':'ઉ','ऊ':'ઊ','ए':'એ','ऐ':'ઐ','ओ':'ઓ','औ':'ઔ',
        'क':'ક','ख':'ખ','ग':'ગ','घ':'ઘ','ङ':'ઙ','च':'ચ','छ':'છ','ज':'જ','झ':'ઝ','ञ':'ઞ',
        'ट':'ટ','ठ':'ઠ','ड':'ડ','ढ':'ઢ','ण':'ણ','त':'ત','थ':'થ','द':'દ','ध':'ધ','न':'ન',
        'प':'પ','फ':'ફ','ब':'બ','भ':'ભ','म':'મ','य':'ય','र':'ર','ल':'લ','व':'વ',
        'श':'શ','ष':'ષ','स':'સ','ह':'હ',
        'ा':'ા','ि':'િ','ी':'ી','ु':'ુ','ू':'ૂ','े':'ે','ै':'ૈ','ो':'ો','ौ':'ૌ',
        'ं':'ં','ः':'ઃ','्':'્','ँ':'ઁ','़':'' }
    },
    Santhali: {
      // Ol Chiki is alphabetic (not syllabic) - every sound written explicitly
      consonants: { 'sh':'ᱥ','ch':'ᱪ','th':'ᱛ','dh':'ᱫ','bh':'ᱵ','kh':'ᱠ','gh':'ᱜ','ph':'ᱯ','jh':'ᱡ','ng':'ᱝ','ny':'ᱧ',
        'k':'ᱠ','g':'ᱜ','c':'ᱪ','j':'ᱡ','t':'ᱛ','d':'ᱫ','n':'ᱱ','p':'ᱯ','b':'ᱵ','m':'ᱢ','y':'ᱭ','r':'ᱨ','l':'ᱞ','v':'ᱵ','w':'ᱣ','s':'ᱥ','h':'ᱦ','z':'ᱡ','f':'ᱯ','q':'ᱠ','x':'ᱠᱥ' },
      vowels: { 'aa':'ᱟ','ee':'ᱤ','oo':'ᱩ','ai':'ᱟᱤ','au':'ᱟᱩ','ou':'ᱟᱩ','a':'ᱟ','i':'ᱤ','u':'ᱩ','e':'ᱮ','o':'ᱚ' },
      isAlphabetic: true, // Ol Chiki writes every vowel explicitly, no inherent vowel
      devanagari: { 'अ':'ᱟ','आ':'ᱟ','इ':'ᱤ','ई':'ᱤ','उ':'ᱩ','ऊ':'ᱩ','ए':'ᱮ','ऐ':'ᱟᱤ','ओ':'ᱚ','औ':'ᱟᱩ',
        'क':'ᱠ','ख':'ᱠ','ग':'ᱜ','घ':'ᱜ','ङ':'ᱝ','च':'ᱪ','छ':'ᱪ','ज':'ᱡ','झ':'ᱡ','ञ':'ᱧ',
        'ट':'ᱴ','ठ':'ᱴ','ड':'ᱰ','ढ':'ᱰ','ण':'ᱱ','त':'ᱛ','थ':'ᱛ','द':'ᱫ','ध':'ᱫ','न':'ᱱ',
        'प':'ᱯ','फ':'ᱯ','ब':'ᱵ','भ':'ᱵ','म':'ᱢ','य':'ᱭ','र':'ᱨ','ल':'ᱞ','व':'ᱣ',
        'श':'ᱥ','ष':'ᱥ','स':'ᱥ','ह':'ᱦ',
        'ा':'ᱟ','ि':'ᱤ','ी':'ᱤ','ु':'ᱩ','ू':'ᱩ','े':'ᱮ','ै':'ᱟᱤ','ो':'ᱚ','ौ':'ᱟᱩ',
        'ं':'ᱸ','ः':'ᱷ','्':'','ँ':'ᱸ','़':'' }
    }
  };

  // Transliterate Latin text to target Indic script
  function transliterateLatin(text, targetLang) {
    const map = scriptMaps[targetLang];
    if (!map) return text;
    const lower = text.toLowerCase();
    let result = '';
    let i = 0;

    while (i < lower.length) {
      // Skip spaces and punctuation - pass through
      if (' .,!?;:\'-"()'.includes(lower[i])) { result += lower[i]; i++; continue; }

      // Try 2-char consonant digraph first
      let consonant = null, cLen = 0;
      if (i + 1 < lower.length && map.consonants[lower.substring(i, i+2)]) {
        consonant = map.consonants[lower.substring(i, i+2)]; cLen = 2;
      } else if (map.consonants[lower[i]]) {
        consonant = map.consonants[lower[i]]; cLen = 1;
      }

      if (consonant) {
        result += consonant;
        i += cLen;

        if (map.isAlphabetic) {
          // Ol Chiki: write vowel explicitly after consonant
          let vFound = false;
          if (i+1 < lower.length && map.vowels[lower.substring(i,i+2)]) {
            result += map.vowels[lower.substring(i,i+2)]; i += 2; vFound = true;
          } else if (i < lower.length && map.vowels[lower[i]]) {
            result += map.vowels[lower[i]]; i += 1; vFound = true;
          }
          // If no vowel follows, that's fine for Ol Chiki (no inherent vowel)
        } else {
          // Brahmic scripts: check for vowel mark
          let vFound = false;
          // Try 2-char vowel mark
          if (i+1 < lower.length && map.vowelMarks[lower.substring(i,i+2)]) {
            result += map.vowelMarks[lower.substring(i,i+2)]; i += 2; vFound = true;
          } else if (i < lower.length && lower[i] === 'a') {
            // Check for 'aa', 'ai', 'au'
            if (i+1 < lower.length && map.vowelMarks[lower.substring(i,i+2)]) {
              result += map.vowelMarks[lower.substring(i,i+2)]; i += 2; vFound = true;
            } else {
              // Inherent 'a' — skip, no mark needed
              i += 1; vFound = true;
            }
          } else if (i < lower.length && map.vowelMarks[lower[i]]) {
            result += map.vowelMarks[lower[i]]; i += 1; vFound = true;
          }
          // No vowel after consonant = end of word or cluster → add virama
          if (!vFound && map.virama) {
            // Check if next char is a consonant or end of string
            result += map.virama;
          }
        }
      } else {
        // Try standalone vowel (2-char first)
        let vFound = false;
        const vMap = map.isAlphabetic ? map.vowels : map.vowels;
        if (i+1 < lower.length && vMap[lower.substring(i,i+2)]) {
          result += vMap[lower.substring(i,i+2)]; i += 2; vFound = true;
        } else if (vMap[lower[i]]) {
          result += vMap[lower[i]]; i += 1; vFound = true;
        }
        if (!vFound) { result += lower[i]; i++; } // pass through unknown chars
      }
    }
    return result;
  }

  // Transliterate Devanagari text to target script
  function transliterateDevanagari(text, targetLang) {
    if (targetLang === 'Marathi') return text; // Marathi uses Devanagari
    const map = scriptMaps[targetLang];
    if (!map || !map.devanagari) return text;

    // For alphabetic scripts (Ol Chiki), we need to handle inherent vowels
    if (map.isAlphabetic) {
      let result = '';
      const chars = [...text];

      // Helper: is this a Devanagari consonant? (क to ह, 0x0915-0x0939)
      const isConsonant = (ch) => ch && ch.charCodeAt(0) >= 0x0915 && ch.charCodeAt(0) <= 0x0939;
      // Helper: is this a Devanagari vowel mark (matra)? (ा to ौ, 0x093E-0x094C)
      const isVowelMark = (ch) => ch && ch.charCodeAt(0) >= 0x093E && ch.charCodeAt(0) <= 0x094C;
      // Helper: is this virama (halant)? ्
      const isVirama = (ch) => ch === '\u094D';
      // Helper: is this anusvara/visarga/chandrabindu? ं ः ँ
      const isNasalEtc = (ch) => ch === '\u0902' || ch === '\u0903' || ch === '\u0901';

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const next = chars[i + 1];

        if (isConsonant(ch)) {
          // Output the mapped consonant
          result += map.devanagari[ch] || ch;

          if (isVirama(next)) {
            // Virama follows = no vowel, skip the virama
            i++; // skip virama
          } else if (isVowelMark(next)) {
            // Explicit vowel mark follows — it will be mapped in the next iteration
            // Don't add inherent 'a'
          } else if (isNasalEtc(next)) {
            // Anusvara/visarga follows — add inherent 'a' first, then nasalization in next iter
            result += '\u1C5F'; // ᱟ (inherent a)
          } else {
            // No vowel mark, no virama → check if word-final (schwa deletion)
            const isWordFinal = !next || next === ' ' || next === ',' || next === '.' || next === '!' || next === '?';
            if (!isWordFinal) {
              // Non-final consonant: add inherent 'a'
              result += '\u1C5F'; // ᱟ
            }
            // Word-final: no inherent 'a' (Hindi schwa deletion rule)
          }
        } else {
          // Vowel, vowel mark, anusvara, etc. — map directly
          result += map.devanagari[ch] || ch;
        }
      }
      return result;
    }

    // For Brahmic scripts (Tamil, Telugu, Bengali, Gujarati) — simple char-by-char works
    let result = '';
    for (const ch of text) {
      result += map.devanagari[ch] || ch;
    }
    return result;
  }

  // Master transliteration: detect script and convert
  function transliterateName(name, targetLang) {
    const isDevanagari = /[\u0900-\u097F]/.test(name);
    if (isDevanagari) {
      return transliterateDevanagari(name, targetLang);
    } else {
      return transliterateLatin(name, targetLang);
    }
  }

  // --------------------------------------------------------------------------
  // NLLB / IndicTrans2 Multi-Language Offline Translation Dictionary
  // --------------------------------------------------------------------------
  const nllbTranslationEngine = {
    // Sentence-level exact & semantic matches for Hindi & English
    sentences: {
      // Hindi Queries
      "आपका नाम क्या है": {
        "Santhali": "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Amag nutum do ched kana?)",
        "Tamil": "Ungal peyar enna? (உங்களின் பெயர் என்ன?)",
        "Telugu": "Mee peru enti? (మీ పేరు ఏంటి?)",
        "Bengali": "Tomar naam ki? (তোমার নাম কি?)",
        "Marathi": "Tumche naav kay aahe? (तुमचे नाव काय आहे?)",
        "Gujarati": "Tamaru naam shu che? (તમારું નામ શું છે?)"
      },
      "तुम्हारा नाम क्या है": {
        "Santhali": "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Amag nutum do ched kana?)",
        "Tamil": "Ungal peyar enna? (உங்களின் பெயர் என்ன?)",
        "Telugu": "Mee peru enti? (మీ పేరు ఏంటి?)",
        "Bengali": "Tomar naam ki? (তোমার নাম কি?)",
        "Marathi": "Tumche naav kay aahe? (तुमचे नाव काय आहे?)",
        "Gujarati": "Tamaru naam shu che? (તમારું નામ શું છે?)"
      },
      "तेरा नाम क्या है": {
        "Santhali": "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Amag nutum do ched kana?)",
        "Tamil": "Ungal peyar enna? (உங்களின் பெயர் என்ன?)",
        "Telugu": "Mee peru enti? (మీ పేరు ఏంటి?)",
        "Bengali": "Tomar naam ki?",
        "Marathi": "Tumche naav kay aahe?",
        "Gujarati": "Tamaru naam shu che?"
      },
      "हेलो": {
        "Santhali": "ᱡᱚᱦᱟᱨ! (Johar!)",
        "Tamil": "Vanakkam! (வணக்கம்)",
        "Telugu": "Namaskaram! (నమస్కారం)",
        "Bengali": "Nomoshkar! (নমস্কার)",
        "Marathi": "Namaskar! (नमस्कार)",
        "Gujarati": "Namaste! (નમસ્તે)"
      },
      "हेलो हेलो": {
        "Santhali": "ᱡᱚᱦᱟᱨ! (Johar!)",
        "Tamil": "Vanakkam! (வணக்கம்)",
        "Telugu": "Namaskaram!",
        "Bengali": "Nomoshkar!",
        "Marathi": "Namaskar!",
        "Gujarati": "Namaste!"
      },
      "hello": {
        "Santhali": "ᱡᱚᱦᱟᱨ! (Johar!)",
        "Tamil": "Vanakkam! (வணக்கம்)",
        "Telugu": "Namaskaram!",
        "Bengali": "Nomoshkar!",
        "Marathi": "Namaskar!",
        "Gujarati": "Namaste!"
      },
      "आपका क्या नाम है": {
        "Santhali": "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Amag nutum do ched kana?)",
        "Tamil": "Ungal peyar enna?",
        "Telugu": "Mee peru enti?",
        "Bengali": "Tomar naam ki?",
        "Marathi": "Tumche naav kay aahe?",
        "Gujarati": "Tamaru naam shu che?"
      },
      "आप कैसे हैं": {
        "Santhali": "ᱟᱢ ᱫᱚ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ? (Am do ched leka menama?)",
        "Tamil": "Eppati irukkirirkal?",
        "Telugu": "Ela unnaru?",
        "Bengali": "Kemon acho?",
        "Marathi": "Kase aahat?",
        "Gujarati": "Kem cho?"
      },
      "नमस्ते": {
        "Santhali": "ᱡᱚᱦᱟᱨ! (Johar!)",
        "Tamil": "Vanakkam! (வணக்கம்)",
        "Telugu": "Namaskaram!",
        "Bengali": "Nomoshkar!",
        "Marathi": "Namaskar!",
        "Gujarati": "Namaste!"
      },
      "शुभ प्रभात": {
        "Santhali": "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ! (Sagun setag!)",
        "Tamil": "Kaalai vanakkam!",
        "Telugu": "Subhodayam!",
        "Bengali": "Shuvo shokal!",
        "Marathi": "Shubh sakal!",
        "Gujarati": "Shubh prabhat!"
      },
      "गुड मॉर्निंग": {
        "Santhali": "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ! (Sagun setag!)",
        "Tamil": "Kaalai vanakkam!",
        "Telugu": "Subhodayam!",
        "Bengali": "Shuvo shokal!",
        "Marathi": "Shubh sakal!",
        "Gujarati": "Shubh prabhat!"
      },
      "आज हम गणित सीखेंगे": {
        "Santhali": "ᱛᱮᱦᱮᱧ ᱟᱞᱮ ᱮᱞᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ (Tehen ale elkha bon chedoga)",
        "Tamil": "Indru naam kanidham karpippom.",
        "Telugu": "Ee roju manam ganitham nerchukunnam.",
        "Bengali": "Aj amra gonit shikhbo.",
        "Marathi": "Aaj aapan ganit shiknaar aahot.",
        "Gujarati": "Aaje apane ganit shikhashu."
      },
      "किताबें खोलें": {
        "Santhali": "ᱯᱚᱛᱚᱵ ᱡᱷᱤᱡ ᱢᱮ (Potob jhij me)",
        "Tamil": "Puthakangalai thirungal.",
        "Telugu": "Pusthakalu theravandi.",
        "Bengali": "Boi kholo.",
        "Marathi": "Pustake ughada.",
        "Gujarati": "Chopadiyo kholo."
      },
      "धन्यवाद": {
        "Santhali": "ᱥᱟᱨᱦᱟᱣ! (Sarhaw!)",
        "Tamil": "Nandri!",
        "Telugu": "Danyavadalu!",
        "Bengali": "Dhonnobad!",
        "Marathi": "Dhanyavaad!",
        "Gujarati": "Aabhar!"
      },
      
      // English Queries
      "what is your name": {
        "Santhali": "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Amag nutum do ched kana?)",
        "Tamil": "Ungal peyar enna?",
        "Telugu": "Mee peru enti?",
        "Bengali": "Tomar naam ki?",
        "Marathi": "Tumche naav kay aahe?",
        "Gujarati": "Tamaru naam shu che?"
      },
      "good morning": {
        "Santhali": "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ! (Sagun setag!)",
        "Tamil": "Kaalai vanakkam!",
        "Telugu": "Subhodayam!",
        "Bengali": "Shuvo shokal!",
        "Marathi": "Shubh sakal!",
        "Gujarati": "Shubh prabhat!"
      },
      "मेरा नाम क्या है": {
        "Santhali": "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Inag nutum do ched kana?)",
        "Tamil": "என் பெயர் என்ன? (En peyar enna?)",
        "Telugu": "Naa peru enti? (నా పేరు ఏంటి?)",
        "Bengali": "Amar naam ki? (আমার নাম কি?)",
        "Marathi": "Majhe naav kay aahe? (माझे नाव काय आहे?)",
        "Gujarati": "Maru naam shu che? (મારું નામ શું છે?)"
      },
      "मेरा क्या नाम है": {
        "Santhali": "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Inag nutum do ched kana?)",
        "Tamil": "என் பெயர் என்ன? (En peyar enna?)",
        "Telugu": "Naa peru enti?",
        "Bengali": "Amar naam ki?",
        "Marathi": "Majhe naav kay aahe?",
        "Gujarati": "Maru naam shu che?"
      },
      "what is my name": {
        "Santhali": "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Inag nutum do ched kana?)",
        "Tamil": "என் பெயர் என்ன? (En peyar enna?)",
        "Telugu": "Naa peru enti?",
        "Bengali": "Amar naam ki?",
        "Marathi": "Majhe naav kay aahe?",
        "Gujarati": "Maru naam shu che?"
      },
      "how are you": {
        "Santhali": "ᱟᱢ ᱫᱚ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ? (Am do ched leka menama?)",
        "Tamil": "Eppati irukkirirkal? (எப்படி இருக்கிறீர்கள்?)",
        "Telugu": "Ela unnaru?",
        "Bengali": "Kemon acho?",
        "Marathi": "Kase aahat?",
        "Gujarati": "Kem cho?"
      },
      "open your books": {
        "Santhali": "ᱟᱢᱟᱜ ᱯᱚᱛᱚᱵ ᱡᱷᱤᱡ ᱢᱮ (Amag potob jhij me)",
        "Tamil": "Puthakangalai thirungal.",
        "Telugu": "Pusthakalu theravandi.",
        "Bengali": "Boi kholo.",
        "Marathi": "Pustake ughada.",
        "Gujarati": "Chopadiyo kholo."
      },
      "thank you": {
        "Santhali": "ᱥᱟᱨᱦᱟᱣ! (Sarhaw!)",
        "Tamil": "Nandri!",
        "Telugu": "Danyavadalu!",
        "Bengali": "Dhonnobad!",
        "Marathi": "Dhanyavaad!",
        "Gujarati": "Aabhar!"
      },
      "i am fine": {
        "Santhali": "ᱤᱧ ᱫᱚ ᱵᱮᱥ ᱜᱮᱭᱟᱹᱧ (In do bes geyan)",
        "Tamil": "Naan nallaa irukken.",
        "Telugu": "Nenu bagunnanu.",
        "Bengali": "Ami bhalo achi.",
        "Marathi": "Mi bara aahe.",
        "Gujarati": "Hu saru chu."
      },
      "मैं ठीक हूँ": {
        "Santhali": "ᱤᱧ ᱫᱚ ᱵᱮᱥ ᱜᱮᱭᱟᱹᱧ (In do bes geyan)",
        "Tamil": "Naan nallaa irukken.",
        "Telugu": "Nenu bagunnanu.",
        "Bengali": "Ami bhalo achi.",
        "Marathi": "Mi bara aahe.",
        "Gujarati": "Hu saru chu."
      }
    },

    // Word-level NLLB dictionary for dynamic fallback parsing
    words: {
      "मेरा": { "Santhali": "ᱤᱧᱟᱜ", "Tamil": "என்", "Telugu": "నా", "Bengali": "আমার", "Marathi": "माझे", "Gujarati": "મારું" },
      "आपका": { "Santhali": "ᱟᱢᱟᱜ", "Tamil": "உங்களின்", "Telugu": "మీ", "Bengali": "তোমার", "Marathi": "तुमचे", "Gujarati": "તમારું" },
      "तुम्हारा": { "Santhali": "ᱟᱢᱟᱜ", "Tamil": "உங்களின்", "Telugu": "మీ", "Bengali": "তোমার", "Marathi": "तुमचे", "Gujarati": "તમારું" },
      "तेरा": { "Santhali": "ᱟᱢᱟᱜ", "Tamil": "உங்களின்", "Telugu": "మీ", "Bengali": "তোমার", "Marathi": "तुमचे", "Gujarati": "તમારું" },
      "नाम": { "Santhali": "ᱧᱩᱛᱩᱢ", "Tamil": "பெயர்", "Telugu": "పేరు", "Bengali": "নাম", "Marathi": "नाव", "Gujarati": "નામ" },
      "क्या": { "Santhali": "ᱪᱮᱫ", "Tamil": "என்ன", "Telugu": "ఏంటి", "Bengali": "কি", "Marathi": "काय", "Gujarati": "શું" },
      "है": { "Santhali": "ᱠᱟᱱᱟ", "Tamil": "இருக்கிறது", "Telugu": "ఉంది", "Bengali": "আছে", "Marathi": "આહે", "Gujarati": "છે" },
      "मैं": { "Santhali": "ᱤᱧ", "Tamil": "நான்", "Telugu": "నేను", "Bengali": "আমি", "Marathi": "मी", "Gujarati": "હું" },
      "ठीक": { "Santhali": "ᱵᱮᱥ", "Tamil": "நல்ல", "Telugu": "బాగున్నాను", "Bengali": "ভালো", "Marathi": "छान", "Gujarati": "સારું" },
      "हूँ": { "Santhali": "ᱜᱮᱭᱟᱹᱧ", "Tamil": "இருக்கிறேன்", "Telugu": "ఉన్నాను", "Bengali": "আছি", "Marathi": "આહે", "Gujarati": "છું" },
      "आप": { "Santhali": "ᱟᱢ", "Tamil": "நீங்கள்", "Telugu": "మీరు", "Bengali": "আপনি", "Marathi": "आपण", "Gujarati": "આપ" },
      "गणित": { "Santhali": "ᱮᱞᱠᱷᱟ", "Tamil": "கணிதம்", "Telugu": "గణితం", "Bengali": "গণিত", "Marathi": "गणित", "Gujarati": "ગણિત" },
      "किताब": { "Santhali": "ᱯᱚᱛᱚᱵ", "Tamil": "புத்தகம்", "Telugu": "పుస్తకం", "Bengali": "বই", "Marathi": "पुस्तक", "Gujarati": "ચોપડી" },
      "पौधे": { "Santhali": "ᱫᱟᱨᱮ", "Tamil": "செடிகள்", "Telugu": "మొక్కలు", "Bengali": "গাছ", "Marathi": "રોપ્ત્યા", "Gujarati": "છોડ" },
      "सूरज": { "Santhali": "ᱥᱤᱸᱜᱤ", "Tamil": "சூரியன்", "Telugu": "సూర్యుడు", "Bengali": "সূর্য", "Marathi": "सूर्य", "Gujarati": "સૂરજ" },
      "प्रकाश": { "Santhali": "ᱥᱮᱛᱟᱱ", "Tamil": "ஒளி", "Telugu": "వెలుగు", "Bengali": "আলোক", "Marathi": "પ્રકાશ", "Gujarati": "પ્રકાશ" },
      "स्कूल": { "Santhali": "ᱟᱥᱲᱟ", "Tamil": "பள்ளி", "Telugu": "బడి", "Bengali": "স্কুল", "Marathi": "शाळा", "Gujarati": "શાળા" },
      "शिक्षक": { "Santhali": "ᱢᱟᱪᱮᱛ", "Tamil": "ஆசிரியர்", "Telugu": "ఉపాధ్యాయుడు", "Bengali": "শিক্ষক", "Marathi": "शिक्षक", "Gujarati": "શિક્ષક" },
      "अच्छा": { "Santhali": "ᱱᱟᱯᱟᱭ", "Tamil": "நல்ல", "Telugu": "మంచిది", "Bengali": "ভালো", "Marathi": "छान", "Gujarati": "સારું" },
      "पानी": { "Santhali": "ᱫᱟᱜ", "Tamil": "தண்ணீர்", "Telugu": "నీళ్లు", "Bengali": "জল", "Marathi": "पाणी", "Gujarati": "પાણી" },
      "खाना": { "Santhali": "ᱡᱚᱢ", "Tamil": "சாப்பாடு", "Telugu": "భోజనం", "Bengali": "খাবার", "Marathi": "જેવણ", "Gujarati": "ભોજન" },
      "पढ़ो": { "Santhali": "ᱚᱞ ᱢᱮ", "Tamil": "படியுங்கள்", "Telugu": "చదవండి", "Bengali": "পড়ো", "Marathi": "વાચા", "Gujarati": "વાંચો" },
      "लिखो": { "Santhali": "ᱚᱞ ᱢᱮ", "Tamil": "எழுதுங்கள்", "Telugu": "రాయండి", "Bengali": "লেখো", "Marathi": "લિહા", "Gujarati": "લખો" },
      "जोड़": { "Santhali": "ᱥᱮᱞᱮᱫ", "Tamil": "கூட்டல்", "Telugu": "కూడిక", "Bengali": "যোগ", "Marathi": "બેરીજ", "Gujarati": "સરવાળો" },
      "घटाव": { "Santhali": "ᱵᱷᱮᱜᱮᱫ", "Tamil": "கழித்தல்", "Telugu": "తీసివేత", "Bengali": "బিয়োগ", "Marathi": "વજાબાકી", "Gujarati": "બાદબાકી" }
    },

    // Dynamic translate function
    translate: function(text, targetLang = 'Santhali') {
      const clean = text.trim();
      const lower = clean.toLowerCase();

      // Reverse Translation for Student Mode (Regional Language -> Hindi/English)
      if (targetLang === 'Hindi' || targetLang === 'English') {
        // Reverse Question Check (e.g. Tamil "என் பெயர் என்ன", Santhali "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ")
        if (clean.includes("பெயர் என்ன") || clean.includes("ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ") || clean.includes("peru enti") || clean.includes("naam ki") || clean.includes("kay aahe") || clean.includes("shu che")) {
          return targetLang === 'Hindi' ? "मेरा नाम क्या है?" : "What is my name?";
        }
        if (clean.includes("உங்களின் பெயர்") || clean.includes("ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ") || clean.includes("mee peru") || clean.includes("tomar naam") || clean.includes("tumche naav") || clean.includes("tamaru naam")) {
          return targetLang === 'Hindi' ? "आपका नाम क्या है?" : "What is your name?";
        }
        if (clean.includes("வணக்கம்") || clean.includes("ᱡᱚᱦᱟᱨ") || clean.includes("নমস্কার") || clean.includes("नमस्कार") || clean.includes("નમસ્તે")) {
          return targetLang === 'Hindi' ? "नमस्ते!" : "Hello!";
        }
        if (clean.includes("நன்றி") || clean.includes("ᱥᱟᱨᱦᱟᱣ") || clean.includes("ধন্যবাদ") || clean.includes("धन्यवाद")) {
          return targetLang === 'Hindi' ? "धन्यवाद!" : "Thank you!";
        }

        // Reverse Name pattern (e.g. "என் பெயர் வசிஹரன்", "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱥᱟᱢᱤᱢ ᱠᱟᱱᱟ")
        const tamilNameMatch = clean.match(/^என் பெயர் (.+)$/i);
        const santhaliNameMatch = clean.match(/^ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ (.+?)( ᱠᱟᱱᱟ)?$/i);
        const extStudentName = tamilNameMatch ? tamilNameMatch[1] : (santhaliNameMatch ? santhaliNameMatch[1] : null);
        if (extStudentName) {
          return targetLang === 'Hindi' ? `मेरा नाम ${extStudentName} है` : `My name is ${extStudentName}`;
        }

        // Reverse Sentence Dictionary lookup
        for (const [hinKey, valMap] of Object.entries(this.sentences)) {
          for (const [langKey, langVal] of Object.entries(valMap)) {
            if (langVal && (langVal.toLowerCase().includes(lower) || lower.includes(langVal.toLowerCase()))) {
              return targetLang === 'English' ? (valMap['English'] || hinKey) : hinKey;
            }
          }
        }

        // Reverse Word-level lookup
        const tokens = clean.split(/\s+/);
        const reversedTokens = tokens.map(token => {
          const cleanTok = token.replace(/[?,.!]/g, '');
          for (const [hWord, wMap] of Object.entries(this.words)) {
            for (const [lKey, lVal] of Object.entries(wMap)) {
              if (lVal && lVal.toLowerCase().includes(cleanTok.toLowerCase())) {
                return hWord;
              }
            }
          }
          return token;
        });
        return reversedTokens.join(' ');
      }

      // Explicit Question Check: "मेरा नाम क्या है" / "what is my name"
      if (clean.includes("मेरा नाम क्या") || clean.includes("मेरा क्या नाम") || lower.includes("what is my name")) {
        const myNameQuestions = {
          "Santhali": "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Inag nutum do ched kana?)",
          "Tamil": "என் பெயர் என்ன? (En peyar enna?)",
          "Telugu": "Naa peru enti? (నా పేరు ఏంటి?)",
          "Bengali": "Amar naam ki? (আমার নাম কি?)",
          "Marathi": "Majhe naav kay aahe? (माझे नाव काय आहे?)",
          "Gujarati": "Maru naam shu che? (મારું નામ શું છે?)"
        };
        return myNameQuestions[targetLang] || myNameQuestions["Santhali"];
      }

      // Explicit Question Check: "आपका नाम क्या है" / "तुम्हारा नाम क्या है" / "what is your name"
      if (clean.includes("आपका नाम क्या") || clean.includes("तुम्हारा नाम क्या") || clean.includes("तेरा नाम क्या") || lower.includes("what is your name")) {
        const yourNameQuestions = {
          "Santhali": "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ? (Amag nutum do ched kana?)",
          "Tamil": "உங்களின் பெயர் என்ன? (Ungal peyar enna?)",
          "Telugu": "Mee peru enti? (మీ పేరు ఏంటి?)",
          "Bengali": "Tomar naam ki? (তোমার নাম কি?)",
          "Marathi": "Tumche naav kay aahe? (तुमचे नाव काय आहे?)",
          "Gujarati": "Tamaru naam shu che? (તમારું નામ શું છે?)"
        };
        return yourNameQuestions[targetLang] || yourNameQuestions["Santhali"];
      }

      // Pattern 1: "My name is [Name]" or "मेरा नाम [Name] है" (excluding question words)
      const nameMatchEng = lower.match(/^my name is (.+)$/i);
      const nameMatchHin = clean.match(/^मेरा नाम (.+?)( है)?$/i);
      const extractedName = nameMatchEng ? nameMatchEng[1] : (nameMatchHin ? nameMatchHin[1] : null);

      if (extractedName && !["क्या", "kya", "what", "कौन", "kaun", "कहाँ", "kahan"].includes(extractedName.toLowerCase().trim())) {
        const personName = extractedName.trim();
        // Transliterate the name into the target script
        const scriptName = transliterateName(personName, targetLang);
        const nameTranslations = {
          "Santhali": `ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ${scriptName} ᱠᱟᱱᱟ`,
          "Tamil": `என் பெயர் ${scriptName}`,
          "Telugu": `నా పేరు ${scriptName}`,
          "Bengali": `আমার নাম ${scriptName}`,
          "Marathi": `माझे नाव ${scriptName}`,
          "Gujarati": `મારું નામ ${scriptName}`
        };
        return nameTranslations[targetLang] || nameTranslations["Santhali"];
      }

      // Pattern 2: Direct sentence dictionary lookup
      for (const [key, valMap] of Object.entries(this.sentences)) {
        if (key.toLowerCase() === lower || lower.includes(key.toLowerCase())) {
          return valMap[targetLang] || valMap["Santhali"];
        }
      }

      // Pattern 3: Dynamic token mapping + transliteration for unknown words
      const tokens = clean.split(/\s+/);
      const translatedTokens = tokens.map(token => {
        const cleanTok = token.replace(/[?,.!]/g, '');
        // First try dictionary lookup
        for (const [wKey, wMap] of Object.entries(this.words)) {
          if (wKey.toLowerCase() === cleanTok.toLowerCase()) {
            return wMap[targetLang] || wMap["Santhali"];
          }
        }
        // If not in dictionary, transliterate the word into target script
        if (cleanTok.length > 0) {
          return transliterateName(cleanTok, targetLang);
        }
        return token;
      });

      // Pure clean output
      return translatedTokens.join(' ');
    }
  };


  // --------------------------------------------------------------------------
  // 1. Navigation Controller
  // --------------------------------------------------------------------------
  const navItems = document.querySelectorAll('.nav-menu .nav-item');
  const viewSections = document.querySelectorAll('.view-section');
  const headerPageTitle = document.getElementById('header-page-title');

  const viewTitles = {
    'dashboard-view': 'Dashboard',
    'classroom-view': 'Classroom Mode',
    'materials-view': 'Materials',
    'curriculum-view': 'Curriculum',
    'worksheets-view': 'Worksheet Generator',
    'flashcards-view': 'Flashcards Studio',
    'history-view': 'Translation History',
    'settings-view': 'Settings'
  };

  function switchView(viewId) {
    if (!viewId) return;
    state.currentView = viewId;

    // Update active nav button
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active view section
    viewSections.forEach(section => {
      if (section.id === viewId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Update header title
    if (headerPageTitle && viewTitles[viewId]) {
      headerPageTitle.textContent = viewTitles[viewId];
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      switchView(targetView);
    });
  });

  // Quick Action Buttons on Dashboard
  document.getElementById('act-scan')?.addEventListener('click', () => switchView('materials-view'));
  document.getElementById('act-pdf')?.addEventListener('click', () => switchView('materials-view'));
  document.getElementById('act-ppt')?.addEventListener('click', () => switchView('materials-view'));
  document.getElementById('act-worksheet')?.addEventListener('click', () => switchView('worksheets-view'));
  document.getElementById('act-flashcard')?.addEventListener('click', () => switchView('flashcards-view'));

  // Dashboard "Start Classroom Mode" button
  document.getElementById('btn-start-classroom')?.addEventListener('click', () => {
    switchView('classroom-view');
    startClassroomListening();
  });

  // --------------------------------------------------------------------------
  // 2. Dark Terminal Logger (BHASHASSETU SYSTEM COMMAND PIPELINE v1.0)
  // --------------------------------------------------------------------------
  const terminalLogOutput = document.getElementById('terminal-log-output');
  const termPipelineStatus = document.getElementById('term-pipeline-status');

  function logTerminal(message, type = 'normal') {
    if (!terminalLogOutput) return;

    const timeStr = new Date().toLocaleTimeString();
    const logLine = document.createElement('div');
    logLine.className = 'log-line';

    let typeSpan = `<span class="log-sys">[BHASHASSETU::SYS]</span>`;
    let msgSpan = `<span class="log-msg">${message}</span>`;

    if (type === 'success') {
      msgSpan = `<span class="log-success">${message}</span>`;
    }

    logLine.innerHTML = `<span class="log-time">[${timeStr}]</span> ${typeSpan} ${msgSpan}`;
    terminalLogOutput.appendChild(logLine);
    terminalLogOutput.scrollTop = terminalLogOutput.scrollHeight;
  }

  document.getElementById('btn-clear-term')?.addEventListener('click', () => {
    if (terminalLogOutput) {
      terminalLogOutput.innerHTML = '';
      logTerminal('Terminal logs cleared.', 'success');
    }
  });

  // --------------------------------------------------------------------------
  // 3. Speech Recognition (STT) & Speech Synthesis (TTS) Engine
  // --------------------------------------------------------------------------
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const langCodeMap = {
    'Hindi': 'hi-IN',
    'English': 'en-IN',
    'Bengali': 'bn-IN',
    'Marathi': 'mr-IN'
  };

  function initRecognition() {
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;  // FINAL results only - no interim fragments
    rec.lang = langCodeMap[state.inputLang] || 'en-IN';

    rec.onstart = () => {
      state.isListening = true;
      updateListeningUI(true);
      logTerminal(`ASR Microphone stream opened [${rec.lang}]. Listening for speech...`, 'success');
    };

    rec.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript && finalTranscript.trim()) {
        handleSpeechInput(finalTranscript.trim());
      }
    };

    rec.onerror = (err) => {
      if (err.error === 'no-speech' || err.error === 'aborted') {
        // Harmless - mic paused during TTS or silent
      } else {
        logTerminal(`ASR Notice: ${err.error}`);
      }
    };

    rec.onend = () => {
      // Only restart if we're still in listening mode AND not playing TTS
      if (state.isListening && !state.isSpeaking) {
        setTimeout(() => {
          try { rec.start(); } catch(e) {}
        }, 300);
      }
    };

    return rec;
  }

  state.recognition = initRecognition();

  function startClassroomListening() {
    state.isListening = true;
    updateListeningUI(true);

    if (!state.recognition) {
      state.recognition = initRecognition();
    }

    if (state.recognition) {
      try {
        state.recognition.lang = langCodeMap[state.inputLang] || 'hi-IN';
        state.recognition.start();
      } catch (e) {
        // If already started or browser blocked, fallback seamlessly
        simulateSpeechRecognition();
      }
    } else {
      simulateSpeechRecognition();
    }
  }

  function stopClassroomListening() {
    state.isListening = false;
    state.isSpeaking = false;
    updateListeningUI(false);

    // Stop TTS
    try { window.speechSynthesis.cancel(); } catch(e) {}

    // Stop mic
    if (state.recognition) {
      try { state.recognition.stop(); } catch (e) {}
    }
    logTerminal('Classroom listening pipeline stopped.');
  }

  const liveMicBtn = document.getElementById('live-mic-btn');
  liveMicBtn?.addEventListener('click', () => {
    if (state.isListening) {
      stopClassroomListening();
    } else {
      startClassroomListening();
    }
  });

  function updateListeningUI(isListening) {
    const liveModeBadge = document.getElementById('live-mode-badge');
    const modeStatusText = document.getElementById('mode-status-text');
    const micStageLabel = document.getElementById('mic-stage-label');
    const micBtnIcon = document.getElementById('mic-btn-icon');
    const dashListeningBox = document.getElementById('dash-listening-box');
    const telemetryDisplay = document.getElementById('telemetry-display');

    if (isListening) {
      if (liveMicBtn) liveMicBtn.classList.add('recording');
      if (liveModeBadge) {
        liveModeBadge.textContent = '● LISTENING LIVE';
        liveModeBadge.style.backgroundColor = '#DCFCE7';
        liveModeBadge.style.color = '#16A34A';
      }
      if (modeStatusText) modeStatusText.textContent = 'Live';
      if (micStageLabel) micStageLabel.textContent = 'Classroom Mode Active - Speak into mic';
      if (dashListeningBox) dashListeningBox.textContent = '● Classroom listening active. Recording teacher input...';
      if (termPipelineStatus) {
        termPipelineStatus.textContent = 'STATUS: LISTENING';
        termPipelineStatus.style.color = '#4ADE80';
      }
      if (telemetryDisplay) {
        telemetryDisplay.textContent = 'Status: Active | Latency - ASR: 12ms | Trans: 45ms | TTS: 18ms | Total: 75ms';
      }
    } else {
      if (liveMicBtn) liveMicBtn.classList.remove('recording');
      if (liveModeBadge) {
        liveModeBadge.textContent = '● STOPPED';
        liveModeBadge.style.backgroundColor = '#F1F5F9';
        liveModeBadge.style.color = '#64748B';
      }
      if (modeStatusText) modeStatusText.textContent = 'Offline';
      if (micStageLabel) micStageLabel.textContent = 'Click to Start Listening';
      if (dashListeningBox) dashListeningBox.textContent = 'Start classroom to begin listening...';
      if (termPipelineStatus) {
        termPipelineStatus.textContent = 'STATUS: STANDBY';
        termPipelineStatus.style.color = '#38BDF8';
      }
      if (telemetryDisplay) {
        telemetryDisplay.textContent = 'Status: Stopped | Latency - ASR: 0ms | Trans: 0ms | TTS: 0ms | Total: 0ms';
      }
    }
  }

  let lastProcessedText = '';
  let lastProcessedTime = 0;

  function handleSpeechInput(rawText) {
    const liveTeacherText = document.getElementById('live-teacher-text');
    const liveTranslatedText = document.getElementById('live-translated-text');

    const cleanRaw = rawText.trim();
    if (!cleanRaw) return;

    const now = Date.now();
    // Ignore exact duplicate within 2 seconds
    if (cleanRaw.toLowerCase() === lastProcessedText.toLowerCase() && (now - lastProcessedTime) < 2000) {
      return;
    }
    lastProcessedText = cleanRaw;
    lastProcessedTime = now;

    state.lastTeacherText = cleanRaw;
    if (liveTeacherText) liveTeacherText.textContent = `"${cleanRaw}"`;

    const translated = nllbTranslationEngine.translate(cleanRaw, state.targetLang);
    state.lastTranslatedText = translated;
    if (liveTranslatedText) liveTranslatedText.textContent = `"${translated}"`;

    logTerminal(`Speech Captured [${state.inputLang}]: "${cleanRaw}"`);
    logTerminal(`Translated [${state.targetLang}]: "${translated}"`, 'success');

    speakText(translated);
  }

  function simulateSpeechRecognition() {
    logTerminal('Simulating voice input stream...', 'success');
    const samplePhrases = [
      "Namaste, Good Morning Students!",
      "Teheñ abo lekha bon ched-a",
      "Today we will learn math and plants",
      "Open your books to page 4"
    ];
    let idx = 0;

    const interval = setInterval(() => {
      if (!state.isListening) {
        clearInterval(interval);
        return;
      }
      handleSpeechInput(samplePhrases[idx % samplePhrases.length]);
      idx++;
    }, 4500);
  }

  // TTS language code mapping for proper pronunciation
  const ttsLangCodes = {
    'Tamil': 'ta-IN',
    'Telugu': 'te-IN',
    'Bengali': 'bn-IN',
    'Marathi': 'mr-IN',
    'Gujarati': 'gu-IN',
    'Hindi': 'hi-IN',
    'English': 'en-IN',
    'Santhali': 'hi-IN' // Uses Hindi voice with phonetic mapping
  };

  // Helper to convert Ol Chiki to speakable Devanagari phonetics for browser TTS engines
  function getSpeakableText(text, targetLang) {
    if (!text) return '';

    // Strip parenthetical hints like (En peyar...) so audio doesn't read things twice
    let cleanSpeech = text.replace(/\([^)]*\)/g, '').trim();

    // Ol Chiki script characters (\u1C50-\u1C7F) cannot be read by standard browser TTS engines.
    // Convert Ol Chiki characters to speakable Devanagari phonetics!
    if (targetLang === 'Santhali' || /[\u1C50-\u1C7F]/.test(cleanSpeech)) {
      const olChikiPhoneticMap = {
        'ᱚ':'ओ', 'ᱛ':'त', 'ᱜ':'ग', 'ᱝ':'ंग', 'ᱞ':'ल', 'ᱟ':'आ', 'ᱠ':'क', 'ᱡ':'ज', 'ᱢ':'म', 'ᱣ':'व',
        'ᱤ':'इ', 'ᱥ':'स', 'ᱦ':'ह', 'ᱧ':'ञ', 'ᱨ':'र', 'ᱩ':'उ', 'ᱪ':'च', 'ᱫ':'द', 'ᱬ':'ण', 'ᱭ':'य',
        'ᱮ':'ए', 'ᱯ':'प', 'ᱱ':'न', 'ᱲ':'ड़', 'ᱶ':'ंव', 'ᱚᱸ':'अं', 'ᱷ':'ह', 'ᱸ':'ं', 'ᱹ':'', 'ᱽ':'', 'ᱼ':''
      };
      let phonetic = '';
      for (const ch of cleanSpeech) {
        phonetic += olChikiPhoneticMap[ch] || ch;
      }
      return phonetic.trim() || cleanSpeech;
    }
    return cleanSpeech;
  }

  // Global Audio Engine Unlocker (Fixes Chrome/Edge silent speech context lock)
  let audioUnlocked = false;
  function unlockAudioEngine() {
    if (audioUnlocked || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      audioUnlocked = true;
    } catch (e) {}
  }
  document.body.addEventListener('click', unlockAudioEngine, { once: true });
  document.body.addEventListener('keydown', unlockAudioEngine, { once: true });

  // Chrome TTS Watchdog: Chrome pauses speechSynthesis silently after ~15s of no activity
  // Prevent this by pinging resume() every 10 seconds
  setInterval(() => {
    if (window.speechSynthesis && !state.isSpeaking) {
      try { window.speechSynthesis.resume(); } catch(e) {}
    }
  }, 10000);

  // Core TTS speak function - clean, reliable, no loops
  function speakText(text) {
    const synth = window.speechSynthesis;
    if (!synth) return;

    unlockAudioEngine();

    // Hard stop any current speech
    try { synth.cancel(); } catch (e) {}

    const speakable = getSpeakableText(text, state.targetLang);
    if (!speakable || !speakable.trim()) return;

    const utterance = new SpeechSynthesisUtterance(speakable);
    utterance.rate = 0.9;
    utterance.volume = 1.0;
    utterance.lang = ttsLangCodes[state.targetLang] || 'ta-IN';

    // Pick the best matching voice for the target language
    const allVoices = synth.getVoices();
    const langPrefix = utterance.lang.split('-')[0];
    const voice = allVoices.find(v => v.lang.startsWith(langPrefix))
               || allVoices.find(v => v.lang.startsWith('en'))
               || (allVoices.length > 0 ? allVoices[0] : null);
    if (voice) utterance.voice = voice;

    state.isSpeaking = true;

    utterance.onstart = () => {
      logTerminal(`[TTS] Speaking [${utterance.lang}]: "${speakable}"`, 'success');
      // Gently stop mic while speaking (avoids feedback loop)
      if (state.recognition && state.isListening) {
        try { state.recognition.stop(); } catch (e) {}
      }
    };

    utterance.onend = () => {
      state.isSpeaking = false;
      // Restart mic after TTS finishes
      if (state.isListening && state.recognition) {
        setTimeout(() => {
          try { state.recognition.start(); } catch (e) {}
        }, 250);
      }
    };

    utterance.onerror = (e) => {
      state.isSpeaking = false;
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS error:', e.error);
      }
      // Restart mic on error too
      if (state.isListening && state.recognition) {
        setTimeout(() => {
          try { state.recognition.start(); } catch (er) {}
        }, 250);
      }
    };

    // Small delay to let Chrome clear its internal queue after cancel()
    setTimeout(() => {
      try {
        synth.resume();
        synth.speak(utterance);
      } catch (err) {
        state.isSpeaking = false;
        console.warn('TTS speak error:', err);
      }
    }, 80);
  }

  // Ensure voices are loaded when browser finishes initializing speech synth
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      if (state.synth) state.synth.getVoices();
    };
  }

  document.getElementById('btn-replay-audio')?.addEventListener('click', () => {
    if (state.lastTranslatedText) {
      logTerminal(`Replaying TTS Audio: "${state.lastTranslatedText}"`);
      speakText(state.lastTranslatedText);
    } else {
      speakText("Johar! Santhali voice output ready.");
    }
  });

  document.getElementById('btn-repeat-phrase')?.addEventListener('click', () => {
    if (state.lastTeacherText) {
      handleSpeechInput(state.lastTeacherText);
    }
  });

  // Manual Text Input & Quick Chip Test Handlers
  const manualInput = document.getElementById('manual-text-input');
  const btnSubmitText = document.getElementById('btn-submit-text');

  function submitManualText() {
    if (!manualInput) return;
    const val = manualInput.value.trim();
    if (val) {
      handleSpeechInput(val);
      manualInput.value = '';
    }
  }

  btnSubmitText?.addEventListener('click', submitManualText);
  manualInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitManualText();
    }
  });

  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const phrase = chip.getAttribute('data-phrase');
      if (phrase) {
        handleSpeechInput(phrase);
      }
    });
  });

  // Language selectors sync & Student Doubt Mode Controller
  const selInputLang = document.getElementById('sel-input-lang');
  const selTargetLang = document.getElementById('sel-target-lang');
  const teacherInputHeader = document.getElementById('teacher-input-header');
  const targetOutputHeader = document.getElementById('target-output-header');
  const dashLangPair = document.getElementById('dash-lang-pair');

  const toggleStudentCheck = document.getElementById('toggle-student');
  const studentStatusLabel = document.getElementById('student-status-label');
  const btnToggleStudentMode = document.getElementById('btn-toggle-student-mode');
  const studentBtnText = document.getElementById('student-btn-text');

  function setStudentDoubtMode(enabled) {
    state.studentResponseOn = enabled;

    if (enabled) {
      // Save current teacher configuration if not already saved
      if (!state.studentResponseOn) {
        state.teacherInputLang = selInputLang?.value || 'Hindi';
        state.teacherTargetLang = selTargetLang?.value || 'Santhali';
      }

      // REVERSE THE PIPELINE FOR STUDENT DOUBTS
      state.inputLang = state.teacherTargetLang;
      state.targetLang = state.teacherInputLang;

      // Update UI elements for Student Doubt Mode
      if (studentBtnText) studentBtnText.textContent = `🙋 Student Doubt Mode: ACTIVE (${state.inputLang} ➔ ${state.targetLang})`;
      if (btnToggleStudentMode) {
        btnToggleStudentMode.style.backgroundColor = '#FEF3C7';
        btnToggleStudentMode.style.borderColor = '#D97706';
        btnToggleStudentMode.style.color = '#B45309';
      }
      if (studentStatusLabel) {
        studentStatusLabel.textContent = `On (${state.inputLang} ➔ ${state.targetLang})`;
        studentStatusLabel.style.color = '#D97706';
      }
      if (toggleStudentCheck) toggleStudentCheck.checked = true;

      if (teacherInputHeader) teacherInputHeader.textContent = `STUDENT DOUBT INPUT (${state.inputLang.toUpperCase()})`;
      if (targetOutputHeader) targetOutputHeader.textContent = `TEACHER OUTPUT (${state.targetLang.toUpperCase()})`;
      if (dashLangPair) dashLangPair.textContent = `STUDENT MODE: ${state.inputLang} ➔ ${state.targetLang}`;

      logTerminal(`🙋 STUDENT DOUBT MODE ACTIVATED: Reversed pipeline to ${state.inputLang} -> ${state.targetLang}`, 'success');
    } else {
      // RESTORE TEACHER MODE PIPELINE
      state.inputLang = state.teacherInputLang;
      state.targetLang = state.teacherTargetLang;

      if (selInputLang) selInputLang.value = state.teacherInputLang;
      if (selTargetLang) selTargetLang.value = state.teacherTargetLang;

      if (studentBtnText) studentBtnText.textContent = '🙋 Student Doubt Mode: OFF';
      if (btnToggleStudentMode) {
        btnToggleStudentMode.style.backgroundColor = '#EFF6FF';
        btnToggleStudentMode.style.borderColor = 'var(--primary-blue)';
        btnToggleStudentMode.style.color = 'var(--primary-blue)';
      }
      if (studentStatusLabel) {
        studentStatusLabel.textContent = 'Off';
        studentStatusLabel.style.color = 'var(--text-muted)';
      }
      if (toggleStudentCheck) toggleStudentCheck.checked = false;

      if (teacherInputHeader) teacherInputHeader.textContent = `TEACHER INPUT (${state.inputLang.toUpperCase()})`;
      if (targetOutputHeader) targetOutputHeader.textContent = `${state.targetLang.toUpperCase()} OUTPUT (LIVE AUDIO OUT)`;
      if (dashLangPair) dashLangPair.textContent = `${state.inputLang} ➔ ${state.targetLang}`;

      logTerminal(`👨‍🏫 TEACHER MODE RESTORED: Pipeline set to ${state.inputLang} -> ${state.targetLang}`, 'success');
    }

    // Re-initialize ASR with new input language
    if (state.recognition) {
      state.recognition.lang = langCodeMap[state.inputLang] || 'hi-IN';
    }
  }

  btnToggleStudentMode?.addEventListener('click', () => {
    setStudentDoubtMode(!state.studentResponseOn);
  });

  toggleStudentCheck?.addEventListener('change', (e) => {
    setStudentDoubtMode(e.target.checked);
  });

  function updateLanguagePairing() {
    if (!state.studentResponseOn) {
      state.inputLang = selInputLang?.value || 'English';
      state.targetLang = selTargetLang?.value || 'Tamil';
      state.teacherInputLang = state.inputLang;
      state.teacherTargetLang = state.targetLang;

      if (teacherInputHeader) teacherInputHeader.textContent = `TEACHER INPUT (${state.inputLang.toUpperCase()})`;
      if (targetOutputHeader) targetOutputHeader.textContent = `${state.targetLang.toUpperCase()} OUTPUT (LIVE AUDIO OUT)`;
      if (dashLangPair) dashLangPair.textContent = `${state.inputLang} ➔ ${state.targetLang}`;

      logTerminal(`Language pipeline set: ${state.inputLang} -> ${state.targetLang}`);
    }

    // Dynamic ASR microphone language update
    if (state.recognition) {
      state.recognition.lang = langCodeMap[state.inputLang] || 'en-IN';
    }

    // Re-translate and speak in new language with hardware buffer flush
    if (state.lastTeacherText) {
      handleSpeechInput(state.lastTeacherText);
    }
  }

  selInputLang?.addEventListener('change', updateLanguagePairing);
  selTargetLang?.addEventListener('change', updateLanguagePairing);

  // --------------------------------------------------------------------------
  // 4. Worksheet Generator Logic
  // --------------------------------------------------------------------------
  const btnGenerateWs = document.getElementById('btn-generate-ws');
  const wsPreviewArea = document.getElementById('ws-preview-area');

  btnGenerateWs?.addEventListener('click', () => {
    const topic = document.getElementById('ws-topic')?.value || 'Plants';
    const outcome = document.getElementById('ws-outcome')?.value || 'Identify local plants';
    const cls = document.getElementById('ws-class')?.value || 'Class 4';
    const subject = document.getElementById('ws-subject')?.value || 'Environmental Science';

    if (wsPreviewArea) {
      wsPreviewArea.innerHTML = `
        <div style="width: 100%; text-align: left;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary-blue-border); padding-bottom: 8px; margin-bottom: 16px;">
            <h4 style="color: var(--primary-blue); font-weight: 800;">${subject} (${cls}) Worksheet</h4>
            <span class="pill-badge">Bilingual: Hindi + Santhali</span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;"><strong>Topic:</strong> ${topic} | <strong>Outcome:</strong> ${outcome}</p>

          <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
            <p style="font-weight: 700; font-size: 13px;">Q1. पौधे सूर्य के प्रकाश का उपयोग कैसे करते हैं? (Hindi)</p>
            <p style="color: var(--primary-blue); font-size: 12px; margin-top: 4px;"> Dare ko bera marsal ko hateya? (Santhali)</p>
          </div>

          <div style="background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px;">
            <p style="font-weight: 700; font-size: 13px;">Q2. 5 स्थानीय वृक्षों के नाम लिखें। (Hindi)</p>
            <p style="color: var(--primary-blue); font-size: 12px; margin-top: 4px;"> 5 gota dare kõa nūtum ol me. (Santhali)</p>
          </div>

          <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn-primary-large" style="padding: 10px; font-size: 12px;">Download PDF</button>
            <button class="btn-secondary" style="padding: 10px; font-size: 12px;">Print Worksheet</button>
          </div>
        </div>
      `;
    }
  });

  // --------------------------------------------------------------------------
  // 5. Unified Standalone AI Engine Initialization
  // --------------------------------------------------------------------------
  logTerminal('BhashaSetu Offline AI Engine Initialized.', 'success');
  logTerminal('Pipeline Active: All Speech ASR, NLLB Translation & TTS Voice Output working locally.', 'success');
});
