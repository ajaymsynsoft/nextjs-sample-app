# NEXTJS Sample Application

## Getting started

### 1. Download example and install dependencies

Download this example:
Install npm dependencies:

```
npm install
```

### 2. Create and seed the database

Run the following command to create your SQLite database file. This also creates tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npm run prisma-migrate
```

When `npm run prisma-migrate` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

### 3. Start the REST API server

```
npm run dev
```
