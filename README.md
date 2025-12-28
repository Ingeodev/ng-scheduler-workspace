> [!WARNING]
> This package is currently under development and is not yet finished. It is **not recommended for production use**.
>
> If you need more information or have any questions, please contact:
> - **miguelonCoder**: mr.develop411@gmail.com
> - **Ingeodev**: ingeodev@gmail.com

# Mglon Scheduler (ng-scheduler)

A powerful, robust, and lightweight Scheduler library for Angular, built from the ground up using **Angular Signals** and **NgRx Signals**. Designed for performance, extensibility, and a premium developer experience.

## ✨ Key Features

- **🚀 Signal-First Architecture**: Built entirely with Angular Signals for fine-grained reactivity and optimal performance.
- **📅 Multiple Views**: Support for Month and Week views (with more on the way).
- **💡 Minimalism & Aesthetics**: Premium design with glassmorphism touches, vibrant adaptive colors, and clean typography.
- **🔄 Recurrence Support**: Full support for recurrent events following RFC 5545 standards.
- **🏗 Resource-Based Scheduling**: Group and manage events by resources effortlessly.
- **📍 All-Day Events**: Special minimalist styling for all-day events with dot indicators and colored borders.
- **🖱 Interactive Experience**: Smooth Drag & Drop and Resizing interactions using native pointer events.
- **🎨 Adaptive Color System**: Automatic generation of surface and contrast colors based on event base colors.
- **📱 Responsive Design**: CSS Grid-based layouts that adapt to any screen size.

## 📂 Project Structure

The project is organized as an Angular Workspace:

- **`projects/ng-scheduler`**: The core library source code.
  - `src/lib/core`: Store management, models, and rendering logic.
  - `src/lib/features`: View implementations (Month, Week, Event, Resource).
  - `src/lib/shared`: Helpers, icons, and common components.
- **`projects/playground`**: A dedicated application for demonstration, testing, and documentation.

## 🛠 Getting Started

### Prerequisites

- **Node.js**: Latest LTS recommended.
- **pnpm**: Used as the primary package manager.

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### Execution

To run the **Playground** (Demo App) locally:

```bash
pnpm start
# The app will be available at http://localhost:4200
```

### Development Scripts

- **Build Library**: `pnpm run build`
- **Run Tests**: `pnpm run test`
- **Watch Library**: `pnpm run watch` (for development)

## 🏗 Core Technologies

- **Angular 21+**: Core framework.
- **NgRx Signals**: State management.
- **date-fns**: Date manipulation.
- **rrule**: Recurrence logic.
- **SASS**: Advanced styling and variable system.

---
Developed with ❤️ for the Angular Ecosystem.
