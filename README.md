# Real-Time Poll Rooms

A full-stack real-time polling web application built with **Next.js (App Router)**, **TypeScript**, **MongoDB**, and **WebSockets**.  
Users can create polls, share them via a link, and collect votes with results updating live across multiple viewers.

---

## 🚀 Overview

This project was built to demonstrate:
- Full-stack development using modern web technologies
- Real-time system design
- Data persistence and fairness controls
- Clean UI/UX with proper user feedback
- Practical handling of serverless limitations

The app allows anyone to create a poll, share it, and collect votes without requiring user authentication.

---

## ✨ Features

### 1. Poll Creation
- Create a poll with:
  - A question
  - At least **two options** (enforced in UI and backend)
- Dynamically:
  - Add options
  - Remove options (minimum of two always maintained)
- Generates a **unique shareable link** for each poll

---

### 2. Join Poll by Link
- Anyone with the link can:
  - View the poll
  - Vote on **one option only**
- No login required, making sharing frictionless

---

### 3. Real-Time Results
- Vote counts update automatically for all viewers
- Achieved using a **hybrid real-time strategy**:
  - Optimistic UI updates
  - WebSockets (Socket.IO)
  - Polling fallback for reliability

Users do **not** need to manually refresh the page.

---

### 4. Fairness & Anti-Abuse Mechanisms

To reduce repeat or abusive voting, the app uses **two main mechanisms**:

#### a) IP + User-Agent Hashing (Backend)
- For each vote, the server creates a hash using:
  - IP address
  - User-Agent
  - Poll ID
- If the same hash attempts to vote again, the request is rejected

**Prevents:**
- Multiple votes from the same device/browser
- Refresh-based abuse

**Limitation:**
- Can be bypassed using VPNs or different devices

---

#### b) Client-Side Vote Persistence (Frontend)
- After voting, the browser stores: voted_poll_<pollId> = true in `localStorage`
- Ensures:
- Clear UI message: “You have already voted”
- Voting buttons are disabled
- State persists across page refreshes

**Prevents:**
- Accidental repeat voting
- Confusing user experience

---

### 5. Persistence
- Polls and votes are stored in **MongoDB**
- Poll links remain valid even after:
- Page refresh
- Browser restart
- Vote counts are always derived from the database

---

### 6. UI & UX
The UI is designed to be clean, calm, and professional.

Key UX features:
- Neutral SaaS-style color palette
- Clear voting status indicator:
- “You have not voted yet”
- “You have already voted”
- Optimistic updates for instant feedback
- Disabled states to prevent double actions
- Visual vote distribution using progress bars
- Toast notifications for:
- Success
- Errors
- Copy link actions

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Socket.IO Client
- React Hot Toast

### Backend
- Next.js API Routes
- Socket.IO
- MongoDB Atlas
- Mongoose

---

## 🔄 Real-Time Update Strategy (Design Decision)

Since serverless platforms (like Vercel) do not guarantee persistent WebSocket connections, the app uses a **hybrid approach**:

1. **Optimistic UI Updates**
   - The voting user sees results instantly

2. **WebSockets**
   - Broadcast updates to other connected clients

3. **Polling Fallback**
   - Clients refetch poll data at regular intervals
   - Guarantees consistency if sockets fail

This ensures stability without sacrificing responsiveness.

---

## ⚠️ Edge Cases Handled
- Invalid poll link (poll not found)
- Less than two options
- Empty input fields
- Double vote attempts
- Page refresh after voting
- Multiple users voting simultaneously

---

## 🚧 Known Limitations & Future Improvements
- No user authentication (intentionally kept simple)
- IP-based fairness can be bypassed using VPNs
- No poll expiration
- No creator/admin dashboard

Potential improvements:
- Poll expiration & admin controls
- Authentication
- Managed real-time services (Pusher, Ably, Supabase Realtime)
- Analytics dashboard

---

## 🌍 Deployment
- Application deployed on **Vercel**
- Database hosted on **MongoDB Atlas**
- Environment variables managed securely

---

## 🧠 Conclusion
This project demonstrates:
- End-to-end full-stack development
- Real-time system design with trade-off awareness
- Clean and defensive coding practices
- Practical UX decisions
- Scalable architecture for future improvements