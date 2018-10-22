import {Quill} from 'vue2-editor';

const ATTRIBUTES = [
  'alt',
  'height',
  'width'
];

var Embed = Quill.import('blots/embed');
class SelectProblemEmbeder extends Embed {
	static create(values) {
		let node = super.create();
		let class_id = values.class_id;
		let problem_id = values.problem_id;
		let choices = values.choices;
		let context = global.problemEmbederContext;
		node.setAttribute('id','problem-'+class_id+'-'+problem_id);
		node.setAttribute('pid',problem_id);
		node.setAttribute('cid',class_id);
		let container = document.createElement('div');
		for (var item in choices) {
			let choice_node = document.createElement('div');
			choice_node.setAttribute('class','select-option');
			choice_node.setAttribute('index',item);
			choice_node.setAttribute('content',choices[item]);
			choice_node.appendChild(document.createTextNode(item + '.'+ choices[item]));
			container.appendChild(choice_node);
		}
		node.appendChild(container);
		let panel = document.createElement('div');
		let panel_answer = document.createElement('span');
		panel_answer.appendChild(document.createTextNode('[编辑]'));
		panel_answer.setAttribute('class','correct-answer-button');
		panel_answer.onclick = function() {
			context.handleShowAnswerDialog(problem_id);
		};
		let panel_analyze = document.createElement('span');
		panel_analyze.appendChild(document.createTextNode('[情况分析]'));
		panel_analyze.setAttribute('class','analyze-button');
		panel.appendChild(panel_answer);
		panel.appendChild(panel_analyze);
		node.appendChild(panel);
		return node;
	}

	static value(node) {
		let res = {
			class_id:node.getAttribute('cid'),
			problem_id:node.getAttribute('pid'),
			choices: {
			}
		};
		let container = node.children[0].children[0];
		for (let item of container.children) {
			res.choices[item.getAttribute('index')] = item.getAttribute('content');
		}
		return res;
	}

	static formats(domNode) {
		console.log("CALL formats()",domNode);
		return domNode.getAttribute('id');
	}

	static sanitize(url) {
		console.log("CALL sanitize()",domNode);
	}

	format(name, value) {
		if (ATTRIBUTES.indexOf(name) > -1) {
			if (value) {
				this.domNode.setAttribute(name, value);
			} else {
				this.domNode.removeAttribute(name);
			}
		} else {
			super.format(name, value);
		}
	}
}

SelectProblemEmbeder.blotName = 'select-problem';
SelectProblemEmbeder.className = 'smart-area';
SelectProblemEmbeder.tagName = 'div';

export default SelectProblemEmbeder;
