## 1. Splash 4 / Splash 5 / Splash 6 (Lumora logo splash)

স্ট্যাটিক UI screen, কোনো API লাগে না।

## 2. Onboarding 7 / 8 / 9 (Discover Inner Peace, Daily Rituals, Grow & Thrive)

স্ট্যাটিক content (client-side slider), কোনো API লাগে না। চাইলে future-এ `GET /home` ব্যবহারের আগে static onboarding array ফ্রন্টএন্ডে রাখাই যথেষ্ট।

## 3. Sign in screen===Sign In=button===`POST /api/v1/auth/login`===`route/auth.route.js`===`controller/auth.controller.js`

## 4. Sign up screen===Sign Up===button===`POST /api/v1/auth/register`===`route/auth.route.js`===`controller/auth.controller.js`

## 5. Forgot password screen===Send OTP===button==`POST /api/v1/auth/forget-password`==`route/auth.route.js`===`controller/auth.controller.js`

## 6. Verify OTP screen

(a) Email verify (register এর পরে)===`POST /api/v1/auth/verify-email`======`route/auth.route.js`===`controller/auth.controller.js`
(b) Reset password OTP verify=========`POST /api/v1/auth/verify-reset-otp`==`route/auth.route.js`===`controller/auth.controller.js`
OTP আবার পাঠানো দরকার হলে============`POST /api/v1/auth/resend-otp`========`route/auth.route.js`===`controller/auth.controller.js`
  
## 7. Change password screen (Set Your New Password — forgot-password flow এর শেষ ধাপ)
New Password, Confirm password=====Save===`POST /api/v1/auth/reset-password`===`route/auth.route.js`===`controller/auth.controller.js`


## 8. Home screen

