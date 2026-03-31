import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_DIR = path.join(__dirname, 'public', 'images', 'grocery');

// Create directory if it doesn't exist
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
    console.log('Created directory:', IMAGE_DIR);
}

// Grocery product images with local filenames
const groceryImages = [
    {
        url: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80&w=400',
        filename: 'fresh_apples.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1543286986-2eeaea38f5be?auto=format&fit=crop&q=80&w=400',
        filename: 'organic_bananas.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1546470427-e93b1c429b19?auto=format&fit=crop&q=80&w=400',
        filename: 'fresh_tomatoes.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1574233323939-0c05321ed5a9?auto=format&fit=crop&q=80&w=400',
        filename: 'organic_spinach.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&q=80&w=400',
        filename: 'fresh_carrots.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
        filename: 'fresh_milk.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
        filename: 'greek_yogurt.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1518569656558-1f25e69edd93?auto=format&fit=crop&q=80&w=400',
        filename: 'farm_fresh_eggs.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1486477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
        filename: 'cheddar_cheese.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1586201375761-83865002e8c5?auto=format&fit=crop&q=80&w=400',
        filename: 'butter.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1536304078424-3e1a8c5dc33c?auto=format&fit=crop&q=80&w=400',
        filename: 'basmati_rice.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400',
        filename: 'whole_wheat_bread.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=400',
        filename: 'oats.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1528645652321-e1e895a5bb8a?auto=format&fit=crop&q=80&w=400',
        filename: 'pasta.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1544484959-80ea005bee46?auto=format&fit=crop&q=80&w=400',
        filename: 'quinoa.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400',
        filename: 'orange_juice.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1576092768247-dc3b8ec5c5a7?auto=format&fit=crop&q=80&w=400',
        filename: 'green_tea.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400',
        filename: 'coffee_beans.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1548839148-1a0b5d5e5d71?auto=format&fit=crop&q=80&w=400',
        filename: 'mineral_water.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?auto=format&fit=crop&q=80&w=400',
        filename: 'coconut_water.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb3?auto=format&fit=crop&q=80&w=400',
        filename: 'mixed_nuts.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1548701934-344f0e3efe1c?auto=format&fit=crop&q=80&w=400',
        filename: 'dark_chocolate.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1558800745-6e78d6f4e6d7?auto=format&fit=crop&q=80&w=400',
        filename: 'honey.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1478369402113-1fd53f17e8b4?auto=format&fit=crop&q=80&w=400',
        filename: 'olive_oil.jpg'
    },
    {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400',
        filename: 'sea_salt.jpg'
    }
];

// Download images function
const downloadImage = async (url, filename) => {
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const filepath = path.join(IMAGE_DIR, filename);
        
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`✅ Downloaded: ${filename}`);
                resolve(filepath);
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ Failed to download ${filename}:`, error.message);
        throw error;
    }
};

// Download all images
const downloadAllImages = async () => {
    console.log('🖼️  Downloading grocery product images...\n');
    
    let successCount = 0;
    for (const image of groceryImages) {
        try {
            await downloadImage(image.url, image.filename);
            successCount++;
        } catch (error) {
            console.error(`Failed to download ${image.filename}`);
        }
    }
    
    console.log(`\n🎉 SUCCESS: ${successCount}/${groceryImages.length} images downloaded!`);
    console.log(`📁 Images saved to: ${IMAGE_DIR}`);
    
    // Generate updated SQL with local paths
    console.log('\n📝 Updated SQL paths for local images:');
    groceryImages.forEach(image => {
        console.log(`${image.filename}: /images/grocery/${image.filename}`);
    });
};

// Run the download
downloadAllImages().catch(console.error);
