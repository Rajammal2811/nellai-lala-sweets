# Nellai Lala Sweets – QR Digital Menu Website
**Vedasandur, Tamil Nadu, India**

A premium, responsive, QR-based bilingual digital menu website built for **Nellai Lala Sweets**. Designed with an authentic South Indian royal burgundy and gold aesthetic, providing a live digital menu for dine-in and counter customers, paired with a secure owner administration dashboard.

---

## 🌟 Key Features

### 1. Customer Digital Menu (View-Only)
- **Bilingual Experience:** Tamil (தமிழ்) and English seamlessly presented side-by-side with language mode switcher.
- **7 Product Categories with Standard Per-Kg Pricing:**
  - Sweets – ஸ்வீட்ஸ் (₹400 / 1 kg)
  - Savories – காரம் (₹400 / 1 kg)
  - Special Sweets – ஸ்பெஷல் ஸ்வீட்ஸ் (₹500 / 1 kg)
  - Milk Sweets – மில்க் ஸ்வீட்ஸ் (₹600 / 1 kg) — *Includes Palkova, Chocolate Roll, and Gova Roll*
  - Ghee Sweets – நெய் ஸ்வீட்ஸ் (₹800 / 1 kg)
  - Potato Chips – உருளைகிழங்கு சிப்ஸ் (₹500 / 1 kg)
  - Cashew Cake – முந்திரி கேக் (₹1,000 / 1 kg)
- **Live Search & Category Filtering:** Instant search by Tamil or English name and sticky category navigation bar.
- **Availability Status:** Real-time **"Available • கிடைக்கும்"** and **"Unavailable • தற்போது இல்லை"** badges.
- **Zero Friction for Customers:** No app download, no login, and no checkout clutter. Strictly view-only.

### 2. Print-Ready QR Code Stand Generator
- Generates a high-resolution QR code directly linking to the live digital menu (`/menu`).
- **Static QR Code Guarantee:** The QR code remains 100% permanent and unchanged even when prices, products, or availability are modified daily by the owner.
- **Printable Counter / Table Stand Card:** Built-in traditional burgundy-and-gold framed stand card ready for one-click printing (`window.print()`) or PNG download.

### 3. Shop Owner Administration Portal
- **Separate Secure Login:** Accessible via `/admin`.
- **Product Management:**
  - Add new sweets, savories, and seasonal specials.
  - Upload product photographs from device or provide image URLs.
  - Edit Tamil and English product names and descriptions.
  - Modify per-kg prices and units.
  - Change product categories.
  - **One-Click Availability Toggle:** Instantly mark items Available or Unavailable.
  - Safe Deletion with confirmation modal.
- **Instant Synchronization:** All owner updates immediately appear on the customer digital menu.

### 4. Strict Logo Rule Compliance
- Uses a temporary placeholder (`/public/logo-placeholder.svg`) with original proportions preserved.
- When the original Nellai Lala Sweets logo file is provided by the owner, replace `logo-placeholder.svg` in `/public` or configure it without cropping, recoloring, or distorting.

---

## 🛠️ Technology Stack
- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS (Custom Royal Burgundy `#5C1527` & Rich Gold `#D4AF37` palette)
- **Icons:** Lucide React
- **QR Generation:** QRCode (`qrcode`)
- **Backend / Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth (with offline demo fallback for testing)
- **Deployment:** Vercel ready (`vercel.json`)

---

## 🚀 Getting Started

### 1. Installation & Local Development
```bash
# Navigate to project folder
cd "c:\Users\USER\Nellai lala"

# Install packages (already installed)
npm install

# Start local development server
npm run dev
```

Visit:
- Customer Website: `http://localhost:5173/`
- Customer Menu: `http://localhost:5173/menu`
- Owner Login: `http://localhost:5173/admin`

---

## 🔐 Supabase Database Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project (e.g., `nellai-lala-sweets`).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, copy all contents, paste into the SQL Editor, and click **Run**.
   - This sets up the `categories` and `products` tables.
   - Enables Row Level Security (RLS):
     - **Public (anon):** Read-only permissions on products and categories.
     - **Authenticated (owner):** Insert, update, and delete permissions.
   - Pre-seeds all 7 initial categories and required milk sweet products (*Palkova*, *Chocolate Roll*, *Gova Roll*).

### Step 2: Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your project credentials from Supabase **Project Settings > API**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_PUBLIC_SITE_URL=https://nellai-lala-sweets.vercel.app
   ```

### Step 3: Create Owner Admin Account
In your Supabase dashboard under **Authentication > Users**, click **Add user**:
- **Email:** `owner@nellailala.com` (or your preferred email)
- **Password:** Create a secure password.

*Note: In local test/demo mode (before Supabase credentials are configured), you can click "One-Click Demo Owner Sign In" on the `/admin` login page with credentials `admin@nellailala.com` / `nellailala123`.*

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub or GitLab.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the repository.
4. Add the Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PUBLIC_SITE_URL` (set to your Vercel URL, e.g. `https://nellai-lala-sweets.vercel.app`)
5. Click **Deploy**.
6. The `vercel.json` rewrite configuration ensures all client-side routes (`/menu`, `/admin`, `/admin/dashboard`) route seamlessly to `index.html`.

---

## 📍 Shop Information
- **Shop Name:** Nellai Lala Sweets (நெல்லை லாலா ஸ்வீட்ஸ்)
- **Location:** Near Bus Stand, Main Bazaar Road, Vedasandur - 624710, Dindigul District, Tamil Nadu, India
- **Phone:** +91 98421 23456 / +91 94432 78901
- **Hours:** Monday – Sunday: 7:00 AM – 10:00 PM
