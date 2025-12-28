# 🛡️ Praje Power - Command Centre (Authority Dashboard)

The **Praje Power Command Centre** is a centralized administrative dashboard designed for municipal authorities to monitor, verify, and resolve civic issues in real-time. It serves as the operational backbone for the Praje Power civic reporting platform.

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Stack](https://img.shields.io/badge/Stack-React%20|%20TypeScript%20|%20Supabase-blue)

## 🚀 Key Features

### 1. Issue Management (Live Feed)
* **Real-time Updates:** leverages WebSockets (via Supabase Realtime) to push new reports to the dashboard instantly without page refreshes.
* **Smart Filtering:** Sort issues by Status (`New`, `In Progress`, `Resolved`), Urgency, or Date.
* **Moderation:** Admin tools to reject false or duplicate reports with a mandatory rejection reason for transparency.

### 2. Resolution & Verification Workflow
* **Status Lifecycle:** Strict workflow enforcement: `New` → `In Progress` → `Resolved`.
* **Proof of Work:** Authorities cannot mark an issue as "Resolved" without uploading an **"After" image**.
* **Transparency:** The resolution evidence is automatically linked to the original user report.

### 3. Geolocation & Interactive Mapping
* **Cluster Mapping:** Visualization of all ongoing issues on an interactive map.
* **Quick Preview:** Click on map markers to view issue details in a modal/sidebar.
* **Live Refresh:** Map markers update dynamically as status changes occur.

### 4. Reporting & Analytics
* **Metric Dashboard:** Visual breakdown of Pending vs. Resolved cases using Pie Charts and Bar Graphs.
* **Heatmaps:** Identification of high-density problem areas to aid in resource allocation and city planning.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TypeScript
* **Styling:** Tailwind CSS
* **Backend/Database:** Supabase (PostgreSQL)
* **Maps:** Mapbox GL JS / Google Maps API
* **Charts:** Recharts / Chart.js
* **State Management:** React Query / Zustand

---

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/ASHLESH2003/PrajePowerDashboard.git](https://github.com/ASHLESH2003/PrajePowerDashboard.git)
    cd PrajePowerDashboard
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_MAP_API_KEY=your_map_provider_key
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

---

## 📸 Screen Previews (Coming Soon)

| Dashboard View | Map View |
| :---: | :---: |
| *(Placeholder)* | *(Placeholder)* |

---

## 🤝 Contribution

This project is currently maintained by **Ashlesh S**.
