function roll(n) {
	return 1 + Math.random() * n | 0;
}

function last(li) {
	if (li.length === 0) return undefined;
	return li[li.length - 1];
}
