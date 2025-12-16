Index: src/server/db/schema.ts
===================================================================
--- src/server/db/schema.ts	original
+++ src/server/db/schema.ts	modified
@@ -3,10 +3,31 @@
  * 
  * Database tables for policies, experts, pilot projects, and policy analysis
  */
 
-import { mysqlTable, int, varchar, text, timestamp, decimal, json, boolean } from 'drizzle-orm/mysql-core';
+import { mysqlTable, int, varchar, text, timestamp, decimal, json, boolean, uniqueIndex } from 'drizzle-orm/mysql-core';
 
+// Users Table - Authentication and user management
+export const users = mysqlTable('users', {
+  id: int('id').primaryKey().autoincrement(),
+  email: varchar('email', { length: 255 }).notNull().unique(),
+  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
+  firstName: varchar('first_name', { length: 100 }).notNull(),
+  lastName: varchar('last_name', { length: 100 }).notNull(),
+  organization: varchar('organization', { length: 255 }),
+  role: varchar('role', { length: 50 }).default('user'), // user, admin, ministry, stakeholder
+  ministry: varchar('ministry', { length: 255 }),
+  phone: varchar('phone', { length: 50 }),
+  country: varchar('country', { length: 100 }),
+  verified: boolean('verified').default(false),
+  active: boolean('active').default(true),
+  lastLogin: timestamp('last_login'),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
+}, (table) => ({
+  emailIdx: uniqueIndex('email_idx').on(table.email),
+}));
+
 // Policies Table - Global policy repository
 export const policies = mysqlTable('policies', {
   id: int('id').primaryKey().autoincrement(),
   country: varchar('country', { length: 100 }).notNull(),
