	/*****************************************************************
	Function name: 		updateTotalProgress()
	Description:		Update total progress of this quiz
	Input:				none
	Return:				none
	*****************************************************************/
	function updateTotalProgress() {
		let total_responses_sent = 0;
		let total_correct_responses = 0;

		//count number of submitted responses and number of correct ones
		for (f = 0; f < quiz[0].getTotalInstances(); f++) {
			total_responses_sent += quiz[f].response_sent;
			total_correct_responses += quiz[f].correct;
		}

		//update progress div info
		let progress_div = document.getElementById('total_progress');
		progress_div.innerHTML = "Răspunsuri corecte până acum: " + total_correct_responses + " / " + total_responses_sent + ", total întrebari " + quiz[0].getTotalInstances();

	}

	/*****************************************************************
	Function name: 		verifyAnswer()
	Description:		Verify one answer when user presses "submit" button
	Input:				qindex - question index, starting from 0
	Return:				none
	*****************************************************************/
	function verifyAnswer(qindex) {
		var expl_div = document.getElementById('explanation' + qindex);
		var response_poll = document.getElementsByName("choose_answer" + qindex);
		var correct_answer = false;

		//check if selected response is the correct one
		for (f = 0; f < response_poll.length; f++) {
			if (response_poll[f].checked && response_poll[f].value == 1) {
				correct_answer = true; //the correct answer was selected
			}
		}

		//update question div with information
		if (correct_answer) expl_div.innerHTML = "Corect!"; else expl_div.innerHTML = "Greșit";
		expl_div.innerHTML += "<br><br>" + quiz[qindex].explanation;

		//mark response sent for this question and add it to total progress
		if (correct_answer) quiz[qindex].correct = 1;
		quiz[qindex].response_sent = 1;

		//update question div if the user change its mind and select another response
		if (correct_answer && quiz[qindex].correct == 0) {
			expl_div.innerHTML += "<br><br>Din păcate, primul tău răspuns la aceasta intrebare a fost greșit și nu îl vom calcula la numărul total de răspunsuri corecte";
		}
		if (!correct_answer && quiz[qindex].correct == 1) {
			expl_div.innerHTML += "<br><br>Prima dată ai răspuns corect; de ce ai schimbat răspunsul?";
		}

		//also update total progress
		updateTotalProgress();
	}

	/*****************************************************************
	Class name: 		askOneQuestion()
	Description:		Class for building, formatting and taking care of everything a question needs
	Constructor parameters:
						question_text - the text of the question
						variants_array - an array containing possible responses as strings

	Public properties:
						response_sent - 1 if the response was submitted, 0 otherwise
						correct - 1 if the submitted response was correct, 0 otherwise
						correct_answer - what answer is correct, starting from 1 for first response, 2 for the second one and so on
						explanation - after user submits response, this text can be seen to understand your mistakes
	Public methods:
						getFormattedText() - return formatted html for this question
						getTotalInstances() - return total number of instantiated classes (total number of questions)
						getClassIdx() - return the index for current class (question), starting from 0
	*****************************************************************/
	class askOneQuestion {
		static class_counter = 0; //this will increment at each instance: first class will be 0

		constructor(question_text, variants_array, correct_answer, explanation) {
			//store a unique ID for this instance
			this.class_idx = askOneQuestion.class_counter++;
			//store text to global variable answer_explanation to be written after a response is sent
			this.explanation = explanation;

			//store parameters into private vars
			this.correct_answer = correct_answer - 1; //convert from 1-based to 0-based index
			this.wholetext = "";
			if (this.correct_answer >= variants_array.length) {
				//error checking - incorrect response number
				this.wholetext += "Aceasta intrebare are doar " + variants_array.length + " variante de raspuns asa ca " + correct_answer + " nu poate fi cel corect. <br>";
			}

			//format the question text by adding: question, all answers, a div for future explanations
			this.wholetext += "<p>" + (this.class_idx + 1) + ". " + question_text + "</p>";
			this.wholetext += "";
			for (var f = 0; f < variants_array.length; f++) this.#addOneAnswer(variants_array[f], f == this.correct_answer ? 1 : 0);

			//this.wholetext += "<br><button type='button' onclick='verifyAnswer2(document.getElementsByName(\"choose_answer_" + this.class_idx + "\"));'>Trimite raspuns</button>";
			this.wholetext += "<br><button type='button' onclick='verifyAnswer(" + this.class_idx + ");'>Verifica-mă!</button>";
			this.wholetext += "<br><br><div id='explanation" + this.class_idx + "'> Alegeți un răspuns...</div><br><br>";

			this.answer_submitted = false;
			this.answer_is_correct = 0;

			this.wholetext += "<hr>";
		}

		//private method, add one answer to formatted html result
		#addOneAnswer(answer_text, is_correct) {
			this.wholetext += "<p><input type='radio' name='choose_answer" + this.class_idx + "'  value='" + is_correct + "'>" + answer_text + "</p>";
			//this.wholetext += "<br>";
		}

		//public method, return formatted html text
		getFormattedText() {
			return this.wholetext;
		}

		//public method, return total number of instances
		getTotalInstances() {
			return askOneQuestion.class_counter;
		}

		//setters and getters, description of each is in the class description
		set response_sent(v) { this.answer_submitted = 1; } //mark this question as answered
		get response_sent() { return this.answer_submitted; }
		set correct(v) { if (this.answer_submitted == 0) this.answer_is_correct = 1; } //set correct response only on first try
		get correct() { return this.answer_is_correct; }

		//public method, return current instance index
		getClassIdx() {
			return this.class_idx;
		}

	} //end class