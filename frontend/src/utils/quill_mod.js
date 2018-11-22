import Parchment from 'parchment';

class MHY extends Parchment.Embed {
	static create(value) {
		let node = super.create(value);
		return node;
	}

}
MHY.blotName = 'mhy';
MHY.tagName = 'img';
MHY.className = 'my-custom-tag';



export default MHY;
