## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

we can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## System Overview
2.1 User Roles
Employee: Can sign up, login, request software access
Manager: Can view and approve/reject access requests
Admin: Can create software, has full access

2.2 Functionalities
Sign-Up / Login with JWT
Role-based redirection
Software management (Admin only)
Request access to software (Employee)
Approve/reject requests (Manager)

I have implemented with Next.js, Tailwind, Typescript, PrismaORM, PostgresSQL.
