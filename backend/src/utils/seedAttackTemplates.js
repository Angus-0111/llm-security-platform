const mongoose = require('mongoose');
const AttackData = require('../models/AttackData');
const attackTemplates = require('./attackTemplates');

require('dotenv').config();

// Connect to database
const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/llm-security-platform';
    await mongoose.connect(mongoURI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Seed attack templates
const seedAttackTemplates = async () => {
  try {
    console.log('Starting to seed attack templates...');
    
    // Clear existing templates (optional - comment out if you want to keep existing ones)
    // await AttackData.deleteMany({});
    // console.log('Cleared existing attack templates');
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const template of attackTemplates) {
      // Check if template already exists
      const existing = await AttackData.findOne({
        name: template.name,
        attackType: template.attackType,
        educationScenario: template.educationScenario
      });
      
      if (existing) {
        console.log(`Template "${template.name}" already exists, skipping...`);
        skippedCount++;
        continue;
      }
      
      // Create new attack template
      const attackData = new AttackData({
        ...template,
        results: {
          totalAttempts: 0,
          successfulAttempts: 0,
          successRate: 0
        },
        metadata: {
          createdBy: 'system',
          source: 'template',
          version: '1.0',
          isTemplate: true
        }
      });
      
      await attackData.save();
      console.log(`Created template: "${template.name}" (${template.attackType})`);
      createdCount++;
    }
    
    console.log(`\nSeeding completed!`);
    console.log(`Created: ${createdCount} templates`);
    console.log(`Skipped: ${skippedCount} existing templates`);
    console.log(`Total: ${createdCount + skippedCount} templates`);
    
  } catch (error) {
    console.error('Error seeding attack templates:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};

// Run the seeding
if (require.main === module) {
  connectDatabase().then(() => {
    seedAttackTemplates();
  });
}

module.exports = { seedAttackTemplates };
