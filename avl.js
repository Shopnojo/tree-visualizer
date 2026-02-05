class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVL {
    constructor() {
        this.root = null;
    }

    height(node) {
        return node ? node.height : 0;
    }

    balanceFactor(node) {
        return this.height(node.left) - this.height(node.right);
    }

    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

        return x;
    }

    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

        return y;
    }

    insertNode(node, value) {

        if (!node) return new AVLNode(value);

        if (value < node.value)
            node.left = this.insertNode(node.left, value);
        else if (value > node.value)
            node.right = this.insertNode(node.right, value);
        else
            return node; // no duplicates

        node.height =
            1 + Math.max(this.height(node.left), this.height(node.right));

        const balance = this.balanceFactor(node);

        // LL
        if (balance > 1 && value < node.left.value)
            return this.rightRotate(node);

        // RR
        if (balance < -1 && value > node.right.value)
            return this.leftRotate(node);

        // LR
        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // RL
        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    insert(value) {
        this.root = this.insertNode(this.root, value);
    }

    clear() {
        this.root = null;
    }
}
