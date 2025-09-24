# TheTop36 - Digital Vault Store

A modern, full-stack digital vault store selling curated $7 bundles of public-domain content. Each purchase qualifies the buyer for promotional draws, daily micro draws, and referral-boosted odds for viral engagement.

![TheTop36](https://img.shields.io/badge/TheTop36-Digital%20Vault%20Store-teal?style=for-the-badge&logo=next.js)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Stripe](https://img.shields.io/badge/Stripe-Payment%20Processing-635BFF?style=for-the-badge&logo=stripe)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

## 🌟 Features

### Core Functionality
- ✅ **Stripe Checkout Integration** - Secure $7 bundle purchases with test/live mode toggle
- ✅ **Raffle Ticket System** - Automatic ticket assignment via webhook after successful payment
- ✅ **Daily Draw Cron Job** - Automated daily winner selection with live updates
- ✅ **Real-time Leaderboard** - Live updates without page refresh using Server-Sent Events
- ✅ **Referral System** - Gated access for paid users with odds tracking
- ✅ **Interactive Widgets** - Spin-the-wheel and scratch-card games

### UI/UX Enhancements
- 🎨 **Modern Design** - Beautiful, responsive design with brand colors (Teal & Gold)
- 📱 **Mobile-First** - Fully responsive across desktop, tablet, and mobile
- ⚡ **Smooth Animations** - CSS animations and transitions for better user experience
- 🔄 **Real-time Updates** - Live data updates using Server-Sent Events
- 🎯 **User-Friendly** - Intuitive navigation and clear call-to-actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database (MongoDB Atlas recommended)
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/thetop36.git
   cd thetop36
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.sample .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   - Stripe keys and webhook secret
   - MongoDB connection string
   - JWT secret for authentication
   - Cron secret for daily draws

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Configuration

### Stripe Setup
1. Create a Stripe account and get your API keys
2. Create a product with price ID for the $7 bundle
3. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Configure webhook events: `checkout.session.completed`

### Database Setup
1. Create a MongoDB Atlas cluster or use local MongoDB
2. Update `MONGODB_URI` in your environment variables
3. The app will automatically create the necessary collections

### Daily Draw Cron Job
1. Set up Vercel Cron Job (if deploying to Vercel)
2. URL: `https://yourdomain.com/api/draw/run?secret=your-cron-secret`
3. Schedule: `0 12 * * *` (daily at 12 PM UTC)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── checkout/      # Stripe checkout & confirmation
│   │   ├── draw/          # Daily draw cron job
│   │   ├── leaderboard/   # Leaderboard data
│   │   ├── realtime/      # Server-Sent Events
│   │   ├── stripe/        # Stripe webhook
│   │   └── winners/       # Winners data
│   ├── buy/               # Purchase page
│   ├── leaderboard/       # Leaderboard page
│   ├── referral/          # Referral tracker (gated)
│   ├── success/           # Payment success page
│   ├── widgets/           # Interactive widgets
│   └── winners/           # Winners feed
├── lib/                   # Utility libraries
│   ├── auth.ts           # JWT authentication
│   ├── db.ts             # Database connection
│   ├── realtime.ts       # Real-time communication
│   └── stripe.ts         # Stripe configuration
└── models/               # Database models
    ├── User.ts           # User schema
    └── Winner.ts         # Winner schema
```

## 🎯 Key Features Explained

### Stripe Integration
- **Test Mode**: Use card `4242 4242 4242 4242` for testing
- **Webhook Processing**: Automatic ticket assignment after payment
- **Error Handling**: Comprehensive error handling and user feedback

### Real-time Updates
- **Server-Sent Events**: Live updates for leaderboard and winners
- **Connection Status**: Visual indicators for real-time connection
- **Automatic Reconnection**: Handles connection drops gracefully

### Authentication & Authorization
- **JWT-based**: Secure session management
- **Gated Access**: Referral tracker only for paid users
- **Cookie-based**: Secure HTTP-only cookies

### Database Models
- **User**: Email, tickets, referrals, timestamps
- **Winner**: Email, prize, draw date, timestamps

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set Environment Variables**
   - Add all variables from `.env.local` to Vercel project settings
   - Use production values for live deployment

3. **Configure Domain**
   - Add your custom domain in Vercel settings
   - Update `SITE_URL` and `NEXT_PUBLIC_SITE_URL`

4. **Set up Cron Job**
   - Go to Vercel project settings → Functions → Cron Jobs
   - Add daily cron job for draws

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

### Stripe Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Stripe checkout flow
- [ ] Webhook processing
- [ ] Ticket assignment
- [ ] Leaderboard updates
- [ ] Daily draw execution
- [ ] Referral tracking
- [ ] Widget functionality

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/checkout/session` | POST | Create Stripe checkout session |
| `/api/checkout/confirm` | POST | Confirm payment status |
| `/api/stripe/webhook` | POST | Stripe webhook handler |
| `/api/draw/run` | POST | Execute daily draw (cron) |
| `/api/leaderboard` | GET | Get leaderboard data |
| `/api/winners` | GET | Get winners list |
| `/api/me` | GET | Get current user data |
| `/api/realtime/stream` | GET | Server-Sent Events stream |

## 🎨 Brand Guidelines

### Colors
- **Primary Teal**: `#008080`
- **Accent Gold**: `#FFD700`
- **Background Ivory**: `#fffff0`
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Lora (serif)
- **UI Elements**: System fonts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub
- **Email**: support@thetop36.com

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Payments powered by [Stripe](https://stripe.com/)
- Database by [MongoDB](https://mongodb.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Heroicons](https://heroicons.com/)

---

**TheTop36** - Where digital treasures meet daily excitement! 🎯✨