class Node {
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

module.exports = Node;

/*
const parent = new Node(15, 42);
const child = new Node(42, 15);

parent.appendChild(child);
child.swapWithParent();

console.log(parent.parent, "==", child);
*/
/*

const root = new Node(15, 42);
const left = new Node(42, 15);
const right = new Node(13, 42);
const childOfLeft = new Node(13, 34);
const childOfRight = new Node(0, 1);

root.appendChild(left);
root.appendChild(right);
left.appendChild(childOfLeft);
right.appendChild(childOfRight);

//			 root
//		 left	 right
//childOfLeft	 childOfRight

childOfLeft.swapWithParent();

console.log(root.left, "==", childOfLeft);

console.log("****************")

//			 root
//childOfLeft	 right
//		 left	 childOfRight

childOfRight.swapWithParent();

//			 root
//childOfLeft	 childOfRight
//		 left	 right

console.log(root.right, "==", childOfRight);
*/