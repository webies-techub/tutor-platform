/**
 * One-time migration: adds lesson_type, content, resource_path columns to the lessons table.
 * Run once: node backend/src/scripts/migrate_lesson_types.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const sequelize = require('../config/database');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const qi = sequelize.getQueryInterface();
    const { DataTypes } = require('sequelize');

    const tableDesc = await qi.describeTable('lessons');

    if (!tableDesc.lesson_type) {
      await qi.addColumn('lessons', 'lesson_type', {
        type: DataTypes.ENUM('video', 'text', 'image', 'resource'),
        allowNull: false,
        defaultValue: 'video',
        after: 'title',
      });
      console.log('Added: lesson_type');
    } else {
      console.log('Skipped: lesson_type (already exists)');
    }

    if (!tableDesc.content) {
      await qi.addColumn('lessons', 'content', {
        type: DataTypes.TEXT,
        allowNull: true,
        after: 'lesson_type',
      });
      console.log('Added: content');
    } else {
      console.log('Skipped: content (already exists)');
    }

    if (!tableDesc.resource_path) {
      await qi.addColumn('lessons', 'resource_path', {
        type: DataTypes.STRING(500),
        allowNull: true,
        after: 'video_path',
      });
      console.log('Added: resource_path');
    } else {
      console.log('Skipped: resource_path (already exists)');
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

run();
