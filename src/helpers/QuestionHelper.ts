import UserQuestion, { IUserQuestion } from "../schemas/UserQuestion";
import { app } from "../services/Server";
import { getUserByToken } from "./UserHelper";
import QUESTIONS_JSON from '../../data/Questionnaire.json';
import { addEventToQueue, getStateForWallet, QueueState } from "./TaskHelper";
import { IUser } from "../schemas/User";
import { ethers } from "ethers";
import { getDelegatorData } from "./DelegationHelper";

const QUESTIONS: IQuestion[] = QUESTIONS_JSON as IQuestion[];

interface IQuestion {
    question: string,
    questionType: string,
    answers?: [string]
}


export async function startQuestionnaireListener() {

    app.get('/getanswers/:token', async (req, res) => {
        let token = req.params.token;

        if(!token) {
            res.json({success: false, message: "user token not provided"});
            return;
        }

        let user = await getUserByToken(token);

        if(!user) {
            res.json({success: false, message: "User not found"});
            return;
        }

        let answers = await UserQuestion.findOne({user: user._id});

        if(!answers) {
            res.json({success: false, message: "Answers not found"});
            return;
        }

        let questionnaire_data: {question: string, answer: string}[] = [];

        for(let i = 0; i < QUESTIONS.length; i++) {
            questionnaire_data.push({question: QUESTIONS[i].question, answer: answers.answer[i]});
        }

        res.json(questionnaire_data);
    })

    app.post('/answerquestions', async (req, res) => {

        console.log(req.body);

        let token = req.body.token;

        if(!token) {
            res.json({success: false, message: "user token not provided"});
            return;
        }

        let user = await getUserByToken(token);

        if(!user) {
            res.json({success: false, message: "User not found"});
            return;
        }

        let answers = await UserQuestion.findOne({user: user._id});

        if(req.body.answers && req.body.answers.length != QUESTIONS.length) {
            res.json({success:false, message: "Answers submitted don't match required amount"});
            return;
        }

        if(!answers)
            answers = new UserQuestion({
                user: user._id,
                answer: []
            });

        answers.answer = [];

        for(let i = 0; i < QUESTIONS.length; i++) {
            let questionData = QUESTIONS[i];

            if(req.body.answers == undefined || req.body.answers[i] == undefined)
                continue;

            if(questionData.questionType == 'free-form') {

                if(req.body.answers[i].length > 500) {
                    res.json({success: false, message: "Free form answer over 500 character limit"});
                    return;
                }

                answers.answer.push(req.body.answers[i]);
            }

            if(questionData.questionType == 'multiple-choice') {

                if(!questionData.answers) {
                    res.json({success: false, message: "Answers don't exist for this question"});
                    return;
                }

                let answer = questionData.answers[parseInt(req.body.answers[i])];

                if(!answer) {
                    res.json({success: false, message: "Answer index not found"});
                    return;
                }

                answers.answer.push(answer);
            }

        }

        if(answers.answer.length != QUESTIONS.length) {
            res.json({success: false, message: "Amount of answers recieved not equal to required"});
            return;
        }

        await answers.save();

        let state: QueueState | null = null;

        if(!user.rektFinished) {
            addEventToQueue(user.wallet);
            state = getStateForWallet(user.wallet);
        }

        getDelegatorData(user, answers);

        if(state == null)
            state = {state: "ready", queue: 0};

        
        res.json({
            success: true,
            state: state
        })
    })

}