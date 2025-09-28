// MongoDB initialization script
db = db.getSiblingDB('llm-security-platform');

// Create app user
db.createUser({
  user: 'app_user',
  pwd: 'app_password_123',
  roles: [
    {
      role: 'readWrite',
      db: 'llm-security-platform'
    }
  ]
});

// Create indexes for better query performance
db.llmresponses.createIndex({ "createdAt": -1 });
db.llmresponses.createIndex({ "attackType": 1 });
db.llmresponses.createIndex({ "educationScenario": 1 });
db.llmresponses.createIndex({ "attackSuccess.isSuccessful": 1 });

db.attackdata.createIndex({ "attackType": 1 });
db.attackdata.createIndex({ "educationScenario": 1 });
db.attackdata.createIndex({ "status": 1 });

db.riskassessments.createIndex({ "assessmentDate": -1 });
db.riskassessments.createIndex({ "attackId": 1 });

db.newsincidents.createIndex({ "createdAt": -1 });
db.newsincidents.createIndex({ "severity.level": 1 });
db.newsincidents.createIndex({ "category": 1 });

db.knowledgebase.createIndex({ "category": 1 });
db.knowledgebase.createIndex({ "status": 1 });
db.knowledgebase.createIndex({ "accessControl.isPublic": 1 });

db.reports.createIndex({ "generatedAt": -1 });
db.reports.createIndex({ "reportType": 1 });

print('Database initialized successfully');
