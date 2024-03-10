# Image Compression using Quad Tree in JavaScript

## Motivation 
- [Construct Quad Tree LeetCode](https://leetcode.com/problems/construct-quad-tree/)
- This project implements image compression using the Quad Tree algorithm in JavaScript. The script recursively divides an image into 4 quadrants until an error threshold is reached or a specific depth is reached.
- Pixels with values that do not exceed a Error threshold are given an average pixel value, reducing picture quality and image size in the process.

## Installation
Clone the repository and include the `quadtree.js` file in your project.

## Usage
```javascript
// Example usage of the quad tree compression script
const image = /* Load your image */;
const compressedImage = compressImage(image);
```

## Parameters
Error Threshold: The maximum allowable difference between pixel values within a quadrant.

Depth: The maximum depth of recursion for dividing the image into quadrants.

ctx: Conetxt for canvas 

## How it Works
The Quad Tree algorithm recursively divides the image into quadrants until the error limit or depth is reached. Pixels within each quadrant are compared, and if their values do not exceed the error limit, they are replaced with the average pixel value for that quadrant.

## Algorithm
1. Load the image from the file, using canvas API for node JS (NOTE: The canvas API for web is not supported on node JS)
   1. Exrtact the image data i.e data about each pixel
   2. The extracted data will be in the form of list/array with each element containing a list/array which contains the 4 color values.
2. This image data once extracted is converted into nodes of a quad tree
3. 

## License
This project is licensed under the MIT License.