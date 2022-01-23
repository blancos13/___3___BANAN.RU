import React from "react"
import { connect } from "react-redux"
import arrowIcn from "../assets/image/arrowIcn.svg"
import {
    showAnswer,
    hideAnswer,
    scrollToQuestion,
} from "../redux/reducers/FaqReducer"
import "./FrequentlyAskedQuestion.scss"

const FrequentlyAskedQuestionItem = ({
    questionTitle,
    answer,
    showAnswer,
    hideAnswer,
    isShowing,
    id,
}) => {
    return (
        <div
            id={id}
            class={`faq__item faq-item ${isShowing ? "" : "faq-item-hide"}`}
        >
            <div class='faq-item__body'>
                <h2
                    onClick={() =>
                        isShowing ? hideAnswer(id) : showAnswer(id)
                    }
                    class='faq-item__title'
                >
                    {questionTitle} <img src={arrowIcn} alt='hide' />
                </h2>
                <p class='faq-item__content'>{answer}</p>
            </div>
        </div>
    )
}

const FrequentlyAskedQuestion = ({
    questions,
    selectedQuestion,
    showAnswer,
    hideAnswer,
    scrollToQuestion,
}) => {
    React.useEffect(() => {
        if (selectedQuestion) {
            scrollToQuestion(selectedQuestion)
            scrollToQuestion(null)
        }
    }, [selectedQuestion])

    return (
        <div class='faq'>
            <h1 className='faq__title'>FAQ</h1>
            <ul className='faq__items' id='faq-container'>
                {questions.map((question) => (
                    <li>
                        <FrequentlyAskedQuestionItem
                            key={question.id}
                            questionTitle={question.title}
                            answer={question.answer}
                            isShowing={question.isShowing}
                            id={question.id}
                            showAnswer={showAnswer}
                            hideAnswer={hideAnswer}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

const mapStateToProps = (state) => ({
    questions: state.FAQ.questions,
    selectedQuestion: state.FAQ.goToQuestionId,
})

export default connect(mapStateToProps, {
    showAnswer,
    hideAnswer,
    scrollToQuestion,
})(FrequentlyAskedQuestion)
