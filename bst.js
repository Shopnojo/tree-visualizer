// Node structure
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree
class BST {
    constructor() {
        this.root = null;
    }

    // Insert a value into the BST
    insert(value) {
        if (value === null || value === undefined) return;

        const newNode = new Node(value);

        if (!this.root) {
            this.root = newNode;
            return;
        }

        let current = this.root;

        while (true) {

            // Ignore duplicates (important for clean visuals)
            if (value === current.value) return;

            if (value < current.value) {

                if (!current.left) {
                    current.left = newNode;
                    return;
                }
                current = current.left;

            } else {

                if (!current.right) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }

    // Search a value
    search(value) {
        let current = this.root;

        while (current) {
            if (value === current.value) return current;
            if (value < current.value) current = current.left;
            else current = current.right;
        }

        return null;
    }

    delete(value) {
    this.root = this.deleteNode(this.root, value);
}

deleteNode(node, value) {

    if (!node) return null;

    if (value < node.value) {
        node.left = this.deleteNode(node.left, value);
    }
    else if (value > node.value) {
        node.right = this.deleteNode(node.right, value);
    }
    else {

        // Case 1: no child
        if (!node.left && !node.right) {
            return null;
        }

        // Case 2: one child
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // Case 3: two children
        let successor = this.findMin(node.right);
        node.value = successor.value;
        node.right = this.deleteNode(node.right, successor.value);
    }

    return node;
}

findMin(node) {
    while (node.left) {
        node = node.left;
    }
    return node;
}


    // Inorder traversal (Left → Root → Right)
    inorder() {
        const result = [];

        function traverse(node) {
            if (!node) return;
            traverse(node.left);
            result.push(node.value);
            traverse(node.right);
        }

        traverse(this.root);
        return result;
    }

    // Preorder traversal (Root → Left → Right)
    preorder() {
        const result = [];

        function traverse(node) {
            if (!node) return;
            result.push(node.value);
            traverse(node.left);
            traverse(node.right);
        }

        traverse(this.root);
        return result;
    }

    // Postorder traversal (Left → Right → Root)
    postorder() {
        const result = [];

        function traverse(node) {
            if (!node) return;
            traverse(node.left);
            traverse(node.right);
            result.push(node.value);
        }

        traverse(this.root);
        return result;
    }

    // Reset tree
    clear() {
        this.root = null;
    }
}
