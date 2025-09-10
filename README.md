# ARPG Engine Browser

A 3D isometric Action Role-Playing Game (ARPG) engine built for web browsers, similar to Path of Exile and Diablo.

![ARPG Engine Screenshot](https://github.com/user-attachments/assets/d860655f-f9d5-4992-8176-1aa948e73137)

## Features

### 🎮 Core ARPG Gameplay
- **3D Isometric Camera** - Classic ARPG perspective with smooth camera controls
- **Click-to-Move** - Point-and-click movement system like Diablo/PoE
- **Real-time Combat** - Automatic attack system when near enemies
- **Character Progression** - Level up system with experience points
- **Enemy AI** - Enemies detect, chase, and attack the player

### 🌍 Game World
- **3D Terrain** - Procedural ground with grid-like texture
- **Environmental Objects** - Trees and rocks with realistic shadows
- **Dynamic Lighting** - Directional sun lighting with soft shadows
- **Atmospheric Effects** - Sky background and ambient lighting

### ⚔️ Combat System
- **Auto-Attack** - Automatic combat when in range of enemies
- **Health System** - Player and enemy health with visual health bars
- **Experience Gain** - Defeat enemies to gain XP and level up
- **Visual Effects** - Attack effects and damage feedback

### 🎨 User Interface
- **Health Bar** - Visual representation of player health
- **Character Stats** - Level, HP, XP, and position display
- **Enemy Counter** - Track remaining enemies in the world
- **Combat Info** - Instructions and tips for gameplay
- **Control Guide** - On-screen control instructions

### 🎯 Controls
- **Mouse Click** - Move character to clicked location
- **WASD Keys** - Camera movement and panning
- **Mouse Wheel** - Zoom in/out (planned feature)
- **Right Click** - Context menu (planned feature)

## Technology Stack

- **Three.js** - 3D graphics and WebGL rendering
- **TypeScript** - Type-safe game logic and systems
- **Vite** - Fast development and build system
- **HTML5 Canvas** - Rendering surface
- **CSS3** - UI styling and layout

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd arpg-engine-browser

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development
The game will be available at `http://localhost:3000` when running the development server.

## Architecture

### Core Systems
- **Game.ts** - Main game loop and system coordination
- **Camera.ts** - 3D camera management and controls
- **World.ts** - Terrain generation and environmental objects
- **InputManager.ts** - Keyboard and mouse input handling
- **CombatSystem.ts** - Enemy spawning and combat logic
- **UI.ts** - User interface updates and management

### Entities
- **Player.ts** - Player character with movement, combat, and progression
- **Enemy.ts** - AI-controlled enemies with health, movement, and combat

## Future Enhancements

- **Inventory System** - Equipment and item management
- **Skill Trees** - Character abilities and progression paths  
- **More Enemy Types** - Different enemy behaviors and challenges
- **Loot System** - Item drops and equipment upgrades
- **Sound Effects** - Audio feedback for actions and combat
- **Multiplayer Support** - Online cooperative gameplay
- **Dungeon Generation** - Procedural level creation
- **Quest System** - Missions and objectives
- **Save/Load** - Game state persistence

## Contributing

This is an open-source ARPG engine. Contributions are welcome for new features, bug fixes, and improvements.

## License

MIT License - Feel free to use this code for your own projects!