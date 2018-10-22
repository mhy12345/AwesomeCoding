
function generateProblem(configures) {
	let prefix = "<form action='/api/class/submit' method='POST'> " +
		"<input type='hidden' name='class_id' value='"+configures.class_id+"'/>" +
		"<input type='hidden' name='problem_id' value='"+configures.problem_id+"'/> <br/>";
	let suffix = "<input type='submit'></input></form>";
	let body = "";
	for (var w in configures.choices) {
		console.log(configures.choices[w]);
		body += "<input type='radio' name='problem' value='"+w+"'>"+configures.choices[w]+"</input><br/>";
		console.log(body);
	}
	return prefix+body+suffix;
};

var problemStudio = {
	'choice' : generateProblem
};

export default problemStudio;
