const { createCanvas, loadImage, ImageData } = require('canvas');
const { createQuadtree, quadtreeToUint8ClampedArray } = require('./quadtree');

function compressImage(imageData) {
    
    const threshold = 10; // Threshold for color similarity
    const root = createQuadtree(imageData, threshold);

    // Create a new Uint8ClampedArray to store compressed image data
    const compressedData = new Uint8ClampedArray(imageData.length); // Adjust the size as needed
    quadtreeToUint8ClampedArray(root, imageData, compressedData);

    return compressedData;
}


async function processImage(imagePath) {
    try {
        const image = await loadImage(imagePath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Convert the image data to a format compatible with the Quadtree algorithm
        const pixels = Array.from(imageData.data);
        const width = imageData.width;
        const height = imageData.height;
        const imgData = { data: pixels, width, height };

        const pixelsData = new Uint8ClampedArray(imageData.data);
        const imageDataObject = new ImageData(pixelsData, imageData.width, imageData.height);
        console.log(pixelsData);
        console.log(imageDataObject);

        const compressedData = compressImage(pixelsData);

        if (compressedData) {
            console.log(compressedData); // Output the compressed image data
        }

    } catch (error) {
        console.error('Error processing image:', error);
        return null;
    }
}

module.exports = { processImage };
