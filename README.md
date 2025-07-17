# Crypto Dashboard

A simple, dynamic cryptocurrency dashboard built with Remix and React. It allows users to view a list of cryptocurrencies, filter them in real-time, and reorder them using drag-and-drop. Exchange rate data is pulled from the Coinbase API.

![Crypto Dashboard Screenshot](https://placehold.co/800x450/1F2937/FFFFFF?text=Crypto+Dashboard+UI)

## Features

- **Server-Side Data:** Fetches real-time exchange rates from the Coinbase API on the server for a fast initial load.
- **Robust UI States:** Includes loading, error, and empty result states for a better user experience.
- **Client-Side Filtering:** Instantly filter the list by cryptocurrency name or symbol.
- **Drag & Drop Reordering:** Easily reorder the cards to create a personalized view.
- **Theming:** Supports both light and dark modes, respecting your system's theme preference.

## Setup and Installation

To get this project running locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/josetorres1/crypto-dashboard.git
   cd crypto-dashboard
   ```

2. **Install dependencies:**
   This project uses `npm` as its package manager.

   ```bash
   npm install
   ```

   _This will install Remix, React, Dnd Kit, and other necessary packages._

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open the application:**
   Once the server is running, open your browser and navigate to `http://localhost:5173`.

## Decisions & Tradeoffs

Here are some of the key technical decisions made during the development of this project:

### 1. Data Fetching: Server-Side First

- **Decision:** Use Remix's server `loader` function to fetch initial data from the Coinbase API, rather than fetching on the client in a `useEffect` hook.
- **Reasoning:** This server-first approach provides a significantly better user experience. The data is fetched and ready _before_ the page is sent to the browser, which means the user sees the complete content immediately without a client-side loading spinner. It also keeps API interactions off the client, which is a more secure and robust pattern.
- **Tradeoff:** This approach is dependent on the Remix framework's conventions. While it's the optimal way to fetch data within Remix, it's less portable than a component with client-side fetching logic.

### 2. Drag & Drop Library: Dnd Kit

- **Decision:** Use `dnd-kit` for all drag-and-drop functionality.
- **Reasoning:** `dnd-kit` was chosen because it is a modern, high-performance library built with accessibility in mind. Its modular architecture allows for a lean implementation, and it provides fine-grained control over the user experience (e.g., configuring sensor activation distance). This level of control and its commitment to modern React practices made it a superior choice for building a polished interactive experience.
- **Tradeoff:** As a lower-level library, `dnd-kit` requires a bit more setup for sortable lists compared to more opinionated libraries. However, this tradeoff is worthwhile for the performance and flexibility gains.

### 3. Filtering Strategy: Client-Side

- **Decision:** While initial data is fetched on the server, the filtering logic is executed entirely on the client.
- **Reasoning:** Filtering is a UI concern that demands immediate feedback. Performing this on the client-side using `useState` and `useMemo` provides an instantaneous response as the user types, without needing a network request for every keystroke. This feels much more responsive.
- **Tradeoff:** For a very large dataset (e.g., thousands of items), a client-side filter could become less performant. In that scenario, a "debounced" server-side search would be a better choice. For the scope of this project, client-side is optimal.

### 4. Miscellaneous Decisions

- **UI & Theming:** We used **Tailwind CSS** for rapid styling. It allows for building custom designs without writing custom CSS and comes with excellent support for dark/light modes. The app is configured to respect the user's system theme by default.
- **UI States:** We explicitly implemented states for **loading**, **error handling**, and **empty results**. This makes the application more robust and transparent to the user, preventing blank screens and providing clear feedback.
- **Authentication:** User authentication was considered but ultimately excluded to keep the project focused on the core dashboard functionality and to fit within the time constraints. Adding it would be a logical next step for persisting user-specific card orders across devices.
