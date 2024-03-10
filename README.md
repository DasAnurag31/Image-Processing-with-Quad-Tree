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

## How it Works

The Quad Tree algorithm recursively divides the image into quadrants until the error limit or depth is reached. Pixels within each quadrant are compared, and if their values do not exceed the error limit, they are replaced with the average pixel value for that quadrant.

## Methods and their working

`constructor(imageData, maxDepth, errorThreshold)` Initializes the quadtree with the input image data, maximum depth, and error threshold.
`_buildTree(imageData, boundingBox, depth)`: Recursively builds the quadtree by subdividing the image based on color uniformity and depth constraints.
`_generateHistogram(imageData, boundingBox)`: Generates a histogram of colors within the given bounding box of the image.
`_isUniform(histogram)`: Checks if the colors within a bounding box are sufficiently uniform based on a threshold.
`_getAverageColor(imageData, boundingBox)`: Calculates the average color within a bounding box.
`_getError(imageData, boundingBox)`: Calculates the error (difference) between the actual colors and the average color within a bounding box.
`_splitImage(imageData, boundingBox)`: Splits a bounding box into four equal quadrants.

## Algorithm

`constructor(imageData, maxDepth, errorThreshold)`:

- Store the width and height of the input image data.
- Store the maximum depth to limit the quadtree subdivision.
- Store the error threshold to decide when to stop subdividing.
- Call the `_buildTree` method to construct the quadtree, passing the image data, initial bounding box (entire image), and starting depth of 0.

`_splitImage(imageData, boundingBox)`:

- Get the x, y, width, and height of the current bounding box.
- Calculate the half-width and half-height by dividing the width and height by 2, respectively.
- Create four new bounding boxes for the top-left, top-right, bottom-left, and bottom-right quadrants using the calculated half-width and half-height.
- Return an object containing the four quadrant bounding boxes.

```_getError(imageData, boundingBox)```:
* Calculate the average color of the bounding box using the _getAverageColor method.
* Initialize a variable to keep track of the total error.
* For each pixel within the bounding box:
    * Calculate the absolute difference between the pixel's red value and the average red value.
    * Calculate the absolute difference between the pixel's green value and the average green value.
    * Calculate the absolute difference between the pixel's blue value and the average blue value.
    * Add the sum of the absolute differences to the total error.
    * Calculate the average error by dividing the total error by the number of pixels.
* Return the average error.

```_getAverageColor(imageData, boundingBox)```:
* Initialize variables to keep track of the total red, green, and blue values.
* For each pixel within the bounding box:
    * Add the pixel's red value to the total red.
    * Add the pixel's green value to the total green.
    * Add the pixel's blue value to the total blue.
* Calculate the average red value by dividing the total red by the number of pixels.
* Calculate the average green value by dividing the total green by the number of pixels.
* Calculate the average blue value by dividing the total blue by the number of pixels.
* Return an object containing the average red, green, and blue values.

```_buildTree(imageData, boundingBox, depth)```:
* Create a new QuadNode for the current bounding box and depth.
* Generate a histogram of colors within the bounding box using the _generateHistogram method.
* If the maximum depth is reached, or the region is uniform enough (based on _isUniform), or the error is below the threshold (based on _getError):
* Calculate the average color of the bounding box using the _getAverageColor method.
* Store the average color in the QuadNode.
* Otherwise (the region needs further subdivision):
    * Split the bounding box into four equal quadrants using the _splitImage method.
    * Recursively call _buildTree for each quadrant, incrementing the depth.
    * Store the child nodes in the QuadNode.
* Return the QuadNode.

```_generateHistogram(imageData, boundingBox)```:
* Initialize an empty histogram object.
* For each pixel within the bounding box:
    * Get the pixel's RGB values from the image data.
    * Convert the RGB values to a string key (e.g., "255,0,0" for red).
    * If the key exists in the histogram, increment its count; otherwise, initialize it to 1.
* Return the histogram object.

```_isUniform(histogram)```:
* Calculate the total number of pixels by summing the counts in the histogram.
* Find the maximum count (the most frequent color) in the histogram.
* If the maximum count divided by the total number of pixels is greater than 0.9 (90%), the region is considered uniform.
* Return true if the region is uniform, false otherwise.

## License

This project is licensed under the MIT License.
