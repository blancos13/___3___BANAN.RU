import { scroller } from "react-scroll"
export const SHOW_ANSWER = "SHOW_ANSWER"
export const HIDE_ANSWER = "HIDE_ANSWER"
export const SET_GO_TO_QUESTION = "SET_GO_TO_QUESTION"

const defaultState = {
    goToQuestionId: null,

    questions: [
        {
            id: "FAQ-NOT-SHOWING-UP-FOR-DEPOSIT",
            isShowing: false,
            title: "MY ITEMS ARE NOT SHOWING UP FOR DEPOSIT?",
            answer: "First, make sure your inventory is set to public. By default csgopolygon.com loads items from cache. Occasionally this may become out of date. To load directly from Steam (and update the cache) click the “force reload” button.",
        },
        {
            id: "FAQ-RECEIVED-MY-CREDITS", /// temp !!!!!!!!!!
            isShowing: false,
            title: "IVE DEPOSITED BUT HAVENT RECEIVED MY CREDITS!?",
            answer: "After you have sent the items to the buyer, he must accept your exchange. If the exchange has not been accepted within 10 minutes, the exchange is automatically canceled and your sent items remain with you.If the exchange was successfully accepted, but you still did not receive the coins, please contact our site support.",
        },
        {
            id: "FAQ-HOW-TO-COMPLETE-THE-EXCHANGE", /// temp !!!!!!!!!!
            isShowing: false,
            title: "HOW TO COMPLETE THE EXCHANGE?",
            answer: "You need to go to the 'Deposit / Withdraw' page and check if they sent / received the necessary exchange with the indicated items in the application. Coins are credited to your balance automatically after a successful application. If this was a conclusion: in the case of an unsuccessful application, you will receive an error message and the coins will be returned to your balance, if successful: receive a notification of a successful exchange.",
        },
        ///cloned questions !
        {
            id: "FAQ-NOT-SHOWING-UP-FOR-DEPOSIT",
            isShowing: false,
            title: "MY ITEMS ARE NOT SHOWING UP FOR DEPOSIT?",
            answer: "First, make sure your inventory is set to public. By default csgopolygon.com loads items from cache. Occasionally this may become out of date. To load directly from Steam (and update the cache) click the “force reload” button.",
        },
        {
            id: "FAQ-RECEIVED-MY-CREDITS", /// temp !!!!!!!!!!
            isShowing: false,
            title: "IVE DEPOSITED BUT HAVENT RECEIVED MY CREDITS!?",
            answer: "After you have sent the items to the buyer, he must accept your exchange. If the exchange has not been accepted within 10 minutes, the exchange is automatically canceled and your sent items remain with you.If the exchange was successfully accepted, but you still did not receive the coins, please contact our site support.",
        },
        {
            id: "FAQ-HOW-TO-COMPLETE-THE-EXCHANGE", /// temp !!!!!!!!!!
            isShowing: false,
            title: "HOW TO COMPLETE THE EXCHANGE?",
            answer: "You need to go to the 'Deposit / Withdraw' page and check if they sent / received the necessary exchange with the indicated items in the application. Coins are credited to your balance automatically after a successful application. If this was a conclusion: in the case of an unsuccessful application, you will receive an error message and the coins will be returned to your balance, if successful: receive a notification of a successful exchange.",
        },
        {
            id: "FAQ-NOT-SHOWING-UP-FOR-DEPOSIT",
            isShowing: false,
            title: "MY ITEMS ARE NOT SHOWING UP FOR DEPOSIT?",
            answer: "First, make sure your inventory is set to public. By default csgopolygon.com loads items from cache. Occasionally this may become out of date. To load directly from Steam (and update the cache) click the “force reload” button.",
        },
        {
            id: "FAQ-RECEIVED-MY-CREDITS", /// temp !!!!!!!!!!
            isShowing: false,
            title: "IVE DEPOSITED BUT HAVENT RECEIVED MY CREDITS!?",
            answer: "After you have sent the items to the buyer, he must accept your exchange. If the exchange has not been accepted within 10 minutes, the exchange is automatically canceled and your sent items remain with you.If the exchange was successfully accepted, but you still did not receive the coins, please contact our site support.",
        },
        {
            id: "FAQ-HOW-TO-COMPLETE-THE-EXCHANGE", /// temp !!!!!!!!!!
            isShowing: false,
            title: "HOW TO COMPLETE THE EXCHANGE?",
            answer: "You need to go to the 'Deposit / Withdraw' page and check if they sent / received the necessary exchange with the indicated items in the application. Coins are credited to your balance automatically after a successful application. If this was a conclusion: in the case of an unsuccessful application, you will receive an error message and the coins will be returned to your balance, if successful: receive a notification of a successful exchange.",
        },
        {
            id: "FAQ-NOT-SHOWING-UP-FOR-DEPOSIT",
            isShowing: false,
            title: "MY ITEMS ARE NOT SHOWING UP FOR DEPOSIT?",
            answer: "First, make sure your inventory is set to public. By default csgopolygon.com loads items from cache. Occasionally this may become out of date. To load directly from Steam (and update the cache) click the “force reload” button.",
        },
        {
            id: "FAQ-RECEIVED-MY-CREDITS", /// temp !!!!!!!!!!
            isShowing: false,
            title: "IVE DEPOSITED BUT HAVENT RECEIVED MY CREDITS!?",
            answer: "After you have sent the items to the buyer, he must accept your exchange. If the exchange has not been accepted within 10 minutes, the exchange is automatically canceled and your sent items remain with you.If the exchange was successfully accepted, but you still did not receive the coins, please contact our site support.",
        },
        {
            id: "FAQ-HOW-TO-COMPLETE-THE-EXCHANGE", /// temp !!!!!!!!!!
            isShowing: false,
            title: "HOW TO COMPLETE THE EXCHANGE?",
            answer: "You need to go to the 'Deposit / Withdraw' page and check if they sent / received the necessary exchange with the indicated items in the application. Coins are credited to your balance automatically after a successful application. If this was a conclusion: in the case of an unsuccessful application, you will receive an error message and the coins will be returned to your balance, if successful: receive a notification of a successful exchange.",
        },
        ///from profile btn -> (?)
        {
            id: "FAQ-REFERAL_LINK", /// temp !!!!!!!!!!
            isShowing: false,
            title: "FAQ-REFERAL_LINK TESTS",
            answer: "You need to go to the 'Deposit / Withdraw' page and check if they sent / received the necessary exchange with the indicated items in the application. Coins are credited to your balance automatically after a successful application. If this was a conclusion: in the case of an unsuccessful application, you will receive an error message and the coins will be returned to your balance, if successful: receive a notification of a successful exchange.",
        },
        /// from profile btn -> (?) /// end
        {
            id: "FAQ-NOT-SHOWING-UP-FOR-DEPOSIT",
            isShowing: false,
            title: "MY ITEMS ARE NOT SHOWING UP FOR DEPOSIT?",
            answer: "First, make sure your inventory is set to public. By default csgopolygon.com loads items from cache. Occasionally this may become out of date. To load directly from Steam (and update the cache) click the “force reload” button.",
        },
        {
            id: "FAQ-RECEIVED-MY-CREDITS", /// temp !!!!!!!!!!
            isShowing: false,
            title: "IVE DEPOSITED BUT HAVENT RECEIVED MY CREDITS!?",
            answer: "After you have sent the items to the buyer, he must accept your exchange. If the exchange has not been accepted within 10 minutes, the exchange is automatically canceled and your sent items remain with you.If the exchange was successfully accepted, but you still did not receive the coins, please contact our site support.",
        },
        {
            id: "FAQ-HOW-TO-COMPLETE-THE-EXCHANGE", /// temp !!!!!!!!!!
            isShowing: false,
            title: "HOW TO COMPLETE THE EXCHANGE?",
            answer: "You need to go to the 'Deposit / Withdraw' page and check if they sent / received the necessary exchange with the indicated items in the application. Coins are credited to your balance automatically after a successful application. If this was a conclusion: in the case of an unsuccessful application, you will receive an error message and the coins will be returned to your balance, if successful: receive a notification of a successful exchange.",
        },
        {
            id: "FAQ-NOT-SHOWING-UP-FOR-DEPOSIT",
            isShowing: false,
            title: "MY ITEMS ARE NOT SHOWING UP FOR DEPOSIT?",
            answer: "First, make sure your inventory is set to public. By default csgopolygon.com loads items from cache. Occasionally this may become out of date. To load directly from Steam (and update the cache) click the “force reload” button.",
        },
        {
            id: "FAQ-RECEIVED-MY-CREDITS", /// temp !!!!!!!!!!
            isShowing: false,
            title: "IVE DEPOSITED BUT HAVENT RECEIVED MY CREDITS!?",
            answer: "After you have sent the items to the buyer, he must accept your exchange. If the exchange has not been accepted within 10 minutes, the exchange is automatically canceled and your sent items remain with you.If the exchange was successfully accepted, but you still did not receive the coins, please contact our site support.",
        },
        {
            id: "FAQ-HOW-TO-COMPLETE-THE-EXCHANGE", /// temp !!!!!!!!!!
            isShowing: false,
            title: "HOW TO COMPLETE THE EXCHANGE?",
            answer: "You need to go to the 'Deposit / Withdraw' page and check if they sent / received the necessary exchange with the indicated items in the application. Coins are credited to your balance automatically after a successful application. If this was a conclusion: in the case of an unsuccessful application, you will receive an error message and the coins will be returned to your balance, if successful: receive a notification of a successful exchange.",
        },
    ],
}

const FaqReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SHOW_ANSWER:
            return {
                ...state,
                questions: state.questions.map((ques) =>
                    ques.id == action.id ? { ...ques, isShowing: true } : ques
                ),
            }
        case HIDE_ANSWER:
            return {
                ...state,
                questions: state.questions.map((ques) =>
                    ques.id == action.id ? { ...ques, isShowing: false } : ques
                ),
            }
        case SET_GO_TO_QUESTION:
            return {
                ...state,
                goToQuestionId: action.id,
            }

        default:
            return state
    }
}

export const showAnswer = (id) => ({
    type: SHOW_ANSWER,
    id,
})
export const setGoToQuestionId = (id) => ({
    type: SET_GO_TO_QUESTION,
    id,
})

export const hideAnswer = (id) => ({
    type: HIDE_ANSWER,
    id,
})

export const scrollToQuestion = (id) => (dispath) => {
    scroller.scrollTo(id, {
        duration: 1500,
        delay: 100,
        smooth: true,
        containerId: "faq-container",
    })
    dispath(showAnswer(id))
    dispath(setGoToQuestionId(null))
}

export default FaqReducer
