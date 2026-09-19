# Palash-AI (BhashaSetu Offline AI Classroom Assistant)

Palash-AI (BhashaSetu) is an offline multilingual AI classroom assistant engineered to bridge language barriers in education through real-time speech recognition, machine translation, and speech synthesis.

---

## 🌟 Key Features & AI Tools

### 1. 🎙️ ASR Tool (Automatic Speech Recognition)
* Live browser-based continuous voice capture using the Web Speech API.
* Multi-language speech support (`hi-IN` Hindi, `en-IN` English, `bn-IN` Bengali, `mr-IN` Marathi).
* Offline simulation fallback for environments without active microphone hardware.

### 2. 🌐 Lang-to-Lang Translation Tool
* Multi-language offline translation pipeline supporting **Hindi, English, Santhali (Ol Chiki script), Tamil, Telugu, Bengali, Marathi, and Gujarati**.
* Dual bidirectional support:
  * **Teacher Mode**: Translates instructional input into students' native regional languages.
  * **🙋 Student Doubt Mode**: Reverses the pipeline so student inquiries in regional languages are translated back into Hindi/English for the teacher.

### 3. 🔊 MMS / TTS Tool (Speech Synthesis)
* Multi-language voice output with Ol Chiki phonetic transliteration for Santhali pronunciation.
* Auto-voice selection for regional Indian accents.
* Background audio watchdog to prevent browser speech pauses.

---

## 🚀 How to Run

1. Open [`index.html`](./index.html) in any modern browser (Google Chrome or Microsoft Edge recommended).
2. Navigate to **Classroom Mode**.
3. Use the microphone or manual text input to translate live phrases.

---

## 📁 Project Structure

```
palash-AI/
├── index.html        # Main Classroom & Dashboard UI
├── app.js            # Core AI Pipeline (ASR, Translation Engine, TTS)
├── styles.css        # UI Design System & Styling
└── README.md         # Documentation
```
