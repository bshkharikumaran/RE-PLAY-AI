# RE:PLAY AI — Sports Injury Recovery & Comeback Assistant

> **Recover Smart. Train Safe. Come Back Stronger.**  
> Doctor and Physiotherapist-guided AI sports recovery platform connecting clinical rehabilitation plans with daily monitoring, objective recovery scoring, and adaptive safety alerts.

---

## 🏃 Overview

**RE:PLAY AI** is a sports injury rehabilitation and return-to-play platform designed for athletes, physiotherapists, and coaches. It bridges the gap between clinical guidance and daily home training by translating clinical protocols into guided daily routines, tracking recovery trends, and monitoring safety red flags in real-time.

---

## 🌟 Key Features

- **Clinical Protocol Ingestion**: Parse physician/physiotherapist discharge instructions and structured recovery plans.
- **Daily Multi-Metric Check-ins**: Log pain (VAS), swelling, joint mobility, fatigue, sleep quality, and hydration.
- **Transparent Recovery Scoring**: Dynamic daily score calculating adherence, sleep quality, pain trends, mobility, and consistency.
- **Deterministic Clinical Safety Engine**: Evaluates red flags, sudden pain spikes, joint effusion, and contraindications before exercise clearance.
- **AI Recovery Coach (Powered by Gemini)**: Context-aware sports medicine recovery assistant for exercise guidance, form cues, and pacing advice.
- **Return-to-Play Milestones**: Structured 5-phase comeback progression with clinical sign-offs.
- **Multi-Role Portal**: Seamless switching between Athlete, Physiotherapist, and Coach perspectives.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend / API**: Node.js, Express, tsx
- **Build Tool**: Vite
- **AI Integration**: Google Gen AI SDK (`@google/genai`)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/bshkharikumaran/RE-PLAY-AI.git
cd RE-PLAY-AI
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your Gemini API key in `.env` (optional — the app includes deterministic clinical fallbacks if no key is provided):

```env
GEMINI_API_KEY="your_api_key_here"
PORT=3000
```

### 4. Run the Application

Start the full-stack development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📜 Available Scripts

- `npm run dev` - Start the full-stack development server (Express + Vite)
- `npm run build` - Build the client application for production
- `npm run start` - Run the production server
- `npm run lint` - Run TypeScript type checking
- `npm run preview` - Preview production build locally

---

## 🔒 Safety & Medical Disclaimer

RE:PLAY AI is an athletic recovery companion and training tool. It is designed to operate under the prescription and oversight of licensed medical professionals (physicians, orthopedic surgeons, physiotherapists). It does not provide emergency medical diagnosis. In case of acute emergencies, athletes must seek immediate clinical care.
