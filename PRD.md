🌴 Borneo Rainforest Travel Experience App — Product Requirements Document (PRD)

Imagine walking into a cathedral built by nature.
The trees are skyscrapers. The mist is the lighting. The sounds of insects and birds are the background orchestra.

That’s Borneo’s rainforest — one of the oldest forests on Earth (~140 million years old).

The goal of this app is to create a calm, immersive digital companion that lets travelers explore the forest before they even arrive and navigate it effortlessly once they are there.

Think of the app like a luxury museum guide for a living jungle.

No clutter.
No scrolling.
Only fluid movement between places.


---

1. Product Vision

Create the most elegant rainforest exploration app ever built.

The app should feel like:

Opening an Apple Maps–level polished travel guide

Designed with museum-grade storytelling

With zero scrolling

Entirely driven by gesture-based navigation


The user should feel like they are gliding through the rainforest canopy.


---

2. Target Users

Primary Users

1. Eco-tourists


2. Wildlife photographers


3. Adventure travelers


4. Researchers and nature lovers



Secondary Users

Local guides

Travel planners

Students learning about biodiversity



---

3. Core Experience Philosophy

Principle 1 — No Scrolling

Scrolling creates friction.

Instead:

Swipe left → move to next attraction

Swipe right → previous attraction

Tap map marker → open attraction

Swipe down → return to map


Like flipping through beautifully designed postcards.


---

Principle 2 — Calm Design

The rainforest is not noisy visually.

The interface must reflect that.

Color palette inspired by nature:

Element	Color

Primary	Deep Forest Green #0F3D2E
Accent	Tropical Leaf #3AA76D
Water	River Blue #3F88C5
Mist	Pale Fog #F1F5F3


Typography:

Headings → Playfair Display

UI → Inter



---

4. Core App Architecture

Think of the system like a theme park map.

Every attraction = a station on the map.

The Leaflet map is the heart of the application.

App Layers

User Interface
      ↓
Navigation Engine
      ↓
Leaflet Map
      ↓
Attraction Data
      ↓
Media Assets (images, wildlife info)


---

5. Key Travel Locations in Borneo

Major attractions integrated into the map:

Location	Why it matters

Danum Valley	pristine ancient rainforest
Kinabatangan River	best wildlife spotting
Gunung Mulu National Park	massive cave systems
Bako National Park	proboscis monkeys
Sepilok Orangutan Sanctuary	rescued orangutans


Each attraction opens a fullscreen immersive card.


---

6. Map Interaction Design

Default State

User sees:

Minimal map

Subtle jungle color theme

Floating attraction icons


Leaflet map settings:

zoomControl: false
scrollWheelZoom: false
dragging: true
doubleClickZoom: false

Reason:

This creates calm navigation.


---

7. Native-Feeling Interaction

Animations must be buttery smooth (60fps).

Interaction Flow

User taps attraction marker
        ↓
Marker expands
        ↓
Map dims
        ↓
Fullscreen card slides upward
        ↓
Content fades in

Animation timing:

300ms ease-out


---

8. App Layout

The entire app fits inside one screen.

+-----------------------------------+
|                                   |
|         LEAFLET MAP               |
|                                   |
|                                   |
|                                   |
|         ●   ●   ●   ●             |
|                                   |
|-----------------------------------|
|   Floating Controls               |
|                                   |
|  [Explore] [Wildlife] [Trails]    |
+-----------------------------------+


---

9. Core Features

Feature 1 — Wildlife Discovery

Users tap animal icons on the map.

Examples:

Orangutans

Proboscis monkeys

Pygmy elephants

Hornbills


Opening an animal shows:

photo
habitat
best time to see
fun facts


---

Feature 2 — Night Jungle Mode

When time > 7 PM:

UI automatically switches to:

Dark jungle palette
Firefly animation
Subtle ambient sounds


---

Feature 3 — Guided Trails

Preloaded eco trails.

Example:

Kinabatangan Wildlife Route

Stops include:

1. River cruise


2. Elephant corridor


3. Hornbill nesting site



Users tap Start Trail.

App guides them step-by-step.


---

10. Technical Architecture

Tech Stack

Frontend

HTML5
CSS3
JavaScript

Libraries

Leaflet.js
GSAP (animations)
Mapbox tiles


---

11. Leaflet Map Initialization

Basic setup:

const map = L.map('map', {
 center: [4.5, 114],
 zoom: 6,
 zoomControl:false
});

Tile layer:

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);


---

12. Attraction Marker Example

const danum = L.marker([4.98,117.8])
.addTo(map)
.bindPopup("Danum Valley");

Custom marker icons:

orangutan.png
cave.png
river.png
trail.png


---

13. Gesture Navigation System

Commands:

swipeLeft()
swipeRight()
swipeDown()
tapMarker()

Each gesture triggers GSAP animation transitions.


---

14. Offline Mode

Rainforest locations often have zero signal.

Solution:

preload map tiles

cache attraction data

offline wildlife guide



---

15. Polished Micro-Interactions

Small details create luxury.

Examples:

Marker hover

pulse animation

Attraction open

leaf particles drift across screen

Trail completion

subtle bird chirp + badge


---

16. Performance Targets

Metric	Goal

App load	<2 seconds
Animation	60 fps
Map render	<500 ms



---

17. Accessibility

Features:

large tap targets

offline voice narration

colorblind-friendly palette



---

18. Future Features

Possible expansions:

AR wildlife spotting

AI guide voice

live ranger alerts

conservation donation



---

19. Success Metrics

Metric	Goal

Session length	8+ minutes
Trail usage	60% users
Return visits	40%



---

20. Final Experience Vision

When a traveler opens this app:

They shouldn't feel like they opened software.

They should feel like they opened a window into the rainforest.

A quiet, elegant guide that whispers:

"Come explore the jungle."


---

