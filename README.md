# Lead Management Dashboard

A modern, feature-rich lead management system built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✅ Completed Features

- **Lead Management**: Full CRUD operations for leads
- **Advanced Filtering**: Filter by status, source, and search
- **Sorting**: Multi-column sorting with visual indicators
- **Bulk Actions**: Update multiple leads simultaneously
- **Pagination**: Efficient data navigation
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Full dark mode support
- **Real-time Search**: Debounced search with race condition prevention

### 🎯 Task 2: Search & Race Condition

- ✅ Request cancellation using AbortController
- ✅ Race condition prevention with request ID tracking
- ✅ Loading, empty, and error states
- ✅ Debounced search input
- ✅ Interactive search results dropdown

## 📁 Project Structure

```
my-dashboard/
├── mock/
│   ├── leads.json           # Mock data
│   ├── routes.json          # API routes configuration
│   └── server.cjs           # Custom server config
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
|   |   └── search/
|   |       └── page.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── bulk-actions.tsx
│   │   │   ├── dashboard-filters.tsx
│   │   │   ├── dashboard-header.tsx
│   │   │   ├── dashboard-table.tsx
│   │   │   ├── lead-actions.tsx
│   │   │   ├── lead-avatar.tsx
│   │   │   ├── lead-detail-dialog.tsx
│   │   │   ├── lead-form-dialog.tsx
│   │   │   ├── lead-search.tsx
│   │   │   ├── lead-table-row.tsx
│   │   │   ├── leads-table-header.tsx
│   │   │   └── pagination.tsx
│   │   │
│   │   ├── layouts/
│   │   │   └── home-page.tsx
│   │   │
│   │   ├── sidebar/
│   │   │   └── app-sidebar.tsx
│   │   │
│   │   └── ui/                        # shadcn/ui components
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       └── ... (other UI components)
│   │
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── useLeadFilters.ts
│   │   ├── useLeadForm.ts
│   │   └── useSearch.ts
│   │
│   ├── interfaces/
│   │   └── leads.ts
│   │
│   ├── lib/
│   │   ├── date-utils.ts
│   │   ├── fonts.ts
│   │   └── utils.ts
│   │
│   └── stores/
│       └── useLeadStore.ts
│
├── .env
├── .env.local
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Mock API**: JSON Server

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd my-dashboard
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Create environment file**

```bash
cp .env.example .env
```

4. **Configure environment variables**

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5047
```

## 🚀 Getting Started

### Development Mode

**Terminal 1: Start Frontend**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Frontend runs at: http://localhost:3000

**Terminal 2: Start Mock API**

```bash
cd mock
npx json-server leads.json --port 5047 --watch
```

API runs at: http://localhost:5047

### Production Build

```bash
npm run build
npm run start
```

## 🎨 Key Components

### Search Component

Location: `src/components/dashboard/lead-search.tsx`

**Features**:

- Debounced input (300ms)
- Request cancellation
- Race condition prevention
- Loading/Empty/Error states
- Interactive results dropdown

**Usage**:

```typescript
import { LeadSearch } from "@/components/dashboard/lead-search";

<LeadSearch onSelectLead={(lead) => console.log(lead)} />;
```

### Search Hook

Location: `src/hooks/useSearch.ts`

**Features**:

- AbortController for cancellation
- Request ID tracking
- Type-safe state management

## 🔌 API Endpoints

### Base URL

```
http://localhost:5047
```

### Endpoints

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| GET    | `/leads`                | Get all leads     |
| GET    | `/leads?search=<query>` | Search leads      |
| GET    | `/leads/:id`            | Get lead by ID    |
| POST   | `/leads`                | Create new lead   |
| PUT    | `/leads/:id`            | Update lead       |
| DELETE | `/leads/:id`            | Delete lead       |
| POST   | `/leads/bulk-update`    | Bulk update leads |

### Unit Testing (Future)

```bash
npm run test
```

## 📝 Code Style

### TypeScript

- Strict mode enabled
- No implicit any
- Full type coverage

### Component Structure

```typescript
// 1. Imports
import { useState } from "react";

// 2. Types/Interfaces
interface ComponentProps {
  name: string;
}

// 3. Component
export function Component({ name }: ComponentProps) {
  // 4. State
  const [value, setValue] = useState("");

  // 5. Handlers
  const handleClick = () => {};

  // 6. Render
  return <div>{name}</div>;
}
```

## 🔒 Environment Variables

````env
# API Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:5047


### Manual
```bash
npm run build
npm run start
````

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Your Name**

- GitHub: <https://github.com/septalonika>
- Email: septalonikal@gmail.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Last Updated**: 11 December 2025  
**Version**: 1.0.0
