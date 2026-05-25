# MediQueue

A comprehensive tutor booking and educational queue management platform built for modern students and educators.

Live URL: [https://medi-queue-smoky.vercel.app/](https://medi-queue-smoky.vercel.app/)

## Features

- **Interactive Tutor Directory**: Browse through a curated collection of verified tutors with clear details on institutions, subjects, teaching modes, rates, and locations.
- **Dynamic Search and Filtering**: Search for tutors by name or subject and apply advanced filters such as session start and end dates.
- **Robust Tutor Registration**: Qualified educators can easily apply to add their profiles, inputting details such as subjects, institutions, rates, and available time slots.
- **Real-Time Booking Management**: Authenticated students can seamlessly book sessions through an interactive dialog with automatic slot limit validation.
- **Personalized Dashboards**: Dedicated pages for tracking booked tutors and scheduled sessions, enabling smooth personal scheduling and learning management.
- **Secure Authentication Framework**: Implements protected routing with client-side authentication context, preventing unauthorized access to restricted features.

## Tech Stack

### Core Framework and Library
- **Next.js 16**: Utilizing React Server Components and optimized App Router architecture.


### Styling and User Interface
- **Tailwind CSS 4**: A utility-first CSS framework for modern, responsive, and performance-optimized layouts.
- **Shadcn UI & Base UI**: Accessible component primitives and beautifully designed UI components for a polished look.
- **Lucide React**: Clean, lightweight SVG vector icons representing components across the portal.
- **Embla Carousel**: Fully customizable touch-friendly carousel for high-impact home banners.

### Utilities and Helper Packages
- **React Hot Toast**: Beautiful, customizable toast notifications providing immediate, rich user feedback.
- **React Day Picker & Date-fns**: Advanced date utilities and pickers for scheduling tutoring sessions.
- **Class Variance Authority & Tailwind Merge**: Modular styling utilities facilitating robust class composition.

## Getting Started

Follow these steps to run the client application locally.

### Prerequisites

Ensure you have Node.js (version 18 or above) and npm installed.

### Installation

1. Clone the repository to your local system.
2. Navigate to the project directory:
   ```bash
   cd MediQueue
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To create a production-optimized build of the project:
```bash
npm run build
```

To run the built production version:
```bash
npm start
```
