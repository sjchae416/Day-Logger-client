import React from 'react';
import debounce from 'lodash.debounce';
import { useState, useEffect } from 'react';
import { getQuestionsAPIMethod } from '../api/client';

function LogDay({ questions, setQuestions }) {
	const [numberResponses, setNumberResponses] = useState('');
	const [booleanResponses, setBooleanResponses] = useState('');
	const [textResponses, setTextResponses] = useState('');
	const [mcqResponses, setMcqResponses] = useState('');
	const [selectedDate, setSelectedDate] = useState(null);
	// var today = new Date();
	// let year = today.getFullYear();
	// let month = today.getMonth() + 1;
	// let date = today.getDate();

	useEffect(() => {
		getQuestionsAPIMethod().then((questions) => {
			setQuestions(questions);
		});
		setDate();
	}, []);

	const setDate = (newDate) => {
		const date = newDate || new Date();
		setSelectedDate(
			date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
		);
	};

	const getPrevDate = () => {
		const currentDayInMilli = new Date(selectedDate).getTime();
		const oneDay = 1000 * 60 * 60 * 24;
		const previousDayInMilli = currentDayInMilli - oneDay;
		const previousDate = new Date(previousDayInMilli);

		setDate(previousDate);
	};

	const getNextDate = () => {
		const currentDayInMilli = new Date(selectedDate).getTime();
		const oneDay = 1000 * 60 * 60 * 24;
		const nextDayInMilli = currentDayInMilli + oneDay;
		const nextDate = new Date(nextDayInMilli);

		setDate(nextDate);
	};

	// debounce for number question
	const updateNumber = (newNumber) => setNumberResponses(newNumber);
	const debounceOnChangeNumber = (newNumber) =>
		debounce(updateNumber(newNumber), 5000);

	// debounce for text question
	const updateText = (newText) => setTextResponses(newText);
	const debounceOnChangeText = (newText) => debounce(updateText(newText), 5000);

	const saveResponses = async () => {
		for (var i = 0; i < questions.length; i++) {
			console.log(questions[i].type);
			if (questions[i].type === 'number') {
				console.log(numberResponses);
				const data = await fetch('/api/questions/' + questions[i]._id, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						text: questions[i].text,
						type: questions[i].type,
						date: questions[i].date,
						choices: questions[i].choices,
						responses: numberResponses,
					}),
				})
					.then((res) => res.json())
					.catch((e) => console.log(e));
			} else if (questions[i].type === 'boolean') {
				console.log(booleanResponses);
				const data = await fetch('/api/questions/' + questions[i]._id, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						text: questions[i].text,
						type: questions[i].type,
						date: questions[i].date,
						choices: questions[i].choices,
						responses: booleanResponses,
					}),
				})
					.then((res) => res.json())
					.catch((e) => console.log(e));
			} else if (questions[i].type === 'text') {
				console.log(textResponses);
				const data = await fetch('/api/questions/' + questions[i]._id, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						text: questions[i].text,
						type: questions[i].type,
						date: questions[i].date,
						choices: questions[i].choices,
						responses: textResponses,
					}),
				})
					.then((res) => res.json())
					.catch((e) => console.log(e));
			} else {
				console.log(mcqResponses);
				const data = await fetch('/api/questions/' + questions[i]._id, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						text: questions[i].text,
						type: questions[i].type,
						date: questions[i].date,
						choices: questions[i].choices,
						responses: mcqResponses,
					}),
				})
					.then((res) => res.json())
					.catch((e) => console.log(e));
			}
		}
	};

	if (!questions.length) {
		return (
			<div className="logday-wrapper">
				<div className="date-wrapper">
					<button className="btn-prev-date" onClick={getPrevDate}>
						{'<'}
					</button>
					<div className="displaying-date">{}</div>
					<button className="btn-next-date" onClick={getNextDate}>
						{'>'}
					</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="logday-wrapper">
				<div className="date-wrapper">
					<button className="btn-prev-date" onClick={getPrevDate}>
						{'<'}
					</button>
					{/* <div className="displaying-date">{questions[0].date}</div> */}
					{/* TODO we should display the today's date and then according to the date shown, we should show the corresponding responses :) */}
					<div className="displaying-date">{selectedDate}</div>
					<button className="btn-next-date" onClick={getNextDate}>
						{'>'}
					</button>
				</div>

				<div className="questions-list">
					{questions.map((question) => (
						<div className="question" key={question._id}>
							<div className="question-text">{question.text}</div>
							{question.type === 'number' ? (
								<input
									className="number-type"
									onChange={(e) => debounceOnChangeNumber(e.target.value)}
								></input>
							) : question.type === 'boolean' ? (
								<div className="boolean">
									<input
										className="boolean-type"
										type="radio"
										name={question._id}
										value="True"
										onChange={(e) => setBooleanResponses(e.target.value)}
									></input>
									<div className="boolean-text">True</div>
									<input
										className="boolean-type"
										type="radio"
										name={question._id}
										value="False"
										onChange={(e) => setBooleanResponses(e.target.value)}
									></input>
									<div className="boolean-text">False</div>
								</div>
							) : question.type === 'text' ? (
								<input
									className="text-type"
									onChange={(e) => debounceOnChangeText(e.target.value)}
								></input>
							) : question.type === 'multiple-choice' ? (
								<div className="multiple-choice">
									<div className="choices">
										<input
											className="multiple-choice-type"
											type="radio"
											name={question._id}
											value={question.choices[0]}
											onChange={(e) => setMcqResponses(e.target.value)}
										></input>
										<div className="mcq-text">{question.choices[0]}</div>
									</div>
									<div className="choices">
										<input
											className="multiple-choice-type"
											type="radio"
											name={question._id}
											value={question.choices[1]}
											onChange={(e) => setMcqResponses(e.target.value)}
										></input>
										<div className="mcq-text">{question.choices[1]}</div>
									</div>
									<div className="choices">
										<input
											className="multiple-choice-type"
											type="radio"
											name={question._id}
											value={question.choices[2]}
											onChange={(e) => setMcqResponses(e.target.value)}
										></input>
										<div className="mcq-text">{question.choices[2]}</div>
									</div>
								</div>
							) : (
								''
							)}
						</div>
					))}
				</div>

				<input
					className="save-questions"
					type="submit"
					value="Submit"
					onClick={saveResponses}
				/>
			</div>
		);
	}
}

export default LogDay;