সব section (Good Morning greeting, Today's Reflection, 28 days challenge ring, Today's Meditation cards, Today's Action, Latest Announcement) — একটাই API call এ আসে।

`GET /api/v1/home`===`route/home.route.js`==`router.get("/", protect, getHome)`===`controller/home.controller.js`

## 9. Meditation screen (Today's Meditation grid + Today's Inspiration for Meditation)

| Section | API |
|---|---|
| Today's Meditation + Today's Inspiration list=`GET /api/v1/meditation`=`route/meditation.route.js`=`router.get("/", protect, getTodaysMeditation)`=`controller/meditation.controller.js` 
| (Optional) সব meditation browse করা============`GET /api/v1/meditation/all?category=yoga`==`router.get("/all", protect, getAllMeditations)`=`controller/meditation.controller.js` 


## 10. Yoga detail screen (Crescent Lunge — Process / Time Duration / Benefits + Start now / Mark as complete)

| Button | API |
|---|---|
| Screen load | `GET /api/v1/meditation/:id` |
| **Mark as complete** | `PATCH /api/v1/meditation/:id/complete` |
| **Start now** | পরের "Time" screen এ নিয়ে যায় (নিচে ১১ দেখো), নিজে কোনো নতুন API না |

- **Route file:** `route/meditation.route.js`
  - `router.get("/:id", protect, getMeditationById)`
  - `router.patch("/:id/complete", protect, markMeditationComplete)`
- **Controller:** `controller/meditation.controller.js` → `getMeditationById`, `markMeditationComplete`

---

## 11. Time screen (Timer: Time for / How many times / Break time + Play button)

এই screen পুরোপুরি client-side timer UI — `durationMinutes`, `times`, `breakTimeMinutes` মেডিটেশন detail (`GET /api/v1/meditation/:id`) থেকেই আসে, আলাদা কোনো API লাগে না। Play শেষ হলে **Mark as complete** call করবে (উপরে ১০ নং)।

---

## 12. Inspiration player screen (River Flows in You — play/pause, heart, Mark as heard)

| Element | API |
|---|---|
| Screen load | `GET /api/v1/inspiration/:id` |
| ❤️ heart icon toggle | `PATCH /api/v1/inspiration/:id/favorite` |
| **Mark as heard** button | `PATCH /api/v1/inspiration/:id/heard` |

- **Route file:** `route/inspiration.route.js`
  - `router.get("/:id", protect, getInspirationById)`
  - `router.patch("/:id/favorite", protect, toggleFavoriteInspiration)`
  - `router.patch("/:id/heard", protect, markInspirationHeard)`
- **Controller:** `controller/inspiration.controller.js` → `getInspirationById`, `toggleFavoriteInspiration`, `markInspirationHeard`

---

## 13. Journey screen (Today's Activity checklist / Today's Meditation / Today's Inspiration / Journal Prompt input)

| Element | API |
|---|---|
| Screen load (checklist + meditation + inspiration + prompt) | `GET /api/v1/journal` |
| চেকবক্স (Sit quietly, Walk 10 min ইত্যাদি) টিক দেওয়া | `PATCH /api/v1/journal/activity` |
| Journal Prompt "Write here" input save | `POST /api/v1/journal/prompt` |

- **Route file:** `route/journal.route.js`
  - `router.get("/", protect, getJournalByDate)`
  - `router.patch("/activity", protect, toggleActivity)`
  - `router.post("/prompt", protect, saveJournalAnswer)`
- **Controller:** `controller/journal.controller.js` → `getJournalByDate`, `toggleActivity`, `saveJournalAnswer`
- সব activity + meditation সম্পন্ন হলে internally `maybeCompleteChallengeDay()` ফাংশন 28-days challenge এর `currentDay` বাড়িয়ে দেয়।

---

## 14. Journal Prompt modal (Home screen থেকে popup: "What are you grateful for today?" + Save)

| Element | API |
|---|---|
| **Save** button | `POST /api/v1/journal/prompt` |

- **Route file:** `route/journal.route.js` → `router.post("/prompt", protect, saveJournalAnswer)`
- **Controller:** `controller/journal.controller.js` → `saveJournalAnswer`
(Journey screen এর journal prompt এর মতোই একই API — screen আলাদা হলেও data model একটাই "today's journal entry")

---

## 15. Journal screen (Calendar view — July 2026, Day 15 of 28, progress bar + Today's Activity/Meditation/Inspiration/Prompt নিচে)

| Element | API |
|---|---|
| ক্যালেন্ডার + progress bar | `GET /api/v1/journal/calendar?month=7&year=2026` |
| নিচের checklist/meditation/inspiration/prompt অংশ | `GET /api/v1/journal` (সেকশন ১৩ এর মতোই) |
| কোনো তারিখে click করলে সেই দিনের entry দেখতে | `GET /api/v1/journal?date=YYYY-MM-DD` |

- **Route file:** `route/journal.route.js`
  - `router.get("/calendar", protect, getJournalCalendar)`
  - `router.get("/", protect, getJournalByDate)`
- **Controller:** `controller/journal.controller.js` → `getJournalCalendar`, `getJournalByDate`

---

## 16. Community screen (Coming Soon + Notify me checkbox)

| Element | API |
|---|---|
| Screen load | `GET /api/v1/community` |
| **Notify me** checkbox toggle | `POST /api/v1/community/notify-me` |

- **Route file:** `route/community.route.js`
  - `router.get("/", protect, getCommunityStatus)`
  - `router.post("/notify-me", protect, toggleNotifyMe)`
- **Controller:** `controller/community.controller.js` → `getCommunityStatus`, `toggleNotifyMe`

---

## 17. Learn (book) / Learn (video) screen — search bar + Book/Video tab toggle

| Element | API |
|---|---|
| Book tab (default) | `GET /api/v1/learn?type=book` |
| Video tab | `GET /api/v1/learn?type=video` |
| Search bar "Search your need" | `GET /api/v1/learn?type=book&search=<query>` |
| প্রতিটা কার্ডের ❤️ Like | `PATCH /api/v1/learn/:id/like` |
| 📄 Download icon | `PATCH /api/v1/learn/:id/download` |
| Share icon | `PATCH /api/v1/learn/:id/share` |
| "READ MORE" ক্লিক করলে detail | `GET /api/v1/learn/:id` |

- **Route file:** `route/learn.route.js`
  - `router.get("/", protect, getLearnContent)`
  - `router.get("/:id", protect, getLearnContentById)`
  - `router.patch("/:id/like", protect, toggleLike)`
  - `router.patch("/:id/download", protect, registerDownload)`
  - `router.patch("/:id/share", protect, registerShare)`
- **Controller:** `controller/learn.controller.js` → `getLearnContent`, `getLearnContentById`, `toggleLike`, `registerDownload`, `registerShare`

---

## 18. Notification screen (Today / Previous grouped list)

| Element | API |
|---|---|
| Screen load (Today + Previous groups) | `GET /api/v1/notification` |
| কোনো notification-এ ট্যাপ করলে read করা | `PATCH /api/v1/notification/:id/read` |

- **Route file:** `route/notification.route.js`
  - `router.get("/", protect, getNotifications)`
  - `router.patch("/:id/read", protect, markNotificationRead)`
- **Controller:** `controller/notification.controller.js` → `getNotifications`, `markNotificationRead`
- Home screen-এর top-right 🔔 bell icon → এই screen-এ নেভিগেট করে, badge count চাইলে `today` array এর length ব্যবহার করা যাবে।

---

## 19. Profile screen (Vicky Jams card + Edit Profile / Account Management / Terms / Privacy / Log out)

| Element | API |
|---|---|
| Screen load (name, email, avatar) | `GET /api/v1/user/profile` |
| **Log out** | `POST /api/v1/auth/logout` |
| Terms of Condition / Privacy Policy | static content, কোনো API লাগে না (চাইলে future-এ CMS বানানো যায়) |

- **Route file:** `route/user.route.js` → `router.get("/profile", protect, getProfile)`
- **Controller:** `controller/user.controller.js` → `getProfile`
- Logout: `route/auth.route.js` → `router.post("/logout", protect, logout)` → `controller/auth.controller.js` → `logout`

---

## 20. Edit Profile screen (avatar upload, User name, Email, Phone, Address + Save)

| Element | API |
|---|---|
| **Save** button | `PUT /api/v1/user/profile` (multipart/form-data, field name `profileImage` for the avatar) |

- **Route file:** `route/user.route.js` → `router.put("/profile", protect, upload.single("profileImage"), updateProfile)`
- **Controller:** `controller/user.controller.js` → `export const updateProfile`
- Avatar → Cloudinary তে আপলোড হয় (`utils/commonMethod.js` → `uploadOnCloudinary`)।

---

## 21. Account Management screen (Change Password / Delete Account rows)

স্ট্যাটিক menu, নিচের দুই screen এ নিয়ে যায় — কোনো নিজস্ব API নাই।

---

## 22. Change Password screen (Current Password / New Password / Confirm Password + Save — logged-in state)

| Element | API |
|---|---|
| **Save** button | `PUT /api/v1/user/account/change-password` |

- **Route file:** `route/user.route.js` → `router.put("/account/change-password", protect, changePassword)`
- **Controller:** `controller/user.controller.js` → `export const changePassword`

---

## 23. Delete Account screen (reason radio buttons + Delete Account button)

| Element | API |
|---|---|
| **Delete Account** button | `DELETE /api/v1/user/account` |

- **Route file:** `route/user.route.js` → `router.delete("/account", protect, deleteAccount)`
- **Controller:** `controller/user.controller.js` → `export const deleteAccount`
- Body: `{ reason: "I don't use the app anymore" | "I'm concerned about my privacy" | "I'm taking a break" | "I'm creating a different account" | "The app doesn't meet my needs" | "I experienced technical issues" | "Other reason" }`
- Delete করার আগে reason `model/accountDeletion.model.js` এ log হয়ে যায়, তারপর user document remove হয়।

---

## 24. Terms of Condition / Privacy Policy screens

স্ট্যাটিক text content — চাইলে ভবিষ্যতে একটা `CmsPage` model বানিয়ে dynamic করা যাবে, এই মুহূর্তে backend থেকে serve করা হচ্ছে না (frontend hardcoded রাখতে পারে)।

---

## Quick reference table — File Map

| Feature | Route file | Controller file |
|---|---|---|
| Auth (register/login/otp/reset) | `route/auth.route.js` | `controller/auth.controller.js` |
| Profile / Account mgmt | `route/user.route.js` | `controller/user.controller.js` |
| Home | `route/home.route.js` | `controller/home.controller.js` |
| Meditation / Yoga | `route/meditation.route.js` | `controller/meditation.controller.js` |
| Inspiration (audio) | `route/inspiration.route.js` | `controller/inspiration.controller.js` |
| Journal / Journey | `route/journal.route.js` | `controller/journal.controller.js` |
| Learn (book/video) | `route/learn.route.js` | `controller/learn.controller.js` |
| Community | `route/community.route.js` | `controller/community.controller.js` |
| Notification | `route/notification.route.js` | `controller/notification.controller.js` |

সব route `mainroute/index.js` তে mount করা আছে prefix সহ:
`/auth`, `/user`, `/home`, `/meditation`, `/inspiration`, `/journal`, `/learn`, `/notification`, `/community`
