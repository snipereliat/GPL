const fs = require('fs');
const path = require('path');

// مسار المجلد الذي يحتوي على ملفات الـ GLB (التي تظهر في صورتك)
const targetDir = __dirname; 
const animationsJsPath = path.join(__dirname, 'animations_auto.js');

let dictionaryCode = `// Auto-generated clean dictionary\n`;
dictionaryCode += `export const dictionary = {\n    // Add Arabic words here\n};\n\n`;
dictionaryCode += `export const animationAssets = {\n    idle: require("../assets/avatar.glb"),\n`;

const files = fs.readdirSync(targetDir);
let processedCount = 0;

console.log(`🚀 Starting smart renaming process...\n`);

files.forEach(file => {
    if (file.endsWith('.glb') && file !== 'avatar.glb') {
        
        // 🧠 السحر هنا: استخدام Regex لحذف التاريخ (مثال: _2024-9-3)
        // يبحث عن: شرطة سفلية، 4 أرقام، شرطة، رقم أو رقمين، شرطة، رقم أو رقمين
        let cleanName = file.replace(/_\d{4}-\d{1,2}-\d{1,2}/, '').replace('.glb', '');

        // المسار القديم والمسار الجديد للملف
        const oldPath = path.join(targetDir, file);
        const newFileName = `${cleanName}.glb`;
        const newPath = path.join(targetDir, newFileName);

        try {
            // إعادة تسمية الملف في نظام التشغيل
            if (oldPath !== newPath) {
                fs.renameSync(oldPath, newPath);
            }

            // إضافة الاسم النظيف إلى كود React Native
            // افترضنا أنك ستضعها لاحقاً داخل مجلد assets/assets_glb
            dictionaryCode += `    ${cleanName}: require("../assets/assets_glb/${newFileName}"),\n`;
            
            console.log(`✅ Renamed: ${file}  --->  ${newFileName}`);
            processedCount++;

        } catch (error) {
            console.error(`❌ Error renaming ${file}:`, error.message);
        }
    }
});

dictionaryCode += `};\n`;
fs.writeFileSync(animationsJsPath, dictionaryCode);

console.log(`\n🎉 Success! ${processedCount} files have been cleanly renamed and the dictionary is generated.`);