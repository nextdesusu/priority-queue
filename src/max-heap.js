const Node = require('./node');

class Node1 {
	constructor(data, priority) {
		this.data = data;
		this.priority = priority;
		this.parent = null;
		this.left = null;
		this.right = null;
	}

	appendChild(node) {
		if (this.left === null){
			node.parent = this;
			this.left = node;
		} else if (this.right === null){
			node.parent = this;
			this.right = node;
		}
	}

	removeChild(node) {
		if (node === this.left){
			this.left = null;
			node.parent = null;
		} else if (node === this.right){
			this.right = null;
			node.parent = null;
		} else {
			throw Error("Node does not exist");
		}
	}

	remove() {
		if (this.parent === null){
			return;
		}
		this.parent.removeChild(this);
	}

	swapWithParent() {
		if (this.parent === null){
			return;
		}
		let parent = this.parent;
		let childLeft = this.left;
		let childRight = this.right;

		let parentOfParent = this.parent.parent;
		let parentLeft = this.parent.left;
		let parentRight = this.parent.right;

		this.parent.parent = this;
		this.parent = parentOfParent;
		if (this === parentLeft){
			if (parentRight !== null){
				parentRight.parent = this;
			}
			if (parentOfParent){
				if (parentOfParent.right === parent){
					parentOfParent.right = this;
				} else if (parentOfParent.left === parent){
					parentOfParent.left = this;
				} else {
					throw Error("ParentOfParent didnt have a parent");
				}
			} else {
				this.parent = null;
			}
			this.left = parent;
			this.right = parentRight;
		} else if (this === parentRight){
			if (parentLeft !== null){
				parentLeft.parent = this;
			}
			if (parentOfParent){
				if (parentOfParent.right === parent){
					parentOfParent.right = this;
				} else if (parentOfParent.left === parent){
					parentOfParent.left = this;
				} else {
					throw Error("ParentOfParent didnt have a parent");
				}
			}
			this.left = parentLeft;
			this.right = parent;
		} else {
			throw Error("Parent didnt have this a it's child");
		}
		parent.left = childLeft;
		parent.right = childRight;
		if (childLeft !== null){
			childLeft.parent = parent;
		}
		if (childRight !== null){
			childRight.parent = parent;
		}
		return true;
	}
}


class MaxHeap {
	constructor() {
		this.root = null;
		this.parentNodes = [];
	}

	push(data, priority) {
		let node = new Node(data, priority);
		this.insertNode(node);
		this.shiftNodeUp(node);
	}

	pop() {
		if (this.root === null){
			return;
		} else {
			let popped = this.detachRoot();
			let data = popped.data;
			this.restoreRootFromLastInsertedNode(popped);
			//console.log("in fact shift down", this.root)
			this.shiftNodeDown(this.root);
			return data;
		}
	}

	detachRoot() {
		let root = this.root;
		this.root = null;
		return root;
	}

	inspectRoot(root){
		if (root !== null){
			if (root.right === null){
				this.parentNodes.push(root);
			}
			this.inspectRoot(root.left);
			this.inspectRoot(root.right);
		}
	}

	findParentNodes(){
		this.parentNodes = [];
		if (this.root){
			this.inspectRoot(this.root);
		}
	}

	restoreRootFromLastInsertedNode(detached) {
		if (!detached){
			return;
		}
		//console.log("detached left is", detached)
		//let left = detached.left.priority, right = detached.right.priority;
		//let nextRoot = left >= right ? detached.left : detached.right;
		//let toInsert = left < right ? detached.left : detached.right
		//console.log(nextRoot, toInsert)
		if (detached.left){
			detached.left.parent = null;
		}
		if (detached.right){
			detached.right.parent = null;
		}
		this.root = detached.right;
		//toInsert.parent = null;
		this.insertNode(detached.left);
		this.findParentNodes();
	}

	size() {
		let counter = 0;
		if (this.root === null){
			return counter;
		}
		counter++;
		let branches = [this.root];
		let tmp;
		while (branches.length) {
			tmp = [];
			for (let branch of branches){
				if (branch.left !== null){
					tmp.push(branch.left);
					counter++;
				}
				if (branch.right !== null){
					tmp.push(branch.right);
					counter++;
				}
			}
			branches = tmp;
		}
		return counter;
	}

	isEmpty() {
		return this.root === null && this.parentNodes.length === 0;
	}

	clear() {
		this.root = null;
		this.parentNodes = [];
	}

