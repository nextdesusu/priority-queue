const MaxHeap = require('./max-heap.js');

class PriorityQueue {
	constructor(maxSize = 30) {
		this.maxSize = maxSize;
		this.heap = new MaxHeap();
		this.__size = 0;
	}

	push(data, priority) {
		if (priority > this.maxSize){
			throw Error("Priority is bigger than max size of heap!")
		}
		++this.__size;
		this.heap.push(data, priority);
	}

	shift() {
		if (this.isEmpty()){
			throw Error("Queue is empty!")
		}
		--this.__size;
		let value = this.heap.pop();
		return value;
	}

	size() {
		return this.__size;
	}

	isEmpty() {
		return this.__size === 0;
	}
}

module.exports = PriorityQueue;
