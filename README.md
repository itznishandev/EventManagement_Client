# 🌱 Uddog — Social Development & Community Events Platform

**Uddog** is a community-driven social development event management platform where citizens, youth collectives, and local organizers across Bangladesh can create, discover, join, and track grassroots social service initiatives in their area—such as *Winter Clothes Distribution in Mirpur 10*, *Blanket Distribution in Mohammadpur*, *Dhanmondi Lake Plastic Cleanup*, and *Urban Sapling Plantation in Uttara*.

---

## 🔗 Live Site & Repositories

- **Website Name:** Uddog — Civic Action Network
- **Live Client URL (Vercel):** [https://uddog-event.vercel.app](https://uddog-event.vercel.app)
- **Live Server API (Vercel):** [https://event-management-server-xi.vercel.app/api](https://event-management-server-xi.vercel.app/api)
- **Client Repository:** [https://github.com/itznishandev/EventManagement_Client](https://github.com/itznishandev/EventManagement_Client)
- **Server Repository:** [https://github.com/itznishandev/EventManagement_Server](https://github.com/itznishandev/EventManagement_Server)

---

## 🌟 Key Features of Uddog (5+ Core Highlights)

1. **Dynamic Recent Upcoming Events with MongoDB `.limit(6)`:**
   - The Home page dynamically queries the 6 nearest upcoming community drives from MongoDB using the `.limit(6)` operator and ascending `eventDate` sort, rendered in an equal-height 3-column grid with custom shimmer loading skeletons.
2. **Future-Verified Event Creation & Live Card Preview:**
   - Authenticated users can schedule new community drives (`/create-event`) with `react-datepicker` and strict future-date validation ensuring no past date can ever be submitted, complete with a real-time card preview and organizer attribution.
3. **Public Upcoming Directory with Live Search, Category Filter & Date Sorting:**
   - Citizens can browse all upcoming events (`/upcoming-events`) where expired drives are automatically filtered out. Includes instant keyword search across title/location, category filtering (`Cleanup`, `Plantation`, `Donation`, `Medical Camp`, `Education`, `Flood Relief`, `Blood Donation`), and chronological sorting.
4. **Public Event Details & One-Click Authenticated Volunteer Joining:**
   - Anyone can inspect event details (`/events/[id]`) without logging in. Authenticated volunteers can join with a single click, persisting their participation record in MongoDB, updating live capacity progress bars, and displaying their joined events sorted by `eventDate` on `/joined-events`.
5. **JWT-Protected Organizer Dashboard (Update & Delete Own Events):**
   - From `/manage-events`, organizers can view all events they created, update event details through a validated modal, or delete listings via custom SweetAlert2 confirmation dialogs—backed by server-side JWT verification and strict creator ownership checks.
6. **Full System Light/Dark Theme Toggle & Synchronized Profile Management:**
   - One-click theme switcher in the Navbar toggles the entire application between custom editorial Light and Dark palettes. Users can also view their personal impact counters and update their display name and profile photo (`/profile`) synced across MongoDB collections.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, DaisyUI v5
- **Authentication & Authorization:** BetterAuth (Email/Password + Google & GitHub OAuth), MongoDB Adapter, JSON Web Tokens (`jsonwebtoken`)
- **Backend:** Express.js REST API + Next.js Route Handlers, MongoDB Atlas (`mongodb`)
- **UI & Feedback Libraries:** `react-datepicker`, `react-hot-toast`, `sweetalert2`, `react-icons` (including the new `FaXTwitter` X logo)

   npm run dev
   ```
