const fs = require('fs');
const path = require('path');

const officialDir = path.join(__dirname, '../official');
const communityDir = path.join(__dirname, '../community');
const outputFile = path.join(__dirname, '../presets.json');

let allPresets = [];

function loadPresetsFromDir(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        if (file.endsWith('.json')) {
            try {
                const content = fs.readFileSync(path.join(directory, file), 'utf-8');
                const preset = JSON.parse(content);
                allPresets.push(preset);
                console.log(`[+] Added: ${preset.name} (${file})`);
            } catch (err) {
                console.error(`[!] Error: ${file} could not be parsed. Invalid JSON!`, err);
            }
        }
    });
}

console.log("🛠️ Building Vane Presets...");
loadPresetsFromDir(officialDir);
loadPresetsFromDir(communityDir);

fs.writeFileSync(outputFile, JSON.stringify(allPresets, null, 2));
console.log(`\n✅ Success! Total of ${allPresets.length} presets written to presets.json.`);
