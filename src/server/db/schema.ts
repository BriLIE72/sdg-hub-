Index: src/server/db/schema.ts
===================================================================
--- src/server/db/schema.ts	original
+++ src/server/db/schema.ts	modified
@@ -1,599 +1,579 @@
-/**
- * Drizzle ORM schema for SDG Hub Platform
- * 
- * Database tables for policies, experts, pilot projects, and policy analysis
- */
+import { mysqlTable, varchar, text, int, timestamp, decimal, json, boolean } from 'drizzle-orm/mysql-core';
 
-import { mysqlTable, int, varchar, text, timestamp, decimal, json, boolean, uniqueIndex } from 'drizzle-orm/mysql-core';
+// ============================================
+// AUTHENTICATION & USERS
+// ============================================
 
-// Users Table - Authentication and user management
 export const users = mysqlTable('users', {
   id: int('id').primaryKey().autoincrement(),
   email: varchar('email', { length: 255 }).notNull().unique(),
   passwordHash: varchar('password_hash', { length: 255 }).notNull(),
   firstName: varchar('first_name', { length: 100 }).notNull(),
   lastName: varchar('last_name', { length: 100 }).notNull(),
   organization: varchar('organization', { length: 255 }),
-  role: varchar('role', { length: 50 }).default('user'), // user, admin, ministry, stakeholder
-  ministry: varchar('ministry', { length: 255 }),
+  role: varchar('role', { length: 50 }).notNull().default('user'), // user, admin, ministry, stakeholder
+  ministry: varchar('ministry', { length: 100 }),
   phone: varchar('phone', { length: 50 }),
   country: varchar('country', { length: 100 }),
   verified: boolean('verified').default(false),
   active: boolean('active').default(true),
   lastLogin: timestamp('last_login'),
   createdAt: timestamp('created_at').defaultNow(),
   updatedAt: timestamp('updated_at').defaultNow(),
-}, (table) => ({
-  emailIdx: uniqueIndex('email_idx').on(table.email),
-}));
+});
 
