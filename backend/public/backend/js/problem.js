

window.onload = function() {
	console.log("ASDASD");
	var answers = {};
	var tasks = document.querySelectorAll('.smart-area');
	for (let task of tasks) {
		let pid = task.getAttribute('pid');
		let cid = task.getAttribute('cid');
		var options = task.querySelectorAll('.select-option');
			console.log("init ... ",task);
		for (let opt of options) {
			opt.task = task;
			opt.pid = pid;
			opt.idx = opt.getAttribute('index');
			opt.onclick = function() {
				for (let other of opt.task.querySelectorAll('.select-option')) {
					other.style.color='black';
				}
				opt.style.color='red';
				answers[opt.pid] = opt.idx;
				console.log(answers);
				$.post("/api/problem/paper/put",{problem_id: pid, text: opt.idx},function(res){
					console.log("Saved!");
				});
			}
		}
		task.style.color='gray';
		$.post('/api/problem/paper/get',{problem_id: pid}, function(res) {
			//TODO OPTIMIZE THIS PART
			res = JSON.parse(res);
			task.style.color='black';
			let target = task.querySelector('.select-option[index="'+res.text+'"]');
			if (target !== null) {
				target.style.color='red';
			}
		});
	}
};