	insertNode(node) {
		//console.log("node", node);
		if (!node){
			return;
		}
		node.parent = null;
		if (this.root === null){
			this.root = node;
			this.parentNodes.push(node);
		} else {
			let currentNode = this.root;
			while (currentNode){
				if (currentNode.left === null || currentNode.right === null){
					if (currentNode.left){
						this.parentNodes.shift();
					}
					currentNode.appendChild(node)
					this.parentNodes.push(node);
					break;
				}
				currentNode = currentNode.left;
			}
		}
	}

	shiftNodeUp(node) {
		if (!node){
			return;
		}
		if (node.parent !== null){
			if (node.parent === undefined){
				throw Error("node.parent === undefined")
			}
			this.parentNodes.pop();
			this.parentNodes.push(node.parent);
			node.swapWithParent();
			return this.shiftNodeUp(node);
		}
		this.parentNodes.reverse();
		this.root = node;
	}

	shiftNodeDown(node) {
		if (node === null){
			return;
		}
		if (node === undefined){
			return;
		}
		if (node.left !== null){
			if (node.priority > node.left.priority){
				return;
			}
			if (node.right !== null){
				let nodeToSwap = node.left.priority >= node.right.priority ? node.left : node.right;
				nodeToSwap.swapWithParent();
			} else {
				node.left.swapWithParent();
			}
			//this.parentNodes.pop();
			//this.parentNodes.unshift(node);
			return this.shiftNodeDown(node);
		}
		//this.parentNodes.reverse();
		let newRoot = node;
		while (newRoot.parent){
			newRoot = newRoot.parent;
		}
		this.root = newRoot;
		this.findParentNodes();
	}
}

module.exports = MaxHeap;
/*
const h = new MaxHeap();
h.push(42, 15);
h.push(15, 14);
h.push(0, 16);
h.push(100, 100);

console.log("root", h.root)
console.log(h.pop(), "==", 100);
console.log("root", h.root)
console.log(h.pop(), "==", 0);
console.log("root", h.root)
console.log(h.pop(), "==", 42);
console.log("root", h.root)
console.log(h.pop(), "==", 15);
console.log("root", h.root)
/*
const h = new MaxHeap();
h.push(42, 15);
h.push(15, 42);
h.push(100, 100);

const expectedNodeToShiftDown = h.root.right;

//h.pop();
console.log("head", h.root)
console.log("left", h.root.left)
console.log("right", h.root.right)
console.log("expectedNodeToShiftDown", expectedNodeToShiftDown)

/*
h = new MaxHeap();

h.root = new Node(0, 3);
h.root.appendChild(new Node(1, 20));
h.root.appendChild(new Node(2, 7));
h.root.left.appendChild(new Node(3, 5));

h.parentNodes = [
	h.root.left,
	h.root.right,
	h.root.left.left,
];

/**
          3                        20
        /  \                      /  \
      20    7  - shift down ->   5    7
     /                          /
    5                          3
**/
/*
const correctParentNodesOrderAfterShiftUp = [
	h.root.left.left,
	h.root.right,
	h.root
]

h.shiftNodeDown(h.root);

console.log(h.parentNodes[0], "==", correctParentNodesOrderAfterShiftUp[0]);
console.log(h.parentNodes[1], "==", correctParentNodesOrderAfterShiftUp[1]);
console.log(h.parentNodes[2], "==", correctParentNodesOrderAfterShiftUp[2]);

//h.root.left.left.swapWithParent();
//h.root.swapWithParent();
//h.root.left.swapWithParent();
//console.log(h.root);

h.shiftNodeDown(h.root);
/*
console.log(h.root,"==", newRoot);
console.log(h.root.left.left,"==", newDeepest);
/*
h = new MaxHeap();

h.push(42, 15);
h.push(14, 32);
h.push(0, 0);
h.push(14,14);
h.push(13,13);
h.push(16,16);
h.push(12,12);


//           32                             12
//          /  \                           /  \
//        15    16   - restoreRoot ->    15   16
//       /  \  /  \                    /  \  /
//     14  13  0   12                14  13  0


const detached = h.detachRoot();

h.restoreRootFromLastInsertedNode(detached);

console.log("root", h.root);

console.log(h.parentNodes.map(n=>n.priority), "==",[16,14,13,0]);

/*
h = new MaxHeap();

h.push(42, 15);
h.push(14, 32);
h.push(0, 0);

const lastInsertedNode = h.root.right;
const left = h.root.left;

const detached = h.detachRoot();
h.restoreRootFromLastInsertedNode(detached);

console.log(h.root, "==", lastInsertedNode);
console.log(h.root.left, "==", left);
console.log(left.parent, "==", lastInsertedNode);
*/