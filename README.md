# LeetCode Suggestions

A web app that helps users **find more problems to practice on LeetCode**, built with **Next.js / React**, by [Gurkirat Singh](https://github.com/codingmastergurkirat).

> **Repository:** [codingmastergurkirat/leetcodesuggestions](https://github.com/codingmastergurkirat/leetcodesuggestions)
> **Status:** 🚧 Not yet deployed — currently runnable **locally only**.

---

## 🔎 About

LeetCode Suggestions helps you find **new problems to practice** on LeetCode instead of repeatedly solving ones you already know.

Here's how it works:

1. You search for a **LeetCode username** directly in the app.
2. The app fetches that user's **recently solved problems** using the [alfa-leetcode-api](https://alfaarghya.github.io/alfa-leetcode-api/).
3. Based on the topics/patterns in those recently solved problems, it **suggests new problems** for the user to try next — helping surface problems outside what they've already been practicing.

No login to LeetCode itself is required — since it's just looking up public submission data via the username, you can check suggestions for your own account or any other public profile.

> **Note:** The project is in an early stage (a handful of commits so far) and doesn't yet have a public deployment. This README will be updated as more functionality is added.

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org)** (App/Pages Router)
- **[React](https://react.dev)**
- **Node.js** runtime
- **[alfa-leetcode-api](https://alfaarghya.github.io/alfa-leetcode-api/)** — a third-party, community-built LeetCode API providing endpoints for user profiles, badges, solved questions, contest details/history, submissions, calendar, daily questions, and problem lists
- Project code lives inside the `leetcode/` directory of the repository

## 📁 Project Structure

```
leetcodesuggestions/
├── leetcode/           # Main Next.js application (source code, pages/components)
└── README.md
```

## 🚀 Getting Started (Run Locally)

Since this project isn't deployed yet, you'll need to run it on your own machine.

### 1. Clone the repository

```bash
git clone https://github.com/codingmastergurkirat/leetcodesuggestions.git
cd leetcodesuggestions
```

### 2. Move into the app directory

The Next.js app lives inside the `leetcode` folder:

```bash
cd leetcode
```

### 3. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Open the app

Visit [http://localhost:3000](http://localhost:3000) in your browser.

Once it's running, just **enter a LeetCode username** in the search box to see recently solved problems and get suggestions for new ones to practice.

> ⚠️ If any of the commands above (e.g., `npm run dev`) don't match the scripts actually defined in `leetcode/package.json`, check that file for the exact script names once you've cloned the repo.
>
> ⚠️ Since the app depends on the external **alfa-leetcode-api**, make sure you have an internet connection while running it locally — the app needs to reach that API to fetch user data.

## 🤝 Contributing

This project is early-stage and open to contributions. Feel free to open an [issue](https://github.com/codingmastergurkirat/leetcodesuggestions/issues) or submit a pull request with improvements, bug fixes, or new features.

## 📄 License

No license file is currently published in the repository. Please check with the repo owner ([@codingmastergurkirat](https://github.com/codingmastergurkirat)) before reusing or redistributing the code.

## ✨ Current Features

- 🔍 Search any public LeetCode profile by **username**
- 📋 Fetch and view **recently solved problems** for that user
- 💡 Get **suggested problems** to practice next, based on solving history

## 🗺️ Possible Future Ideas

- Filter suggestions by difficulty, topic, or company tags
- Show contest history/stats alongside suggestions
- Track practice progress over time
- Daily problem recommendations
