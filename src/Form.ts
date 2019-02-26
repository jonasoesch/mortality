import * as d3 from 'd3'
import {Drawable} from './Graph'
import {Logger} from "./Logger"

/**
 * This class creates a form that adheres to the `Drawable` interface.
 * It also contains the necessary methods to submit the answers to the server.
 * Example usage:
 *
 * ```javascript
 * let new Form = new Form("survey")
 * form.addQuestion("Question 1")
 * form.addChoice("Question 2", ["Answer1", "Answer2"])
 * form.setNextPage("http://google.ch") // Where to redirect after submit 
 * form.setLogger(logger) //typically use the same logger as in the Director
 * form.draw()
 * ```
 **/
export class Form implements Drawable {
    name:string
    questions:Question[]
    description:string
    nextPage:string
    logger:Logger

    constructor(name:string) {
        this.name = name
        this.questions = []
    }

    addQuestion(question:string) {
        this.questions.push(new TextQuestion(question))
    }

    addChoice(question:string, options:string[]) {
        let q = new ChoiceQuestion(question)
        q.setOptions(options)
        this.questions.push(q)
    }

    setNextPage(page:string) {
        this.nextPage = page 
    }

    setLogger(logger:Logger) {
        this.logger = logger 
    }


    /**
     * Renders all the questions and an submit-button that
     * will send the answers to the API and the reader to the next page
     * when clicked.
     **/
    draw() {
        let form = d3.select(`#${this.name}`).append("div").attr("class", "form")

        this.questions.forEach( q => q.drawInto(form) )

        form.append("button")
            .text("Send answers")
            .on('click', () => {
                try {
                    this.submit()
                } catch(e) {
                    alert(e.message)
                }
            })
    }


    /**
     * Get answer texts/choices entered by the reader
     **/
    getAnswers():string[] {
        let form = d3.select(`#${this.name}`)
        let answers = this.questions.map( q => q.getAnswerFrom(form) )
        return answers
    }


    /**
     * The answers are being stored in the following format:
     * 
     * | Timestamp    | URL                               | User ID from cookie        | Session ID                  | Answer 1 | Answer 2 | … |
     * | ------------ | --------------------------------- | -------------------------- | --------------------------- | -------- | -------- | - |
     * | 1549378636889| http://localhost:8080/causes.html | 1548336577427-0.vtnhnwsxab | 1549378630957-0.eau30gzms7q | Yes      | No       | - |
     **/
    format(answers:string[]):string {
        let out = ""
        out = out + this.logger.wrap( Date.now().toString()) + "," // Timestamp
        out = out + this.logger.wrap( this.logger.url ) + "," // URL
        out = out + this.logger.wrap( this.logger.user ) + "," // User ID from cookie
        out = out + this.logger.wrap( this.logger.session ) + "," // Session ID
        answers.forEach( a => { out = out + this.logger.wrap(a) + "," } )
        return out
    }


    /**
     * Send the answers to the API-Endpoint and redirect to the next page
     * But only if the transmission was successful.
     **/
    submit() {
        let answers = this.getAnswers()
        answers.forEach( a => { 
            if(a === ""){
                throw new Error("All fields must be completed") // don't send if answers are empty
            }
        })         
        const body = this.format(answers)
        fetch("__API_URL__"+"form", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body,
        })
            .then( (response) => {
                if (!response.ok) {
                    throw new Error("The server is doing funny things. Please try again.") 
                }
                return response.text()
            })
            .then( (text) => {
                if(text !== "OK") {
                    throw new Error("The server is doing funny things. Please try again.") 
                }
                window.location.href = this.nextPage
            })
    }


    hide() {
        d3.select(`#${this.name}`).style("opacity", 0)
    }
}


/**
 * Defines the basic methods that should be implemented by all questions
 **/
abstract class Question {
    label:string
    constructor(label) {
        this.label = label 
    }
    abstract drawInto(element:d3.Selection<any, any, any, any>):void
        abstract getAnswerFrom(element:d3.Selection<any, any, any, any>):string
    protected name() {
        return this.esc(this.label)
    }
    private esc(str:string) {
        return str.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')
    }
}

/**
 * A free-form text question
 **/
class TextQuestion extends Question {
    drawInto(element) {
        element.append("label")
            .text(this.label)
        element.append("textarea")
            .attr("type" ,"text")
            .attr("placeholder", "Your answer…")
            .attr("name", this.name()) 
    }

    getAnswerFrom(element) {
        return element.select(`textarea[name="${this.name()}"]`).node().value
    }
}

/**
 * A multiple-choice question
 **/
class ChoiceQuestion extends Question {
    options:string[]
    setOptions(options:string[]) {
        this.options = options 
    }
    drawInto(element) {
        element.append("label")
            .text(this.label)
        this.options.forEach( o => {
            element.append("input")  
                .attr("type", "radio")
                .attr("name", this.name())
                .attr("value", o)
            element.append("label")
                .attr("class", "radio-label")
                .text(o)
        })
    }
    getAnswerFrom(element) {
        let out = ""
        element.selectAll(`input[name="${this.name()}"]`).each( function(el) {
            if(this.checked) {
                out =  this.value 
            }   
        })
        return out
    }
}
