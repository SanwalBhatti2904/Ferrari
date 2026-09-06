# 🏎️ Ferrari — The Art of Performance

> **A cinematic Ferrari web experience built around scroll-driven frame animation, immersive storytelling, and high-end automotive design.**

🔴 **Live Website:** [ferrariwebdesign.netlify.app](https://ferrariwebdesign.netlify.app/?utm_source=chatgpt.com)
💻 **GitHub Repository:** [SanwalBhatti2904/Ferrari](https://github.com/SanwalBhatti2904/Ferrari?utm_source=chatgpt.com)

---

## ✨ Overview

**Ferrari — The Art of Performance** is a cinematic, interactive web experience inspired by the world of Ferrari.

Instead of using a traditional static hero section, the website uses a large sequence of cinematic frames that respond to the user's scroll position, creating the feeling of an interactive automotive film directly inside the browser.

The experience combines:

* 🎞️ Scroll-driven cinematic frame animation
* 🏎️ Ferrari-inspired visual storytelling
* ✨ Smooth scrolling and transitions
* 🎬 GSAP-powered animations
* 🌊 Lenis smooth scrolling
* 💎 Glassmorphism UI elements
* 🔴 Ferrari-inspired dark/red visual atmosphere
* 📊 Interactive model carousel
* ⚡ Animated loading screen
* 📱 Responsive design
* ♿ Reduced-motion support

The goal was to make the website feel less like a conventional landing page and more like an **interactive automotive commercial**.

---

## 🎥 Live Experience

Experience the full website here:

### 🔴 [Visit Ferrari — The Art of Performance](https://ferrariwebdesign.netlify.app/)

The experience is designed to be explored by scrolling through the cinematic sequence.

> **Tip:** Use a desktop browser for the full cinematic experience.

---

## 🚀 Key Features

### 🎞️ Cinematic Frame Animation

The core of the website is a large image sequence rendered through an HTML `<canvas>`.

The project loads:

* **300 automotive frames**
* **300 heritage / Prancing Horse frames**
* **600 frames total**

The JavaScript dynamically loads the frame sequence from:

```text
car/
├── ezgif-frame-001.jpg
├── ezgif-frame-002.jpg
├── ...
└── ezgif-frame-300.jpg

horse/
├── ezgif-frame-001.jpg
├── ezgif-frame-002.jpg
├── ...
└── ezgif-frame-300.jpg
```

As the user scrolls, the current frame changes according to scroll progress, creating a cinematic video-like experience without using a traditional video element.

---

### ⚡ Cinematic Loading Screen

The website includes an animated startup loader that displays while the frame sequence is being prepared.

The loader includes:

* Circular progress animation
* Loading percentage
* Animated Ferrari-style `F` mark
* Progress bar
* Dynamic loading messages

Example loading stages include:

```text
Loading frames
Warming the engine
Calibrating aerodynamics
Polishing every line
Ready to drive
```

The website only transitions into the main experience after the required frame assets have finished loading.

---

### 🌀 Smooth Scrolling

The project uses **Lenis** to create smooth, controlled scrolling.

This makes the large frame sequence feel much more fluid and cinematic compared with normal browser scrolling.

---

### 🎬 GSAP + ScrollTrigger

The project uses **GSAP** and **ScrollTrigger** to synchronize visual storytelling with the user's scroll position.

Animations include:

* Fade-in / fade-out transitions
* Text reveals
* Blur transitions
* Horizontal movement
* Scale animations
* Typography transitions
* SVG line drawing
* UI transitions
* Scroll-based scene choreography

---

## 🧩 Story Structure

The experience is divided into multiple cinematic scenes.

### 00 — Hero

**Ferrari**

> The art of performance

The experience begins with the cinematic vehicle sequence and introduces the brand-inspired visual direction.

---

### 01 — Design

**Sculpted by speed**

Explores the relationship between aerodynamic precision and Italian automotive design.

---

### 02 — Performance

**Built for pure emotion**

Focuses on performance, response, power, and aerodynamic control.

---

### 03 — Form

**Form meets function**

A visual section focused on automotive contours and aerodynamic movement.

---

### 04 — Experience

**Inside the machine**

Introduces the driver-focused cockpit experience and precision controls.

---

### Precision

**Precision**

A minimalist typographic transition designed to create breathing room between cinematic sequences.

---

### Heritage

**The Prancing Horse**

The heritage section introduces Ferrari's iconic Prancing Horse identity and connects the modern performance story with the marque's history.

---

### Finale

**The art of performance**

A cinematic closing statement before transitioning into the interactive content sections.

---

### Discover

**Experience the extraordinary**

The final cinematic call-to-action leads into the Ferrari model range.

---

## 🏁 Ferrari Model Showcase

The website includes an interactive model carousel featuring:

### Roma

**Grand Tourer**

* 620 hp
* 3.9L Twin-Turbo V8
* 0–100 km/h: 3.4s
* Top speed: 320 km/h

### 296 GTB

**Berlinetta**

* 819 hp
* 3.0L Hybrid V6
* 0–100 km/h: 2.9s
* Top speed: 330 km/h

### SF90 Stradale

**Hybrid Flagship**

* 1,000 hp
* 4.0L Hybrid V8
* 0–100 km/h: 2.5s
* Top speed: 340 km/h

### Purosangue

**Four-Seat Sports Car**

* 725 hp
* 6.5L Naturally Aspirated V12
* 0–100 km/h: 3.3s
* Top speed: 310 km/h

The carousel supports:

* Previous / next navigation
* Interactive dots
* Smooth slide transitions
* Responsive layout

---

## 🛠️ Technologies Used

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| **HTML5**         | Website structure                |
| **CSS3**          | Styling, layout & visual effects |
| **JavaScript**    | Interactions & frame engine      |
| **Canvas API**    | Cinematic frame rendering        |
| **GSAP**          | Advanced animations              |
| **ScrollTrigger** | Scroll-based animation control   |
| **Lenis**         | Smooth scrolling                 |
| **SVG**           | Decorative motion graphics       |
| **Google Fonts**  | Typography                       |
| **Netlify**       | Deployment                       |

---

## 🎨 Design Direction

The visual design focuses on a premium automotive aesthetic.

### Visual characteristics

* Deep blacks
* Ferrari-inspired reds
* Warm highlights
* Glassmorphism
* Minimal typography
* Large cinematic imagery
* Subtle atmospheric effects
* High contrast
* Editorial-style layouts

Typography combines:

**Bodoni Moda**

for elegant display typography.

**Manrope**

for modern supporting text and UI elements.

---

## 🌌 Ambient Visual Effects

The experience includes subtle visual effects layered around the cinematic sequence.

These include:

* Ambient gradients
* Moving light sweeps
* Atmospheric particle effects
* Cinematic overlays
* Blur transitions
* Subtle canvas scaling
* Scroll-based lighting changes

These effects are designed to enhance the cinematic feeling without overpowering the frame sequence.

---

## 📱 Responsive & Accessibility

The project also considers different devices and user preferences.

### Responsive behavior

The experience adapts to:

* Desktop
* Laptop
* Tablet
* Mobile

### Reduced Motion

The JavaScript checks the user's:

```text
prefers-reduced-motion
```

setting and adjusts animations accordingly.

This helps provide a more accessible experience for users who prefer reduced motion.

---

## 📂 Project Structure

```text
Ferrari/
│
├── index.html
├── style.css
├── script.js
│
├── car/
│   ├── ezgif-frame-001.jpg
│   ├── ezgif-frame-002.jpg
│   ├── ...
│   └── ezgif-frame-300.jpg
│
├── horse/
│   ├── ezgif-frame-001.jpg
│   ├── ezgif-frame-002.jpg
│   ├── ...
│   └── ezgif-frame-300.jpg
│
└── README.md
```

---

## 💻 Run Locally

Clone the repository:

```bash
git clone https://github.com/SanwalBhatti2904/Ferrari.git
```

Navigate into the project:

```bash
cd Ferrari
```

Then open the project using a local development server.

For example, with VS Code and **Live Server**:

```text
Right Click → Open with Live Server
```

> A local server is recommended because the project loads a large number of image assets.

---

## ⚙️ Frame Sequence Configuration

The number of frames is controlled inside `script.js`.

```javascript
const totalCarFrames = 300;
const totalHorseFrames = 300;
const totalFrames = totalCarFrames + totalHorseFrames;
```

The project then loads the corresponding images from the `car` and `horse` folders.

If the number of frames changes, update these values and ensure the corresponding files exist.

---

## 🔗 External Libraries

This project uses:

* GSAP
* GSAP ScrollTrigger
* Lenis
* Google Fonts

The libraries are loaded through CDN resources in the HTML.

---

## 📈 Performance Considerations

Because the website uses hundreds of high-resolution image frames, asset loading is one of the most important parts of the experience.

The project includes:

* Preloading
* Loading progress tracking
* Canvas rendering
* Lightweight particle effects
* Responsive particle count
* Reduced-motion handling
* Frame interpolation
* Smooth scrolling synchronization

The loader helps prevent users from entering the cinematic experience before the frame sequence is ready.

---

## 🎯 Project Goals

This project was created to explore how modern frontend technologies can be used to create a premium automotive experience.

The main goals were:

* Create a cinematic website without relying on traditional video playback
* Synchronize visuals with scrolling
* Build immersive storytelling
* Experiment with GSAP and ScrollTrigger
* Create premium glassmorphism UI
* Improve frontend animation skills
* Combine motion design with web development
* Create a visually impressive portfolio project

---

## 🏎️ Inspiration

The design direction was inspired by:

* High-end automotive advertising
* Automotive cinematography
* Luxury editorial websites
* Ferrari's visual identity
* Motion design
* Modern Awwwards-style web experiences

This is an **independent design/development concept project** and is not an official Ferrari website.

Ferrari and related trademarks belong to their respective owners.

---

## 👨‍💻 Creator

### Sanwal Bhatti

Built as a creative frontend development project focused on:

**Web Design • Creative Development • Animation • Interactive Experiences**

---

## 🌐 Links

### 🔴 Live Website

[ferrariwebdesign.netlify.app](https://ferrariwebdesign.netlify.app/?utm_source=chatgpt.com)

### 💻 GitHub Repository

[SanwalBhatti2904/Ferrari](https://github.com/SanwalBhatti2904/Ferrari?utm_source=chatgpt.com)

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.

It helps support future creative web experiments and projects.

---

# 🏎️ The Art of Performance

**Designed to be experienced.
Built to be scrolled.
Created to feel like Ferrari.**

---

© 2026 Sanwal Bhatti — Independent Creative Web Project
