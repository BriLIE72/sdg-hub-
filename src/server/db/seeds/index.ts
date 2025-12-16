Index: src/server/db/seeds/index.ts
===================================================================
--- src/server/db/seeds/index.ts	non-existent
+++ src/server/db/seeds/index.ts	new file
@@ -0,0 +1,36 @@
+import { seedCoreData } from './01-core-data.js';
+import { seedStakeholdersAndResources } from './02-stakeholders-resources.js';
+
+async function runSeeds() {
+  console.log('🌱 Starting database seeding...\n');
+
+  try {
+    // Run seed scripts in order
+    await seedCoreData();
+    console.log('');
+    await seedStakeholdersAndResources();
+    
+    console.log('\n✅ All seed data has been successfully inserted!');
+    console.log('\n📊 Summary:');
+    console.log('  - 10 Ministries');
+    console.log('  - 17 SDG Goals');
+    console.log('  - 6 SDG Targets');
+    console.log('  - 3 SDG Indicators');
+    console.log('  - 6 Stakeholder Groups');
+    console.log('  - 6 Stakeholders');
+    console.log('  - 4 Resources');
+    console.log('  - 3 Courses');
+    console.log('  - 3 Articles');
+    console.log('  - 2 Videos');
+    console.log('  - 3 International Partners');
+    console.log('  - 3 Public Documents');
+    console.log('\n🎉 Database is now ready for production use!');
+    
+    process.exit(0);
+  } catch (error) {
+    console.error('❌ Error seeding database:', error);
+    process.exit(1);
+  }
+}
+
+runSeeds();
