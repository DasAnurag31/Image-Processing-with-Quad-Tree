class Quadtree {
    constructor(x, y, width, height, maxDepth, imageData) {
      this.x = x; // x-coordinate of the quadtree's top-left corner
      this.y = y; // y-coordinate of the quadtree's top-left corner
      this.width = width; // Width of the quadtree
      this.height = height; // Height of the quadtree
      this.maxDepth = maxDepth; // Maximum depth of the quadtree
      this.imageData = imageData; // Image data to be compressed
      this.root = this.buildTree(0, 0, width, height, 0); // Root node of the quadtree
    }
  
    // Build the quadtree recursively
    buildTree(x, y, width, height, depth) {
      if (depth >= this.maxDepth || this.isUniform(x, y, width, height)) {
        return new QuadNode(x, y, width, height, this.getColor(x, y));
      } else {
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        let topLeft = this.buildTree(x, y, halfWidth, halfHeight, depth + 1);
        let topRight = this.buildTree(x + halfWidth, y, halfWidth, halfHeight, depth + 1);
        let bottomLeft = this.buildTree(x, y + halfHeight, halfWidth, halfHeight, depth + 1);
        let bottomRight = this.buildTree(x + halfWidth, y + halfHeight, halfWidth, halfHeight, depth + 1);
        return new QuadNode(x, y, width, height, null, topLeft, topRight, bottomLeft, bottomRight);
      }
    }
  
    // Check if the area defined by the coordinates and dimensions has uniform color
    isUniform(x, y, width, height) {
      let topLeftColor = this.getColor(x, y);
      for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
          let currentColor = this.getColor(i, j);
          if (currentColor !== topLeftColor) {
            return false;
          }
        }
      }
      return true;
    }
  
    // Get the average color of the area defined by the coordinates and dimensions
    getColor(x, y, width = 1, height = 1) {
      let totalRed = 0;
      let totalGreen = 0;
      let totalBlue = 0;
      let totalPixels = 0;
      for (let i = x; i < x + width && i < this.width; i++) {
        for (let j = y; j < y + height && j < this.height; j++) {
          let index = (j * this.width + i) * 4;
          totalRed += this.imageData.data[index];
          totalGreen += this.imageData.data[index + 1];
          totalBlue += this.imageData.data[index + 2];
          totalPixels++;
        }
      }
      return {
        r: Math.round(totalRed / totalPixels),
        g: Math.round(totalGreen / totalPixels),
        b: Math.round(totalBlue / totalPixels)
      };
    }
  }
  
  class QuadNode {
    constructor(x, y, width, height, color, topLeft, topRight, bottomLeft, bottomRight) {
      this.x = x; // x-coordinate of the node's top-left corner
      this.y = y; // y-coordinate of the node's top-left corner
      this.width = width; // Width of the node
      this.height = height; // Height of the node
      this.color = color; // Average color of the node
      this.topLeft = topLeft; // Top-left child node
      this.topRight = topRight; // Top-right child node
      this.bottomLeft = bottomLeft; // Bottom-left child node
      this.bottomRight = bottomRight; // Bottom-right child node
    }
  }
  