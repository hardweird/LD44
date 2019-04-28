function shadow(parent, x, y, i, cb) {
	let shad = document.createElement('div');
	let div = document.createElement('div');
	let img = document.createElement('img');
	div.classList.add('img');
	img.setAttribute('src', 'img/shadow.png');
	div.appendChild(img);
	shad.appendChild(div);
	shad.classList.add('shadow');
	shad.style.left = `${x}px`;
	shad.style.top = `${y}px`;
	shad.dataset.i = i;
	if (cb) shad.addEventListener('click', (e) => { cb(shad, e); });
	parent.appendChild(shad);
	return shad;
}
