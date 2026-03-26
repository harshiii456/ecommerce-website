import models from './database/models/index.js';

async function deleteAllUsers() {
  try {
    console.log('Deleting all users...');
    const result = await models.User.destroy({
      where: {},
      truncate: true // This will reset the auto-increment counter
    });
    
    console.log(`Deleted ${result} users successfully!`);
    
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}

deleteAllUsers();
