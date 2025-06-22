# Wedding Seating Chart Application

A modern, interactive wedding seating chart application with drag-and-drop functionality, supporting both Planning Mode for organizing guests and Kiosk Mode for guest lookup.

## Features

### Planning Mode
- **CSV Upload**: Import guest lists from CSV files
- **Drag & Drop**: Easily move guests between tables
- **Table Management**: Add, remove, and position tables
- **Visual Feedback**: See table capacity and meal choices at a glance
- **Export Options**: Download configuration as JSON for Kiosk Mode or CSV for sharing

### Kiosk Mode
- **Guest Search**: Quick name search with recent searches
- **Visual Highlighting**: Automatically highlights guest location and table
- **Touch-Friendly**: Optimized for tablet/kiosk displays
- **JSON Import**: Load saved seating arrangements

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Deployment to Vercel

1. Push your code to a GitHub repository

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your GitHub repository

4. Configure the build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Click "Deploy"

Your app will be live at a Vercel URL!

## CSV Template Format

The CSV file should have the following columns:
- **Name** (required): Guest's full name
- **Table** (optional): Table assignment (e.g., "Table 1")
- **Meal choice** (optional): Steak, Chicken, or Veg
- **Notes** (optional): Any special notes or dietary restrictions

Example:
```csv
Name,Table,Meal choice,Notes
John Doe,Table 1,Steak,
Jane Smith,Table 1,Chicken,Vegetarian option needed
Bob Johnson,Table 2,Veg,Nut allergy
```

## Usage

### Planning Mode

1. Upload a CSV file with your guest list or start with an empty chart
2. Create tables by clicking the "+" button in the sidebar
3. Drag guests from the unassigned list to tables
4. Position tables by dragging them around the venue layout
5. Export your seating chart as JSON when complete

### Kiosk Mode

1. Upload the JSON file exported from Planning Mode
2. Guests can search for their name
3. The app will highlight their seat and table location
4. Recent searches are saved for quick access

## Technologies Used

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- @dnd-kit for drag-and-drop functionality
- PapaParse for CSV handling
- Lucide React for icons

## Browser Support

This application works best in modern browsers with ES6+ support. It's optimized for both desktop and tablet devices.