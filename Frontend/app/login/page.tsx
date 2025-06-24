import LoginForm from "@/components/forms/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <LoginForm />
    </div>
  )
}

/* 
/app
│
├─ layout.tsx                  # Root layout with Geist font, etc.
├─ page.tsx                    # Landing or homepage
│
├─ login/                      # /login page
│  └─ page.tsx                 # Renders <LoginForm />
│
├─ register/                   # /register page
│  └─ page.tsx                 # Renders <RegisterForm />
│
├─ (protected)/                # Authenticated-only routes
│  ├─ layout.tsx               # Authenticated layout with sidebar + navbar
│  ├─ dashboard/
│  │   └─ page.tsx             # Main dashboard
│  ├─ profile/
│  │   └─ page.tsx             # View & edit user profile
│  ├─ contractors/
│  │   ├─ page.tsx             # Contractor list/search
│  │   └─ [id]/page.tsx        # Contractor detail view
│  ├─ projects/
│  │   ├─ page.tsx             # List of projects
│  │   ├─ new/page.tsx         # Create new project
│  │   └─ [id]/page.tsx        # Project details
│  ├─ quotes/
│  │   ├─ page.tsx             # List of quote requests
│  │   ├─ new/page.tsx         # Create a new quote
│  │   └─ [id]/page.tsx        # Quote details / submission
│  ├─ reviews/
│  │   └─ page.tsx             # User reviews list or form
│  └─ settings/
│      └─ page.tsx             # Account/password settings

/components
│
├─ forms/
│   ├─ LoginForm.tsx
│   ├─ RegisterForm.tsx
│   ├─ NewQuoteForm.tsx
│   ├─ ContractorProfileForm.tsx
│   ├─ ProjectForm.tsx
│   └─ ReviewForm.tsx
│
├─ ui/
│   ├─ button.tsx              # Shadcn style button
│   ├─ input.tsx
│   ├─ textarea.tsx
│   ├─ select.tsx
│   ├─ modal.tsx
│   └─ card.tsx
│
├─ layout/
│   ├─ Sidebar.tsx
│   ├─ Navbar.tsx
│   └─ Breadcrumbs.tsx
│
├─ shared/
│   └─ Avatar.tsx
│   └─ Loader.tsx
│   └─ FileUpload.tsx

/lib/
│
├─ api.ts                     # API wrapper
├─ fetcher.ts                 # SWR/fetch utils
├─ auth.ts                    # session/token helpers
├─ formSchemas.ts             # Zod schemas
├─ constants.ts               # role constants, etc.

public/
│
├─ favicon.ico
├─ google-icon.svg
└─ github-icon.svg

/store/
│
├─ authStore.ts               # Zustand store for auth
├─ userStore.ts               # Profile / role / session
└─ quoteStore.ts              # Manage quote drafts etc.

/types/
│
├─ auth.d.ts
├─ user.d.ts
├─ quote.d.ts
└─ contractor.d.ts

/styles/
├─ globals.css                # Tailwind base
└─ tailwind.config.ts         # Theme setup
*/