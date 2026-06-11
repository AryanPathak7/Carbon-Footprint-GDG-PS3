# AwareSphere - Gamified AI Awareness Platform

AwareSphere is a responsive, modern web application that promotes social responsibility, cyber safety, digital wellbeing, and environmental awareness. It features specialized user profiles, real-world impact tracking, PWA configurations, and gamified reward centers.

## Project Structure

```
H2S_PS3/
├── README.md
├── package.json
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── campaignController.js
│   │   ├── challengeController.js
│   │   ├── actionEngineController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Campaign.js
│   │   ├── Challenge.js
│   │   └── ActionLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── campaigns.js
│   │   ├── challenges.js
│   │   ├── actions.js
│   │   └── ai.js
│   ├── server.js
│   └── .env.example
└── client/
    ├── public/
    │   └── manifest.json
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── LandingPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ChatBot.jsx
    │   │   ├── Feed.jsx
    │   │   ├── Reels.jsx
    │   │   ├── Detox.jsx
    │   │   ├── FamilyDashboard.jsx
    │   │   ├── ChildZone.jsx
    │   │   ├── SeniorMode.jsx
    │   │   ├── Challenges.jsx
    │   │   ├── CampaignMap.jsx
    │   │   ├── ImpactTracker.jsx
    │   │   ├── WebAR.jsx
    │   │   ├── Leaderboards.jsx
    │   │   ├── QuizEngine.jsx
    │   │   ├── NGOManagement.jsx
    │   │   └── AdminPanel.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── utils/
    │   │   ├── mockDb.js
    │   │   └── certificateGenerator.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## Quick Start Instructions

Ensure Node.js and MongoDB are installed on your system.

### 1. Launch the Backend Server
```bash
cd server
npm install
npm start
```
*Note: Make sure to copy `.env.example` to `.env` and configure your credentials.*

### 2. Launch the Frontend Dev Server
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Hackathon Features Walkthrough

1. **Demo Switcher**: Click the dropdown at the top right of the application header to instantly swap between:
   - **Citizen (Aravind)**: View primary Recharts widgets, Detox tracking, and feed items.
   - **Child (Leo)**: Instantly renders a cartoon card board with simple stories and a waste-sorting star reward game.
   - **Senior (Savitri)**: Activates enlarged font buttons, high-contrast layouts, text-to-speech audio logs, and emergency listings.
   - **NGO (Green Earth)**: Access the campaign creation form and active rosters.
   - **Admin (Moderator)**: Inspect proof images and trigger point approvals or review automated fraud/GPS audit logs.
2. **Awareness Assistant**: Type questions or select mic recordings. Click the Speaker icon to hear responses spoken aloud using the browser TTS engine.
3. **WebAR Simulator**: Scan plastic waste, cigarettes, or screen monitors to trigger annotated details.
4. **Certificate Engine**: Complete any timed MCQ quiz with a 100% score to download a custom credential certificate drawn directly on canvas.
