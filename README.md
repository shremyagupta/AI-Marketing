# 🚀 AI-Marketing: Viral Post Generator

An AI-powered social media marketing content creator built with Next.js and shadcn/ui. Generate viral-ready posts for Instagram, Twitter, LinkedIn, TikTok, and Facebook with smart templates and platform optimization.

![Viral Post Generator](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)

## ✨ Features

- **🎯 Platform-Optimized Content**: Generate content specifically tailored for each social media platform
- **🎨 8 Unique Tones**: From humorous to professional, find the perfect voice for your brand
- **📊 Multiple Goals**: Drive engagement, discovery, shares, signups, sales, or awareness
- **🏷️ Smart Hashtag Generation**: Auto-generates trending and platform-specific hashtags
- **📱 Beautiful UI**: Modern, responsive interface built with shadcn/ui
- **📋 Easy Export**: Copy individual posts or export all variations as text files
- **🔄 Multiple Variations**: Generate 3 different versions for A/B testing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/shremyagupta/AI-Marketing.git
   cd AI-Marketing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 How to Use

### Step 1: Fill in Business Details
- **Business Name**: Your brand name (e.g., "PureSip")
- **Business Description**: What your business does
- **Product/Service**: What you're promoting
- **Target Audience**: Who you're targeting

### Step 2: Choose Settings
- **Platform**: Instagram, Twitter, LinkedIn, TikTok, or Facebook
- **Tone**: Playful, humorous, inspirational, bold, minimalist, quirky, premium, or professional
- **Goal**: Engagement, discovery, shares, signups, sales, or awareness

### Step 3: Generate & Export
- Click "Generate Viral Posts" to create 3 variations
- Copy individual posts or export all as a text file
- Use the generated button text for your website CTAs

## 🎨 Example Output

**Input:**
- Business: PureSip — sustainable water bottles
- Product: New self-cleaning bottle
- Platform: Instagram
- Audience: Gen Z runners
- Tone: Playful
- Goal: Drive sales

**Output:**
```
Ready to hydrate smarter, not harder? 💧💡 

Our new PureSip bottle cleans itself—no judgment for post-run laziness!

Join the fun! 🌱

#viralpost #trending #explore #puresip #genz

Button: Shop PureSip — Stay Fresh 🚀
```

## 🎭 Available Tones

| Tone | Best For | Example Emojis |
|------|----------|----------------|
| **Playful** | Fun brands, younger audiences | 🎉 🎈 🌈 |
| **Humorous** | Memes, relatable content | 😂 🤣 💀 |
| **Inspirational** | Motivational content | ✨ 💪 🚀 |
| **Bold** | Disruptive brands | 🔥 💯 ⚡ |
| **Minimalist** | Clean, simple messaging | ▪️ ○ — |
| **Quirky** | Unique, creative brands | 🤪 🦄 🎨 |
| **Premium** | Luxury products | 👑 💎 🥂 |
| **Professional** | B2B, corporate | 📊 💼 📈 |

## 📱 Platform Optimizations

- **Instagram**: Visual-first content with engaging hooks
- **Twitter**: Concise, tweetable format with trending elements
- **LinkedIn**: Professional tone with industry insights
- **TikTok**: Trend-aware content with viral potential
- **Facebook**: Community-focused messaging

## 🔧 Customization

### Adding New Tones
Edit `lib/viral-post-generator.ts` and add to the `toneTemplates` object:

```typescript
newTone: {
  starters: ["Your starters"],
  emojis: ["🎯", "💫"],
  ctas: ["Your CTAs"]
}
```

### Platform-Specific Hashtags
Modify the `platformHashtags` object to customize hashtag suggestions.

### Custom Templates
The generation logic uses template patterns that you can easily extend for your specific use cases.

## 📦 Components Structure

```
components/
├── ui/                 # shadcn/ui components
├── viral-post-generator.tsx  # Main form component
└── post-preview.tsx    # Post display component

lib/
└── viral-post-generator.ts   # Core generation logic
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Lucide React](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ for marketers and creators who want to go viral! 🚀**
