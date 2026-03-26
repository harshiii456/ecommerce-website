// Simple admin database test
import { Sequelize, DataTypes } from 'sequelize';

const adminSequelize = new Sequelize(
  'ecommerce_admin',
  'root',
  '',
  {
    host: 'localhost',
    dialect: "mysql",
    logging: false
  }
);

const AdminUser = adminSequelize.define('AdminUser', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'admin'),
    defaultValue: 'admin'
  }
}, {
  tableName: 'admin_users',
  timestamps: false
});

async function testAdminDB() {
  try {
    console.log('🔧 Testing admin database connection...');
    await adminSequelize.authenticate();
    console.log('✅ Admin database connected!');
    
    await adminSequelize.sync({ force: true });
    console.log('✅ Admin models synced!');
    
    // Check if admin user exists
    const adminUser = await AdminUser.findOne({
      where: { email_id: 'admin@ecommerce.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found');
    } else {
      console.log('✅ Admin user found:', adminUser.email_id);
    }

    await adminSequelize.close();
    console.log('✅ Test completed');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminDB();