-// Policies Table - Global policy repository
+// ============================================
+// POLICY MANAGEMENT
+// ============================================
+
 export const policies = mysqlTable('policies', {
   id: int('id').primaryKey().autoincrement(),
-  country: varchar('country', { length: 100 }).notNull(),
-  sector: varchar('sector', { length: 100 }).notNull(),
-  year: int('year').notNull(),
-  title: varchar('title', { length: 255 }).notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
   description: text('description').notNull(),
-  outcomes: json('outcomes').$type<string[]>(),
-  sdgAlignment: json('sdg_alignment').$type<number[]>(),
+  ministry: varchar('ministry', { length: 100 }).notNull(),
+  sdgGoals: json('sdg_goals').$type<number[]>(),
+  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, active, completed, archived
+  priority: varchar('priority', { length: 50 }).notNull().default('medium'), // low, medium, high, critical
   budget: decimal('budget', { precision: 15, scale: 2 }),
-  beneficiaries: int('beneficiaries'),
-  successRate: int('success_rate'), // 0-100
-  adaptabilityScore: int('adaptability_score'), // 0-100
-  status: varchar('status', { length: 50 }).default('active'),
+  budgetUtilized: decimal('budget_utilized', { precision: 15, scale: 2 }),
+  startDate: timestamp('start_date'),
+  endDate: timestamp('end_date'),
+  targetBeneficiaries: int('target_beneficiaries'),
+  actualBeneficiaries: int('actual_beneficiaries'),
+  progressPercentage: int('progress_percentage').default(0),
+  performanceScore: decimal('performance_score', { precision: 5, scale: 2 }),
+  createdBy: int('created_by'),
   createdAt: timestamp('created_at').defaultNow(),
   updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Policy Analysis Table - AI-powered policy analysis results
 export const policyAnalysis = mysqlTable('policy_analysis', {
   id: int('id').primaryKey().autoincrement(),
   policyId: int('policy_id').notNull(),
-  impactScore: int('impact_score').notNull(), // 0-100
-  riskScore: int('risk_score').notNull(), // 0-100
-  feasibilityScore: int('feasibility_score').notNull(), // 0-100
-  aiRecommendations: json('ai_recommendations').$type<{
-    strengths: string[];
-    challenges: string[];
-    adaptations: string[];
-    timeline: string;
-  }>(),
-  localizedVersion: json('localized_version').$type<{
-    title: string;
-    description: string;
-    adaptations: string[];
-  }>(),
-  scenarioResults: json('scenario_results').$type<{
-    bestCase: { outcome: string; probability: number };
-    worstCase: { outcome: string; probability: number };
-    likelyCase: { outcome: string; probability: number };
-  }>(),
+  analysisType: varchar('analysis_type', { length: 100 }).notNull(), // impact, risk, cost-benefit, feasibility
+  findings: text('findings').notNull(),
+  recommendations: text('recommendations'),
+  score: decimal('score', { precision: 5, scale: 2 }),
+  analyzedBy: int('analyzed_by'),
+  analyzedAt: timestamp('analyzed_at').defaultNow(),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Experts Table - Global expert network
-export const experts = mysqlTable('experts', {
-  id: int('id').primaryKey().autoincrement(),
-  name: varchar('name', { length: 255 }).notNull(),
-  country: varchar('country', { length: 100 }).notNull(),
-  expertise: json('expertise').$type<string[]>().notNull(),
-  credentials: text('credentials').notNull(),
-  bio: text('bio'),
-  email: varchar('email', { length: 255 }).notNull(),
-  phone: varchar('phone', { length: 50 }),
-  languages: json('languages').$type<string[]>(),
-  availability: varchar('availability', { length: 50 }).default('available'), // available, limited, unavailable
-  rating: decimal('rating', { precision: 2, scale: 1 }).default('0.0'),
-  projectCount: int('project_count').default(0),
-  verified: boolean('verified').default(false),
-  createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow(),
-});
-
-// Pilot Projects Table - Track policy pilot implementations
-export const pilotProjects = mysqlTable('pilot_projects', {
-  id: int('id').primaryKey().autoincrement(),
-  policyId: int('policy_id').notNull(),
-  state: varchar('state', { length: 100 }).notNull(),
-  district: varchar('district', { length: 100 }),
-  status: varchar('status', { length: 50 }).notNull(), // planning, active, completed, paused
-  phase: varchar('phase', { length: 50 }).notNull(), // assessment, pilot, scale-up
-  startDate: timestamp('start_date').notNull(),
-  endDate: timestamp('end_date'),
-  budget: decimal('budget', { precision: 15, scale: 2 }).notNull(),
-  budgetUtilized: decimal('budget_utilized', { precision: 15, scale: 2 }).default('0.00'),
-  beneficiaries: int('beneficiaries').default(0),
-  outcomes: json('outcomes').$type<{
-    achieved: string[];
-    pending: string[];
-    challenges: string[];
-  }>(),
-  lessonsLearned: json('lessons_learned').$type<string[]>(),
-  metrics: json('metrics').$type<{
-    kpi: string;
-    target: number;
-    achieved: number;
-    unit: string;
-  }[]>(),
-  stakeholders: json('stakeholders').$type<{
-    name: string;
-    role: string;
-    organization: string;
-  }[]>(),
-  createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow(),
-});
-
-// Policy Votes Table - Track citizen voting on policies
 export const policyVotes = mysqlTable('policy_votes', {
   id: int('id').primaryKey().autoincrement(),
   policyId: int('policy_id').notNull(),
   userId: int('user_id').notNull(),
-  vote: varchar('vote', { length: 20 }).notNull(), // support, oppose
+  vote: varchar('vote', { length: 20 }).notNull(), // approve, reject, abstain
   comment: text('comment'),
-  createdAt: timestamp('created_at').defaultNow(),
+  votedAt: timestamp('voted_at').defaultNow(),
 });
 
-// Consultations Table - Track public consultations
 export const consultations = mysqlTable('consultations', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
+  policyId: int('policy_id').notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
   description: text('description').notNull(),
-  ministry: varchar('ministry', { length: 255 }).notNull(),
-  sdgGoal: int('sdg_goal').notNull(),
+  status: varchar('status', { length: 50 }).notNull().default('open'), // open, closed, analyzing
   startDate: timestamp('start_date').notNull(),
   endDate: timestamp('end_date').notNull(),
-  status: varchar('status', { length: 50 }).default('active'), // active, closed
+  targetAudience: json('target_audience').$type<string[]>(),
   responseCount: int('response_count').default(0),
+  createdBy: int('created_by'),
   createdAt: timestamp('created_at').defaultNow(),
   updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Consultation Responses Table - Store feedback from consultations
 export const consultationResponses = mysqlTable('consultation_responses', {
   id: int('id').primaryKey().autoincrement(),
   consultationId: int('consultation_id').notNull(),
   userId: int('user_id'),
-  role: varchar('role', { length: 100 }),
-  feedback: text('feedback').notNull(),
+  name: varchar('name', { length: 255 }),
+  email: varchar('email', { length: 255 }),
+  organization: varchar('organization', { length: 255 }),
+  response: text('response').notNull(),
   attachments: json('attachments').$type<string[]>(),
+  submittedAt: timestamp('submitted_at').defaultNow(),
+});
+
+export const experts = mysqlTable('experts', {
+  id: int('id').primaryKey().autoincrement(),
+  name: varchar('name', { length: 255 }).notNull(),
+  title: varchar('title', { length: 255 }).notNull(),
+  organization: varchar('organization', { length: 255 }).notNull(),
+  expertise: json('expertise').$type<string[]>(),
+  bio: text('bio'),
+  email: varchar('email', { length: 255 }),
+  phone: varchar('phone', { length: 50 }),
+  country: varchar('country', { length: 100 }),
+  availability: varchar('availability', { length: 50 }).default('available'), // available, busy, unavailable
+  rating: decimal('rating', { precision: 3, scale: 2 }),
+  consultationsCount: int('consultations_count').default(0),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// API Keys Table - Manage API access for researchers and developers
+export const pilotProjects = mysqlTable('pilot_projects', {
+  id: int('id').primaryKey().autoincrement(),
+  policyId: int('policy_id').notNull(),
+  name: varchar('name', { length: 500 }).notNull(),
+  description: text('description').notNull(),
+  location: varchar('location', { length: 255 }).notNull(),
+  status: varchar('status', { length: 50 }).notNull().default('planning'), // planning, active, completed, failed
+  startDate: timestamp('start_date'),
+  endDate: timestamp('end_date'),
+  budget: decimal('budget', { precision: 15, scale: 2 }),
+  participants: int('participants'),
+  successMetrics: json('success_metrics').$type<any>(),
+  results: text('results'),
+  createdBy: int('created_by'),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
+});
+
 export const apiKeys = mysqlTable('api_keys', {
   id: int('id').primaryKey().autoincrement(),
   userId: int('user_id').notNull(),
+  keyName: varchar('key_name', { length: 255 }).notNull(),
   keyHash: varchar('key_hash', { length: 255 }).notNull(),
-  name: varchar('name', { length: 255 }).notNull(),
   permissions: json('permissions').$type<string[]>(),
-  rateLimit: int('rate_limit').default(100), // requests per hour
-  requestCount: int('request_count').default(0),
-  lastUsed: timestamp('last_used'),
   expiresAt: timestamp('expires_at'),
+  lastUsed: timestamp('last_used'),
   active: boolean('active').default(true),
   createdAt: timestamp('created_at').defaultNow(),
 });
 
 // ============================================
-// CORE SYSTEM TABLES - Added for Production
+// CORE PLATFORM - MINISTRIES & SDGs
 // ============================================
 
-// Ministries Table - Government ministries/departments
 export const ministries = mysqlTable('ministries', {
   id: int('id').primaryKey().autoincrement(),
   name: varchar('name', { length: 255 }).notNull(),
-  abbreviation: varchar('abbreviation', { length: 50 }).notNull(),
+  code: varchar('code', { length: 50 }).notNull().unique(),
+  description: text('description'),
   minister: varchar('minister', { length: 255 }),
-  budget: decimal('budget', { precision: 15, scale: 2 }),
-  budgetUtilized: decimal('budget_utilized', { precision: 15, scale: 2 }),
-  staff: int('staff'),
-  activeProjects: int('active_projects').default(0),
-  completedProjects: int('completed_projects').default(0),
-  performanceScore: decimal('performance_score', { precision: 5, scale: 2 }),
-  sdgFocus: json('sdg_focus').$type<string[]>(),
   contactEmail: varchar('contact_email', { length: 255 }),
   contactPhone: varchar('contact_phone', { length: 50 }),
-  website: varchar('website', { length: 255 }),
-  description: text('description'),
+  website: varchar('website', { length: 500 }),
+  budgetAllocated: decimal('budget_allocated', { precision: 15, scale: 2 }),
+  budgetUtilized: decimal('budget_utilized', { precision: 15, scale: 2 }),
+  projectsCount: int('projects_count').default(0),
+  sdgFocus: json('sdg_focus').$type<number[]>(),
+  performanceScore: decimal('performance_score', { precision: 5, scale: 2 }),
   active: boolean('active').default(true),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// SDG Goals Table - Sustainable Development Goals tracking
 export const sdgGoals = mysqlTable('sdg_goals', {
   id: int('id').primaryKey().autoincrement(),
   goalNumber: int('goal_number').notNull().unique(),
-  title: varchar('title', { length: 255 }).notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
   description: text('description'),
-  currentProgress: decimal('current_progress', { precision: 5, scale: 2 }),
-  targetProgress: decimal('target_progress', { precision: 5, scale: 2 }).default(100),
-  trend: varchar('trend', { length: 20 }),
-  status: varchar('status', { length: 50 }),
-  totalPolicies: int('total_policies').default(0),
-  activePolicies: int('active_policies').default(0),
+  icon: varchar('icon', { length: 255 }),
+  color: varchar('color', { length: 50 }),
+  currentProgress: decimal('current_progress', { precision: 5, scale: 2 }).default('0'),
+  targetProgress: decimal('target_progress', { precision: 5, scale: 2 }).default('100'),
+  trend: varchar('trend', { length: 20 }).default('stable'), // improving, stable, declining
+  policiesCount: int('policies_count').default(0),
   budget: decimal('budget', { precision: 15, scale: 2 }),
-  budgetUtilized: decimal('budget_utilized', { precision: 15, scale: 2 }),
   lastUpdated: timestamp('last_updated').defaultNow(),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
 });
 
-// SDG Targets Table - Specific targets for each SDG goal
 export const sdgTargets = mysqlTable('sdg_targets', {
   id: int('id').primaryKey().autoincrement(),
-  goalId: int('goal_id').notNull().references(() => sdgGoals.id),
-  targetNumber: varchar('target_number', { length: 20 }).notNull(),
-  description: text('description').notNull(),
-  progress: decimal('progress', { precision: 5, scale: 2 }),
-  deadline: date('deadline'),
-  status: varchar('status', { length: 50 }),
+  goalId: int('goal_id').notNull(),
+  targetNumber: varchar('target_number', { length: 50 }).notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
+  description: text('description'),
+  currentProgress: decimal('current_progress', { precision: 5, scale: 2 }).default('0'),
+  targetProgress: decimal('target_progress', { precision: 5, scale: 2 }).default('100'),
+  deadline: timestamp('deadline'),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// SDG Indicators Table - Measurable indicators for targets
 export const sdgIndicators = mysqlTable('sdg_indicators', {
   id: int('id').primaryKey().autoincrement(),
-  targetId: int('target_id').notNull().references(() => sdgTargets.id),
-  indicatorNumber: varchar('indicator_number', { length: 20 }).notNull(),
-  description: text('description').notNull(),
+  targetId: int('target_id').notNull(),
+  indicatorNumber: varchar('indicator_number', { length: 50 }).notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
+  description: text('description'),
+  unit: varchar('unit', { length: 100 }),
   currentValue: decimal('current_value', { precision: 15, scale: 2 }),
   targetValue: decimal('target_value', { precision: 15, scale: 2 }),
-  unit: varchar('unit', { length: 50 }),
+  baseline: decimal('baseline', { precision: 15, scale: 2 }),
   dataSource: varchar('data_source', { length: 255 }),
-  lastMeasured: date('last_measured'),
+  lastMeasured: timestamp('last_measured'),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Stakeholders Table - Organizations and individuals involved
+// ============================================
+// STAKEHOLDER MANAGEMENT
+// ============================================
+
 export const stakeholders = mysqlTable('stakeholders', {
   id: int('id').primaryKey().autoincrement(),
   name: varchar('name', { length: 255 }).notNull(),
+  type: varchar('type', { length: 100 }).notNull(), // government, ngo, private, academic, citizen, international
   organization: varchar('organization', { length: 255 }),
-  type: varchar('type', { length: 50 }),
-  role: varchar('role', { length: 100 }),
-  email: varchar('email', { length: 255 }),
+  email: varchar('email', { length: 255 }).notNull(),
   phone: varchar('phone', { length: 50 }),
   country: varchar('country', { length: 100 }),
-  sdgFocus: json('sdg_focus').$type<string[]>(),
-  engagementLevel: varchar('engagement_level', { length: 50 }),
-  lastContact: timestamp('last_contact'),
-  projectsInvolved: int('projects_involved').default(0),
-  contributionAmount: decimal('contribution_amount', { precision: 15, scale: 2 }),
-  satisfactionScore: decimal('satisfaction_score', { precision: 3, scale: 1 }),
+  sector: varchar('sector', { length: 100 }),
+  interests: json('interests').$type<string[]>(),
+  engagementLevel: varchar('engagement_level', { length: 50 }).default('low'), // low, medium, high
+  verified: boolean('verified').default(false),
   active: boolean('active').default(true),
-  notes: text('notes'),
+  lastEngagement: timestamp('last_engagement'),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Stakeholder Groups Table - Categories of stakeholders
 export const stakeholderGroups = mysqlTable('stakeholder_groups', {
   id: int('id').primaryKey().autoincrement(),
   name: varchar('name', { length: 255 }).notNull(),
-  category: varchar('category', { length: 100 }),
   description: text('description'),
-  memberCount: int('member_count').default(0),
-  engagementScore: decimal('engagement_score', { precision: 5, scale: 2 }),
-  activeProjects: int('active_projects').default(0),
+  category: varchar('category', { length: 100 }).notNull(),
+  membersCount: int('members_count').default(0),
+  active: boolean('active').default(true),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Engagement Activities Table - Stakeholder engagement events
 export const engagementActivities = mysqlTable('engagement_activities', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  type: varchar('type', { length: 50 }).notNull(),
+  stakeholderId: int('stakeholder_id').notNull(),
+  activityType: varchar('activity_type', { length: 100 }).notNull(), // meeting, workshop, survey, consultation, event
+  title: varchar('title', { length: 500 }).notNull(),
   description: text('description'),
   date: timestamp('date').notNull(),
   location: varchar('location', { length: 255 }),
-  organizer: varchar('organizer', { length: 255 }),
-  stakeholderIds: json('stakeholder_ids').$type<number[]>(),
-  attendees: int('attendees'),
-  status: varchar('status', { length: 50 }),
-  outcome: text('outcome'),
+  status: varchar('status', { length: 50 }).default('scheduled'), // scheduled, completed, cancelled
+  participantsCount: int('participants_count'),
+  feedback: text('feedback'),
+  createdBy: int('created_by'),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Feedback Requests Table - Requests for stakeholder feedback
 export const feedbackRequests = mysqlTable('feedback_requests', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  description: text('description'),
-  category: varchar('category', { length: 100 }),
-  priority: varchar('priority', { length: 50 }),
-  deadline: date('deadline'),
-  targetStakeholders: json('target_stakeholders').$type<number[]>(),
-  responsesReceived: int('responses_received').default(0),
-  status: varchar('status', { length: 50 }),
-  createdBy: int('created_by').references(() => users.id),
+  stakeholderId: int('stakeholder_id').notNull(),
+  policyId: int('policy_id'),
+  requestType: varchar('request_type', { length: 100 }).notNull(),
+  subject: varchar('subject', { length: 500 }).notNull(),
+  message: text('message').notNull(),
+  priority: varchar('priority', { length: 50 }).default('medium'),
+  status: varchar('status', { length: 50 }).default('pending'), // pending, reviewed, responded, closed
+  response: text('response'),
+  respondedBy: int('responded_by'),
+  respondedAt: timestamp('responded_at'),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Contact Submissions Table - Contact form submissions
+// ============================================
+// COMMUNICATION
+// ============================================
+
 export const contactSubmissions = mysqlTable('contact_submissions', {
   id: int('id').primaryKey().autoincrement(),
   ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
   name: varchar('name', { length: 255 }).notNull(),
   email: varchar('email', { length: 255 }).notNull(),
   phone: varchar('phone', { length: 50 }),
   category: varchar('category', { length: 100 }).notNull(),
-  subject: varchar('subject', { length: 255 }).notNull(),
+  subject: varchar('subject', { length: 500 }).notNull(),
   message: text('message').notNull(),
-  status: varchar('status', { length: 50 }).default('pending'),
-  priority: varchar('priority', { length: 50 }).default('normal'),
-  assignedTo: int('assigned_to').references(() => users.id),
-  responseMessage: text('response_message'),
+  status: varchar('status', { length: 50 }).default('pending'), // pending, in-progress, resolved, closed
+  priority: varchar('priority', { length: 50 }).default('medium'),
+  assignedTo: int('assigned_to'),
+  response: text('response'),
   respondedAt: timestamp('responded_at'),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Chatbot Conversations Table - AI chatbot conversation tracking
 export const chatbotConversations = mysqlTable('chatbot_conversations', {
   id: int('id').primaryKey().autoincrement(),
-  conversationId: varchar('conversation_id', { length: 255 }).notNull().unique(),
-  userId: int('user_id').references(() => users.id),
+  conversationId: varchar('conversation_id', { length: 100 }).notNull().unique(),
+  userId: int('user_id'),
   sessionId: varchar('session_id', { length: 255 }),
-  startedAt: timestamp('started_at').defaultNow(),
-  lastMessageAt: timestamp('last_message_at').defaultNow(),
+  status: varchar('status', { length: 50 }).default('active'), // active, closed
   messageCount: int('message_count').default(0),
-  status: varchar('status', { length: 50 }).default('active'),
+  lastMessageAt: timestamp('last_message_at'),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Chatbot Messages Table - Individual chatbot messages
 export const chatbotMessages = mysqlTable('chatbot_messages', {
   id: int('id').primaryKey().autoincrement(),
-  conversationId: varchar('conversation_id', { length: 255 }).notNull().references(() => chatbotConversations.conversationId),
-  sender: varchar('sender', { length: 20 }).notNull(),
+  conversationId: varchar('conversation_id', { length: 100 }).notNull(),
+  sender: varchar('sender', { length: 20 }).notNull(), // user, bot
   message: text('message').notNull(),
   intent: varchar('intent', { length: 100 }),
   confidence: decimal('confidence', { precision: 5, scale: 2 }),
-  suggestions: json('suggestions').$type<string[]>(),
+  metadata: json('metadata').$type<any>(),
   createdAt: timestamp('created_at').defaultNow(),
 });
 
-// Knowledge Center Tables
+// ============================================
+// KNOWLEDGE CENTER
+// ============================================
+
 export const courses = mysqlTable('courses', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  description: text('description'),
-  instructor: varchar('instructor', { length: 255 }),
+  title: varchar('title', { length: 500 }).notNull(),
+  description: text('description').notNull(),
+  category: varchar('category', { length: 100 }).notNull(),
+  level: varchar('level', { length: 50 }).notNull(), // beginner, intermediate, advanced
   duration: varchar('duration', { length: 100 }),
-  level: varchar('level', { length: 50 }),
-  category: varchar('category', { length: 100 }),
+  instructor: varchar('instructor', { length: 255 }),
+  thumbnail: varchar('thumbnail', { length: 500 }),
+  enrollmentCount: int('enrollment_count').default(0),
   rating: decimal('rating', { precision: 3, scale: 2 }),
-  reviews: int('reviews').default(0),
-  enrolled: int('enrolled').default(0),
-  certificate: boolean('certificate').default(false),
-  sdgs: json('sdgs').$type<number[]>(),
-  imageUrl: varchar('image_url', { length: 500 }),
-  status: varchar('status', { length: 50 }).default('active'),
+  status: varchar('status', { length: 50 }).default('active'), // active, draft, archived
+  sdgGoals: json('sdg_goals').$type<number[]>(),
   createdAt: timestamp('created_at').defaultNow(),
-  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const articles = mysqlTable('articles', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
+  content: text('content').notNull(),
   excerpt: text('excerpt'),
-  content: text('content'),
-  author: varchar('author', { length: 255 }),
-  category: varchar('category', { length: 100 }),
-  readTime: varchar('read_time', { length: 50 }),
+  author: varchar('author', { length: 255 }).notNull(),
+  category: varchar('category', { length: 100 }).notNull(),
+  tags: json('tags').$type<string[]>(),
+  thumbnail: varchar('thumbnail', { length: 500 }),
+  readTime: int('read_time'), // in minutes
   views: int('views').default(0),
-  likes: int('likes').default(0),
-  sdgs: json('sdgs').$type<number[]>(),
-  imageUrl: varchar('image_url', { length: 500 }),
-  publishedAt: timestamp('published_at').defaultNow(),
+  status: varchar('status', { length: 50 }).default('published'), // draft, published, archived
+  publishedAt: timestamp('published_at'),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const videos = mysqlTable('videos', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
   description: text('description'),
-  speaker: varchar('speaker', { length: 255 }),
-  duration: varchar('duration', { length: 50 }),
-  category: varchar('category', { length: 100 }),
+  url: varchar('url', { length: 500 }).notNull(),
+  thumbnail: varchar('thumbnail', { length: 500 }),
+  duration: int('duration'), // in seconds
+  category: varchar('category', { length: 100 }).notNull(),
+  tags: json('tags').$type<string[]>(),
   views: int('views').default(0),
-  likes: int('likes').default(0),
-  sdgs: json('sdgs').$type<number[]>(),
-  videoUrl: varchar('video_url', { length: 500 }),
-  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
-  publishedAt: timestamp('published_at').defaultNow(),
+  status: varchar('status', { length: 50 }).default('published'),
+  publishedAt: timestamp('published_at'),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const webinars = mysqlTable('webinars', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  description: text('description'),
-  speaker: varchar('speaker', { length: 255 }),
-  date: timestamp('date'),
-  duration: varchar('duration', { length: 50 }),
-  category: varchar('category', { length: 100 }),
-  registered: int('registered').default(0),
-  capacity: int('capacity'),
-  status: varchar('status', { length: 50 }).default('upcoming'),
-  sdgs: json('sdgs').$type<number[]>(),
+  title: varchar('title', { length: 500 }).notNull(),
+  description: text('description').notNull(),
+  speaker: varchar('speaker', { length: 255 }).notNull(),
+  speakerBio: text('speaker_bio'),
+  date: timestamp('date').notNull(),
+  duration: int('duration'), // in minutes
+  registrationUrl: varchar('registration_url', { length: 500 }),
   meetingUrl: varchar('meeting_url', { length: 500 }),
+  maxParticipants: int('max_participants'),
+  registeredCount: int('registered_count').default(0),
+  status: varchar('status', { length: 50 }).default('upcoming'), // upcoming, live, completed, cancelled
   recordingUrl: varchar('recording_url', { length: 500 }),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const researchPapers = mysqlTable('research_papers', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  abstract: text('abstract'),
+  title: varchar('title', { length: 500 }).notNull(),
+  abstract: text('abstract').notNull(),
   authors: json('authors').$type<string[]>(),
-  category: varchar('category', { length: 100 }),
+  category: varchar('category', { length: 100 }).notNull(),
+  keywords: json('keywords').$type<string[]>(),
+  fileUrl: varchar('file_url', { length: 500 }),
+  doi: varchar('doi', { length: 255 }),
   citations: int('citations').default(0),
   downloads: int('downloads').default(0),
-  sdgs: json('sdgs').$type<number[]>(),
-  pdfUrl: varchar('pdf_url', { length: 500 }),
-  publishedYear: int('published_year'),
-  journal: varchar('journal', { length: 255 }),
+  publishedDate: timestamp('published_date'),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const enrollments = mysqlTable('enrollments', {
   id: int('id').primaryKey().autoincrement(),
-  courseId: int('course_id').notNull().references(() => courses.id),
-  userId: int('user_id').references(() => users.id),
-  name: varchar('name', { length: 255 }).notNull(),
-  email: varchar('email', { length: 255 }).notNull(),
-  organization: varchar('organization', { length: 255 }),
-  status: varchar('status', { length: 50 }).default('enrolled'),
-  progress: int('progress').default(0),
-  enrolledAt: timestamp('enrolled_at').defaultNow(),
+  userId: int('user_id').notNull(),
+  courseId: int('course_id').notNull(),
+  status: varchar('status', { length: 50 }).default('enrolled'), // enrolled, in-progress, completed, dropped
+  progress: int('progress').default(0), // percentage
   completedAt: timestamp('completed_at'),
+  certificateUrl: varchar('certificate_url', { length: 500 }),
+  enrolledAt: timestamp('enrolled_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// International Cooperation Tables
+// ============================================
+// INTERNATIONAL COOPERATION
+// ============================================
+
 export const internationalPartners = mysqlTable('international_partners', {
   id: int('id').primaryKey().autoincrement(),
   name: varchar('name', { length: 255 }).notNull(),
-  type: varchar('type', { length: 100 }),
-  country: varchar('country', { length: 100 }),
+  type: varchar('type', { length: 100 }).notNull(), // government, un-agency, ngo, development-bank, foundation
+  country: varchar('country', { length: 100 }).notNull(),
   region: varchar('region', { length: 100 }),
   description: text('description'),
-  focusAreas: json('focus_areas').$type<string[]>(),
-  sdgs: json('sdgs').$type<number[]>(),
-  activeProjects: int('active_projects').default(0),
-  totalFunding: decimal('total_funding', { precision: 15, scale: 2 }),
+  logo: varchar('logo', { length: 500 }),
   website: varchar('website', { length: 500 }),
+  contactPerson: varchar('contact_person', { length: 255 }),
   contactEmail: varchar('contact_email', { length: 255 }),
-  logoUrl: varchar('logo_url', { length: 500 }),
-  status: varchar('status', { length: 50 }).default('active'),
-  partnerSince: timestamp('partner_since'),
+  contactPhone: varchar('contact_phone', { length: 50 }),
+  focusAreas: json('focus_areas').$type<string[]>(),
+  sdgGoals: json('sdg_goals').$type<number[]>(),
+  partnershipStatus: varchar('partnership_status', { length: 50 }).default('active'), // active, pending, inactive
+  projectsCount: int('projects_count').default(0),
+  fundingCommitted: decimal('funding_committed', { precision: 15, scale: 2 }),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const internationalProjects = mysqlTable('international_projects', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  description: text('description'),
-  partnerId: int('partner_id').references(() => internationalPartners.id),
-  countries: json('countries').$type<string[]>(),
-  sdgs: json('sdgs').$type<number[]>(),
+  partnerId: int('partner_id').notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
+  description: text('description').notNull(),
+  category: varchar('category', { length: 100 }).notNull(),
+  status: varchar('status', { length: 50 }).default('active'), // planning, active, completed, suspended
   budget: decimal('budget', { precision: 15, scale: 2 }),
-  status: varchar('status', { length: 50 }).default('active'),
-  progress: int('progress').default(0),
+  fundingSource: varchar('funding_source', { length: 255 }),
   startDate: timestamp('start_date'),
   endDate: timestamp('end_date'),
+  progress: int('progress').default(0),
   beneficiaries: int('beneficiaries'),
-  outcomes: json('outcomes').$type<string[]>(),
+  sdgGoals: json('sdg_goals').$type<number[]>(),
+  outcomes: text('outcomes'),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const fundingOpportunities = mysqlTable('funding_opportunities', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  description: text('description'),
-  provider: varchar('provider', { length: 255 }),
+  partnerId: int('partner_id').notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
+  description: text('description').notNull(),
+  fundingType: varchar('funding_type', { length: 100 }).notNull(), // grant, loan, technical-assistance
   amount: decimal('amount', { precision: 15, scale: 2 }),
   currency: varchar('currency', { length: 10 }).default('USD'),
-  category: varchar('category', { length: 100 }),
-  sdgs: json('sdgs').$type<number[]>(),
-  eligibility: json('eligibility').$type<string[]>(),
-  deadline: timestamp('deadline'),
+  eligibility: text('eligibility'),
+  applicationDeadline: timestamp('application_deadline'),
   applicationUrl: varchar('application_url', { length: 500 }),
-  status: varchar('status', { length: 50 }).default('open'),
-  applications: int('applications').default(0),
+  focusAreas: json('focus_areas').$type<string[]>(),
+  sdgGoals: json('sdg_goals').$type<number[]>(),
+  status: varchar('status', { length: 50 }).default('open'), // open, closed, awarded
+  applicationsCount: int('applications_count').default(0),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Public Transparency Tables
+// ============================================
+// PUBLIC TRANSPARENCY
+// ============================================
+
 export const publicDocuments = mysqlTable('public_documents', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
+  title: varchar('title', { length: 500 }).notNull(),
   description: text('description'),
-  category: varchar('category', { length: 100 }),
-  ministry: varchar('ministry', { length: 255 }),
-  documentType: varchar('document_type', { length: 100 }),
+  category: varchar('category', { length: 100 }).notNull(), // policy, budget, report, legislation, minutes
+  ministry: varchar('ministry', { length: 100 }),
   fileUrl: varchar('file_url', { length: 500 }),
-  fileSize: varchar('file_size', { length: 50 }),
-  downloads: int('downloads').default(0),
+  fileType: varchar('file_type', { length: 50 }),
+  fileSize: int('file_size'), // in bytes
   publishedDate: timestamp('published_date'),
-  sdgs: json('sdgs').$type<number[]>(),
-  status: varchar('status', { length: 50 }).default('published'),
+  version: varchar('version', { length: 50 }),
+  tags: json('tags').$type<string[]>(),
+  downloads: int('downloads').default(0),
+  views: int('views').default(0),
+  status: varchar('status', { length: 50 }).default('published'), // draft, published, archived
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const datasets = mysqlTable('datasets', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  description: text('description'),
-  category: varchar('category', { length: 100 }),
-  format: varchar('format', { length: 50 }),
-  size: varchar('size', { length: 50 }),
-  records: int('records'),
-  downloads: int('downloads').default(0),
-  lastUpdated: timestamp('last_updated'),
-  updateFrequency: varchar('update_frequency', { length: 100 }),
-  dataUrl: varchar('data_url', { length: 500 }),
+  title: varchar('title', { length: 500 }).notNull(),
+  description: text('description').notNull(),
+  category: varchar('category', { length: 100 }).notNull(),
+  ministry: varchar('ministry', { length: 100 }),
+  format: varchar('format', { length: 50 }).notNull(), // csv, json, xml, excel
+  fileUrl: varchar('file_url', { length: 500 }),
   apiEndpoint: varchar('api_endpoint', { length: 500 }),
-  sdgs: json('sdgs').$type<number[]>(),
-  license: varchar('license', { length: 255 }),
+  updateFrequency: varchar('update_frequency', { length: 100 }),
+  lastUpdated: timestamp('last_updated'),
+  recordsCount: int('records_count'),
+  downloads: int('downloads').default(0),
+  license: varchar('license', { length: 100 }),
+  tags: json('tags').$type<string[]>(),
+  status: varchar('status', { length: 50 }).default('published'),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const citizenFeedback = mysqlTable('citizen_feedback', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  description: text('description'),
-  category: varchar('category', { length: 100 }),
-  ministry: varchar('ministry', { length: 255 }),
-  submittedBy: varchar('submitted_by', { length: 255 }),
+  name: varchar('name', { length: 255 }),
   email: varchar('email', { length: 255 }),
-  location: varchar('location', { length: 255 }),
+  phone: varchar('phone', { length: 50 }),
+  category: varchar('category', { length: 100 }).notNull(),
+  subject: varchar('subject', { length: 500 }).notNull(),
+  message: text('message').notNull(),
+  policyId: int('policy_id'),
+  ministry: varchar('ministry', { length: 100 }),
+  sentiment: varchar('sentiment', { length: 50 }), // positive, neutral, negative
   priority: varchar('priority', { length: 50 }).default('medium'),
-  status: varchar('status', { length: 50 }).default('submitted'),
-  votes: int('votes').default(0),
-  comments: int('comments').default(0),
-  sdgs: json('sdgs').$type<number[]>(),
-  attachments: json('attachments').$type<string[]>(),
-  submittedAt: timestamp('submitted_at').defaultNow(),
-  resolvedAt: timestamp('resolved_at'),
+  status: varchar('status', { length: 50 }).default('submitted'), // submitted, reviewed, responded, closed
+  response: text('response'),
+  respondedBy: int('responded_by'),
+  respondedAt: timestamp('responded_at'),
+  createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
-// Implementation Toolkit Tables
+// ============================================
+// IMPLEMENTATION TOOLKIT
+// ============================================
+
 export const resources = mysqlTable('resources', {
   id: int('id').primaryKey().autoincrement(),
-  title: varchar('title', { length: 255 }).notNull(),
-  description: text('description'),
-  category: varchar('category', { length: 100 }),
-  type: varchar('type', { length: 50 }),
-  format: varchar('format', { length: 50 }),
+  title: varchar('title', { length: 500 }).notNull(),
+  description: text('description').notNull(),
+  category: varchar('category', { length: 100 }).notNull(), // template, guide, toolkit, checklist, case-study
+  type: varchar('type', { length: 50 }).notNull(), // pdf, doc, excel, ppt, video, link
   fileUrl: varchar('file_url', { length: 500 }),
-  fileSize: varchar('file_size', { length: 50 }),
+  fileSize: int('file_size'),
+  thumbnail: varchar('thumbnail', { length: 500 }),
+  tags: json('tags').$type<string[]>(),
+  sdgGoals: json('sdg_goals').$type<number[]>(),
   downloads: int('downloads').default(0),
+  views: int('views').default(0),
   rating: decimal('rating', { precision: 3, scale: 2 }),
-  reviews: int('reviews').default(0),
-  sdgs: json('sdgs').$type<number[]>(),
-  author: varchar('author', { length: 255 }),
-  lastUpdated: timestamp('last_updated').defaultNow(),
-  status: varchar('status', { length: 50 }).default('active'),
+  status: varchar('status', { length: 50 }).default('published'),
   createdAt: timestamp('created_at').defaultNow(),
+  updatedAt: timestamp('updated_at').defaultNow(),
 });
 
 export const resourceDownloads = mysqlTable('resource_downloads', {
   id: int('id').primaryKey().autoincrement(),
-  resourceId: int('resource_id').notNull().references(() => resources.id),
-  userId: int('user_id').references(() => users.id),
-  userEmail: varchar('user_email', { length: 255 }),
-  userName: varchar('user_name', { length: 255 }),
-  organization: varchar('organization', { length: 255 }),
-  purpose: text('purpose'),
+  resourceId: int('resource_id').notNull(),
+  userId: int('user_id'),
+  ipAddress: varchar('ip_address', { length: 50 }),
+  userAgent: varchar('user_agent', { length: 500 }),
   downloadedAt: timestamp('downloaded_at').defaultNow(),
 });
