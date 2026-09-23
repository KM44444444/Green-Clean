# Green & Clean 🌱♻️

A smart waste management web application built for **Smart India Hackathon 2026**.

## About the Project

Green & Clean is a civic technology solution that digitally supports India's waste management efforts. It allows citizens to report garbage spots by uploading geo-tagged photos, automatically notifies municipal workers for quick cleanup, and rewards users with points (Green Wallet) that can be redeemed for eco-friendly perks like discounts and plants.

## Key Features

- 📸 **Report Waste Spots** - Upload geo-tagged photos of garbage locations
- 🔔 **Automatic Notifications** - Municipal workers get instant alerts for cleanup
- 💰 **Green Wallet** - Earn points by reporting waste and redeem for eco-friendly rewards
- 👥 **Multi-Role Support** - Citizen, Worker, and Admin roles with different dashboards
- 📊 **Statistics & Analytics** - Track cleanup progress and environmental impact
- 🎮 **Gamification** - Motivate citizens through rewards and recognition

## Related Categories

- 🏙️ **Civic Technology** — solving real urban problems using software
- ♻️ **Waste Management** — making garbage collection faster and smarter
- 🇮🇳 **Swachh Bharat Mission** — digitally supporting India's cleanliness initiative
- 🎮 **Gamification** — motivating citizens through rewards and recognition

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Query** - Server state management
- **React Hook Form** - Efficient form handling

### Backend
- **Node.js** with Express.js
- **Google Cloud Vision API** - Image analysis for waste detection
- **Multer** - File upload handling
- **CORS** - Cross-origin requests

## Language Breakdown

| Language | Percentage | Files |
|----------|-----------|-------|
| TypeScript/TSX | 90.0% | 72 |
| JavaScript | 3.75% | 3 |
| CSS | 2.5% | 2 |
| JSON | 2.3% | 2 |
| HTML | 1.15% | 1 |
| Markdown | 0.6% | 1 |

**Total Files:** 87

## Project Structure

```
Green-Clean/
├── src/                          # Frontend source
│   ├── components/              # Reusable React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/                  # Main application pages
│   │   ├── Dashboard.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── ReportWaste.tsx
│   │   ├── DonateItems.tsx
│   │   ├── Wallet.tsx
│   │   ├── WorkerPage.tsx
│   │   ├── AuthPage.tsx
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── App.tsx                 # Main App component
│   └── main.tsx                # Entry point
├── backend/                     # Backend source
│   ├── server.js              # Express server
│   └── package.json           # Backend dependencies
├── public/                      # Static files
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Pages & Features

### User Pages
- **Dashboard** - Overview of reported waste spots and cleanup progress
- **Report Waste** - Upload geo-tagged photos of garbage locations
- **Donate Items** - Donate items for reuse and recycling
- **Wallet** - Track Green Wallet points and redeem rewards

### Worker Pages
- **Worker Panel** - View assigned cleanup tasks and update status

### Admin Pages
- **Admin Panel** - Manage users, monitor activities, and generate reports

### Public Pages
- **About** - Project information and mission
- **Auth** - Login and registration

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Green-Clean.git
cd Green-Clean

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Set up environment variables
# Create .env file with necessary API keys and configurations
```

### Running the Application

```bash
# Development mode (Frontend + Backend)
npm run dev

# Backend server (separate terminal)
cd backend
node server.js

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

The application follows a **client-server architecture**:

- **Frontend**: React SPA served by Vite, communicates with backend via REST APIs
- **Backend**: Express.js server handling API requests, file uploads, and integrations
- **Database**: (To be configured based on backend requirements)
- **Cloud Services**: Google Cloud Vision API for image analysis

## Contributing

We welcome contributions! Please feel free to submit pull requests or open issues.

## License

ISC License

## Contact

For more information about Green & Clean, please visit our repository or contact the team.

---

**Built with ❤️ for a cleaner India** 🇮🇳♻️
