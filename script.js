// get visualization container
const container = document.getElementById("visualization");

// create SVG
const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
);

svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");

// add to page
container.appendChild(svg);

const input = document.getElementById("valueInput");

const insertBtn = document.getElementById("insertBtn");
const deleteBtn = document.getElementById("deleteBtn");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const inorderBtn = document.getElementById("inorderBtn");
const preorderBtn = document.getElementById("preorderBtn");
const postorderBtn = document.getElementById("postorderBtn");


const bstBtn = document.querySelector(".tree-btn:nth-child(1)");
const avlBtn = document.querySelector(".tree-btn:nth-child(2)");

const toast = document.getElementById("toast");

function showToast(message, type = "success") {

    toast.textContent = message;

    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}



function getNodePositions(root) {

    let positions = [];
    let xIndex = 0;

    function inorder(node, depth, parent = null) {
        if (!node) return;

        inorder(node.left, depth + 1, node);

        const currentNode = {
            value: node.value,
            x: xIndex * 80 + 50,
            y: depth * 80 + 50,
            parent: parent
        };

        positions.push(currentNode);

        node._layout = currentNode; // store reference for edge drawing

        xIndex++;

        inorder(node.right, depth + 1, node);
    }

    inorder(root, 0);

    return positions;
}



function renderTree(highlighted = { path: [], final: null }) {

    // clear SVG before re-render
    svg.innerHTML = "";

    if (!tree.root) return;

    // get layout positions
    const nodes = getNodePositions(tree.root);

    /* ===============================
       CENTER TREE USING ROOT POSITION
    =============================== */

    const rootLayout = tree.root._layout;

        // width of floating panel + spacing
    const panelOffset = 260; // adjust if needed

    const containerWidth = container.getBoundingClientRect().width;

    // center only in usable area
    const centerX = (containerWidth - panelOffset) / 2;


    const offsetX = centerX - rootLayout.x;


    /* ===============================
       DRAW LINE FUNCTION (WITH OFFSET)
    =============================== */

    function drawLine(parent, child) {

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1", parent.x + offsetX);
        line.setAttribute("y1", parent.y);
        line.setAttribute("x2", child.x + offsetX);
        line.setAttribute("y2", child.y);

        line.setAttribute("stroke", "white");

        svg.appendChild(line);
    }


    /* ===============================
       DRAW EDGES FIRST
    =============================== */

    function drawEdges(node) {

        if (!node) return;

        if (node.left) {
            drawLine(node._layout, node.left._layout);
            drawEdges(node.left);
        }

        if (node.right) {
            drawLine(node._layout, node.right._layout);
            drawEdges(node.right);
        }
    }

    drawEdges(tree.root);


    /* ===============================
       DRAW NODES
    =============================== */

    nodes.forEach(node => {

        const group = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute("cx", node.x + offsetX);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 20);

        // highlight logic
        if (highlighted.final === node.value) {
            circle.setAttribute("fill", "#5cdc21"); // found node
        }
        else if (highlighted.path.includes(node.value)) {
            circle.setAttribute("fill", "#ffe101"); // traversal
        }
        else {
            circle.setAttribute("fill", "white");
        }

        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        text.setAttribute("x", node.x + offsetX);
        text.setAttribute("y", node.y + 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#111");
        text.setAttribute("font-weight", "bold");

        text.textContent = node.value;

        group.appendChild(circle);
        group.appendChild(text);

        svg.appendChild(group);

    });
}



function getSearchPath(value) {

    let current = tree.root;
    let path = [];
    let found = false;

    while (current) {

        path.push(current.value);

        if (value === current.value) {
            found = true;
            break;
        }

        if (value < current.value) {
            current = current.left;
        } else {
            current = current.right;
        }
    }

    return { path, found };
}





function animateSearch(path, found) {

    let index = 0;

    const interval = setInterval(() => {

        const highlighted = {
            path: path.slice(0, index + 1),
            final: null
        };

        renderTree(highlighted);

        index++;

        if (index >= path.length) {

            clearInterval(interval);

            setTimeout(() => {

                if (found) {

                    renderTree({
                        path,
                        final: path[path.length - 1]
                    });

                    showToast("NODE FOUND", "success");

                } else {

                    showToast("NODE NOT FOUND", "error");
                }

            }, 300);
        }

    }, 450);
}

function animateTraversal(list) {

    let index = 0;

    const interval = setInterval(() => {

        renderTree({
            path: list.slice(0, index + 1),
            final: list[index]
        });

        index++;

        if (index >= list.length) {
            clearInterval(interval);
        }

    }, 500);
}



insertBtn.addEventListener("click", () => {

    const value = parseInt(input.value);

    if (isNaN(value)) return;

    tree.insert(value);

    renderTree();

    input.value = "";
});

resetBtn.addEventListener("click", () => {

    tree.clear();

    renderTree();
});

deleteBtn.addEventListener("click", () => {

    const value = parseInt(input.value);
    if (isNaN(value)) return;

    const exists = tree.search(value);

    if (exists) {

        tree.delete(value);

        renderTree();

        showToast("ELEMENT DELETED", "success");

    } else {

        showToast("ELEMENT NOT FOUND", "error");

    }

    input.value = "";
});


searchBtn.addEventListener("click", () => {

    const value = parseInt(input.value);
    if (isNaN(value)) return;

    const result = getSearchPath(value);

    animateSearch(result.path, result.found);
});

inorderBtn.addEventListener("click", () => {
    animateTraversal(tree.inorder());
});

preorderBtn.addEventListener("click", () => {
    animateTraversal(tree.preorder());
});

postorderBtn.addEventListener("click", () => {
    animateTraversal(tree.postorder());
});



bstBtn.addEventListener("click", () => {

    bstBtn.classList.add("active");
    avlBtn.classList.remove("active");

    // preserve existing values
    const values = tree.inorder();

    // rebuild as BST
    tree = new BST();

    values.forEach(v => tree.insert(v));

    renderTree();
});


avlBtn.addEventListener("click", () => {

    avlBtn.classList.add("active");
    bstBtn.classList.remove("active");

    const values = tree.inorder();

    tree = new AVL();

    values.forEach(v => tree.insert(v));

    renderTree();
});




let currentMode = "BST";
let tree = new BST();



console.log(tree.inorder());   // [10, 30, 50, 70]
console.log(tree.preorder());  // [50, 30, 10, 70]
console.log(tree.postorder()); // [10, 30, 70, 50]

renderTree();