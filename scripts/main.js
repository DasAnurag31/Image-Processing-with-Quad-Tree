const path = require('path');
const fs = require('fs').promises;
const { processImage } = require('../src/imageProcessor');
const { clear } = require('console');

async function copyFile(source, destination) {
    try {
        const data = await fs.readFile(source);
        await fs.writeFile(destination, data);
        console.log(`File copied from ${source} to ${destination}`);
    } catch (error) {
        console.error('Error copying file:', error);
    }
}

async function getFileDetails(filePath) {
    try {
        const stats = await fs.stat(filePath);
        console.log('File details:');
        console.log('  - Name:', path.basename(filePath));
        console.log('  - Size:', stats.size, 'bytes');
        console.log('  - Path:', filePath);
    } catch (error) {
        console.error('Error getting file details:', error);
    }
}

async function main() {
    try {
        const inputFilePath = path.join(__dirname, '..', 'assets', 'input.jpg');
        const outputFilePath = path.join(__dirname, '..', 'output', 'output.jpg');

        // Process the Image and then, copy the processed image to the output folder
        await processImage(inputFilePath);
        await copyFile(inputFilePath, outputFilePath);

        console.log('\nInput file details:');
        await getFileDetails(inputFilePath);clear

        console.log('\nOutput file details:');
        await getFileDetails(outputFilePath);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();