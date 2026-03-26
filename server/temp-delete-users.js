// Temporary script to delete all users
// Run this while server is running
import axios from 'axios';

async function deleteAllUsers() {
  try {
    console.log('Deleting all users via API...');
    const response = await axios.delete('http://localhost:8000/api/v1/user/admin/delete-all', {
      withCredentials: true
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

deleteAllUsers();
