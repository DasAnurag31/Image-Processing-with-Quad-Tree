const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

class Quadtree {
    constructor(imageData, maxDepth = 8, errorThreshold = 10) {
        this.width = imageData.width;
        this.height = imageData.height;
        this.maxDepth = maxDepth;
        this.errorThreshold = errorThreshold;
        this.root = this._buildTree(imageData, { x: 0, y: 0, width: this.width, height: this.height }, 0);
    }

    _buildTree(imageData, boundingBox, depth) {
        const node = new QuadNode(boundingBox, depth);
        const histogram = this._generateHistogram(imageData, boundingBox);

        if (depth >= this.maxDepth || this._isUniform(histogram) || this._getError(imageData, boundingBox) <= this.errorThreshold) {
            node.color = this._getAverageColor(imageData, boundingBox);
        } else {
            const { topLeft, topRight, bottomLeft, bottomRight } = this._splitImage(imageData, boundingBox);

            node.topLeft = this._buildTree(imageData, topLeft, depth + 1);
            node.topRight = this._buildTree(imageData, topRight, depth + 1);
            node.bottomLeft = this._buildTree(imageData, bottomLeft, depth + 1);
            node.bottomRight = this._buildTree(imageData, bottomRight, depth + 1);
        }

        return node;
    }

    _generateHistogram(imageData, boundingBox) {
        const histogram = {};
        for (let x = boundingBox.x; x < boundingBox.x + boundingBox.width; x++) {
            for (let y = boundingBox.y; y < boundingBox.y + boundingBox.height; y++) {
                const index = (y * this.width + x) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                const key = `${r},${g},${b}`;
                histogram[key] = (histogram[key] || 0) + 1;
            }
        }
        return histogram;
    }

    _isUniform(histogram) {
        const totalPixels = Object.values(histogram).reduce((acc, val) => acc + val, 0);
        const maxColorCount = Math.max(...Object.values(histogram));
        return maxColorCount / totalPixels > 0.9;
    }

    _getAverageColor(imageData, boundingBox) {
        let totalRed = 0;
        let totalGreen = 0;
        let totalBlue = 0;
        const totalPixels = boundingBox.width * boundingBox.height;
        for (let x = boundingBox.x; x < boundingBox.x + boundingBox.width; x++) {
            for (let y = boundingBox.y; y < boundingBox.y + boundingBox.height; y++) {
                const index = (y * this.width + x) * 4;
                totalRed += imageData.data[index];
                totalGreen += imageData.data[index + 1];
                totalBlue += imageData.data[index + 2];
            }
        }
        return {
            r: Math.round(totalRed / totalPixels),
            g: Math.round(totalGreen / totalPixels),
            b: Math.round(totalBlue / totalPixels)
        };
    }

    _getError(imageData, boundingBox) {
        let totalError = 0;
        const averageColor = this._getAverageColor(imageData, boundingBox);

        for (let x = boundingBox.x; x < boundingBox.x + boundingBox.width; x++) {
            for (let y = boundingBox.y; y < boundingBox.y + boundingBox.height; y++) {
                const index = (y * this.width + x) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                const error = Math.abs(r - averageColor.r) + Math.abs(g - averageColor.g) + Math.abs(b - averageColor.b);
                totalError += error;
            }
        }
        return totalError / (boundingBox.width * boundingBox.height);
    }

    _splitImage(imageData, boundingBox) {
        const { x, y, width, height } = boundingBox;
        const halfWidth = Math.floor(width / 2);
        const halfHeight = Math.floor(height / 2);

        const topLeft = { x, y, width: halfWidth, height: halfHeight };
        const topRight = { x: x + halfWidth, y, width: width - halfWidth, height: halfHeight };
        const bottomLeft = { x, y: y + halfHeight, width: halfWidth, height: height - halfHeight };
        const bottomRight = { x: x + halfWidth, y: y + halfHeight, width: width - halfWidth, height: height - halfHeight };

        return { topLeft, topRight, bottomLeft, bottomRight };
    }
}

// Similar to the structure provided in the leetCode problem on quad tree
class QuadNode {
    constructor(boundingBox, depth) {
        this.boundingBox = boundingBox;
        this.depth = depth;
        this.color = null;
        this.topLeft = null;
        this.topRight = null;
        this.bottomLeft = null;
        this.bottomRight = null;
    }
}

async function main() {
    // Loading the Image file using the canvas library
    const image = await loadImage('input.jpg'); 
    if (!image) {
        console.error('Error loading image');
        return;
    }
    console.log('Image loaded successfully');

    // Create a canvas and context and drawing it on the canvas to get image data
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const maxDepth = 6; 
    const errorThreshold = 35; 
    // Convert Image to Quadtree
    const quadtree = new Quadtree(imageData, maxDepth, errorThreshold);
    // Convert the quadtree to an image
    convertImage(quadtree.root, ctx);

    // Save the compressed image to a file
    const outputFileName = 'output.jpg'; 
    const out = fs.createWriteStream(outputFileName);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    console.log(`Compressed image saved to ${outputFileName}`);
}

function convertImage(node, ctx) {
    if (node.color !== null) {
        ctx.fillStyle = `rgb(${node.color.r},${node.color.g},${node.color.b})`;
        ctx.fillRect(node.boundingBox.x, node.boundingBox.y, node.boundingBox.width, node.boundingBox.height);
    } else {
        // Recursively convert child nodes and fill them with pixel colour
        convertImage(node.topLeft, ctx);
        convertImage(node.topRight, ctx);
        convertImage(node.bottomLeft, ctx);
        convertImage(node.bottomRight, ctx);
    }
}

main().catch(console.error);
