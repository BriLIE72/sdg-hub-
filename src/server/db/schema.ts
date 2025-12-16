Index: src/server/db/schema.ts
===================================================================
--- src/server/db/schema.ts	original
+++ src/server/db/schema.ts	modified
@@ -175,4 +175,189 @@
   expiresAt: timestamp('expires_at'),
   active: boolean('active').default(true),
   createdAt: timestamp('created_at').defaultNow(),
 });
+
+// ============================================
+// CORE SYSTEM TABLES - Added for Production
+// ============================================
+
+// Ministries Table - Government ministries/departments
+export const ministries = mysqlTable('ministries', {
+  id: int('id').primaryKey().autoincrement(),
+  name: varchar('name', { length: 255 }).notNull(),
+  abbreviation: varchar('abbreviation', { length: 50 }).notNull(),
+  minister: varchar('minister', { length: 255 }),
+  budget: decimal('budget', { precision: 15, scale: 2 }),
+  budgetUtilized: decimal('budget_utilized', { precision: 15, scale: 2 }),
+  staff: int('staff'),
+  activeProjects: int('active_projects').default(0),
+  completedProjects: int('completed_projects').default(0),
+  performanceScore: decimal('performance_score', { precision: 5, scale: 2 }),
+  sdgFocus: json('sdg_focus').$type<string[]>(),
+  contactEmail: varchar('contact_email', { length: 255 }),
+  contactPhone: varchar('contact_phone', { length: 50 }),
+  website: varchar('website', { length: 255 }),
+  description: text('description'),
+  active: boolean('active').default(true),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// SDG Goals Table - Sustainable Development Goals tracking
+export const sdgGoals = mysqlTable('sdg_goals', {
+  id: int('id').primaryKey().autoincrement(),
+  goalNumber: int('goal_number').notNull().unique(),
+  title: varchar('title', { length: 255 }).notNull(),
+  description: text('description'),
+  currentProgress: decimal('current_progress', { precision: 5, scale: 2 }),
+  targetProgress: decimal('target_progress', { precision: 5, scale: 2 }).default(100),
+  trend: varchar('trend', { length: 20 }),
+  status: varchar('status', { length: 50 }),
+  totalPolicies: int('total_policies').default(0),
+  activePolicies: int('active_policies').default(0),
+  budget: decimal('budget', { precision: 15, scale: 2 }),
+  budgetUtilized: decimal('budget_utilized', { precision: 15, scale: 2 }),
+  lastUpdated: timestamp('last_updated').defaultNow(),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// SDG Targets Table - Specific targets for each SDG goal
+export const sdgTargets = mysqlTable('sdg_targets', {
+  id: int('id').primaryKey().autoincrement(),
+  goalId: int('goal_id').notNull().references(() => sdgGoals.id),
+  targetNumber: varchar('target_number', { length: 20 }).notNull(),
+  description: text('description').notNull(),
+  progress: decimal('progress', { precision: 5, scale: 2 }),
+  deadline: date('deadline'),
+  status: varchar('status', { length: 50 }),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// SDG Indicators Table - Measurable indicators for targets
+export const sdgIndicators = mysqlTable('sdg_indicators', {
+  id: int('id').primaryKey().autoincrement(),
+  targetId: int('target_id').notNull().references(() => sdgTargets.id),
+  indicatorNumber: varchar('indicator_number', { length: 20 }).notNull(),
+  description: text('description').notNull(),
+  currentValue: decimal('current_value', { precision: 15, scale: 2 }),
+  targetValue: decimal('target_value', { precision: 15, scale: 2 }),
+  unit: varchar('unit', { length: 50 }),
+  dataSource: varchar('data_source', { length: 255 }),
+  lastMeasured: date('last_measured'),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// Stakeholders Table - Organizations and individuals involved
+export const stakeholders = mysqlTable('stakeholders', {
+  id: int('id').primaryKey().autoincrement(),
+  name: varchar('name', { length: 255 }).notNull(),
+  organization: varchar('organization', { length: 255 }),
+  type: varchar('type', { length: 50 }),
+  role: varchar('role', { length: 100 }),
+  email: varchar('email', { length: 255 }),
+  phone: varchar('phone', { length: 50 }),
+  country: varchar('country', { length: 100 }),
+  sdgFocus: json('sdg_focus').$type<string[]>(),
+  engagementLevel: varchar('engagement_level', { length: 50 }),
+  lastContact: timestamp('last_contact'),
+  projectsInvolved: int('projects_involved').default(0),
+  contributionAmount: decimal('contribution_amount', { precision: 15, scale: 2 }),
+  satisfactionScore: decimal('satisfaction_score', { precision: 3, scale: 1 }),
+  active: boolean('active').default(true),
+  notes: text('notes'),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// Stakeholder Groups Table - Categories of stakeholders
+export const stakeholderGroups = mysqlTable('stakeholder_groups', {
+  id: int('id').primaryKey().autoincrement(),
+  name: varchar('name', { length: 255 }).notNull(),
+  category: varchar('category', { length: 100 }),
+  description: text('description'),
+  memberCount: int('member_count').default(0),
+  engagementScore: decimal('engagement_score', { precision: 5, scale: 2 }),
+  activeProjects: int('active_projects').default(0),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// Engagement Activities Table - Stakeholder engagement events
+export const engagementActivities = mysqlTable('engagement_activities', {
+  id: int('id').primaryKey().autoincrement(),
+  title: varchar('title', { length: 255 }).notNull(),
+  type: varchar('type', { length: 50 }).notNull(),
+  description: text('description'),
+  date: timestamp('date').notNull(),
+  location: varchar('location', { length: 255 }),
+  organizer: varchar('organizer', { length: 255 }),
+  stakeholderIds: json('stakeholder_ids').$type<number[]>(),
+  attendees: int('attendees'),
+  status: varchar('status', { length: 50 }),
+  outcome: text('outcome'),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// Feedback Requests Table - Requests for stakeholder feedback
+export const feedbackRequests = mysqlTable('feedback_requests', {
+  id: int('id').primaryKey().autoincrement(),
+  title: varchar('title', { length: 255 }).notNull(),
+  description: text('description'),
+  category: varchar('category', { length: 100 }),
+  priority: varchar('priority', { length: 50 }),
+  deadline: date('deadline'),
+  targetStakeholders: json('target_stakeholders').$type<number[]>(),
+  responsesReceived: int('responses_received').default(0),
+  status: varchar('status', { length: 50 }),
+  createdBy: int('created_by').references(() => users.id),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// Contact Submissions Table - Contact form submissions
+export const contactSubmissions = mysqlTable('contact_submissions', {
+  id: int('id').primaryKey().autoincrement(),
+  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
+  name: varchar('name', { length: 255 }).notNull(),
+  email: varchar('email', { length: 255 }).notNull(),
+  phone: varchar('phone', { length: 50 }),
+  category: varchar('category', { length: 100 }).notNull(),
+  subject: varchar('subject', { length: 255 }).notNull(),
+  message: text('message').notNull(),
+  status: varchar('status', { length: 50 }).default('pending'),
+  priority: varchar('priority', { length: 50 }).default('normal'),
+  assignedTo: int('assigned_to').references(() => users.id),
+  responseMessage: text('response_message'),
+  respondedAt: timestamp('responded_at'),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+});
+
+// Chatbot Conversations Table - AI chatbot conversation tracking
+export const chatbotConversations = mysqlTable('chatbot_conversations', {
+  id: int('id').primaryKey().autoincrement(),
+  conversationId: varchar('conversation_id', { length: 255 }).notNull().unique(),
+  userId: int('user_id').references(() => users.id),
+  sessionId: varchar('session_id', { length: 255 }),
+  startedAt: timestamp('started_at').defaultNow(),
+  lastMessageAt: timestamp('last_message_at').defaultNow(),
+  messageCount: int('message_count').default(0),
+  status: varchar('status', { length: 50 }).default('active'),
+  createdAt: timestamp('created_at').defaultNow(),
+});
+
+// Chatbot Messages Table - Individual chatbot messages
+export const chatbotMessages = mysqlTable('chatbot_messages', {
+  id: int('id').primaryKey().autoincrement(),
+  conversationId: varchar('conversation_id', { length: 255 }).notNull().references(() => chatbotConversations.conversationId),
+  sender: varchar('sender', { length: 20 }).notNull(),
+  message: text('message').notNull(),
+  intent: varchar('intent', { length: 100 }),
+  confidence: decimal('confidence', { precision: 5, scale: 2 }),
+  suggestions: json('suggestions').$type<string[]>(),
+  createdAt: timestamp('created_at').defaultNow(),
+});
