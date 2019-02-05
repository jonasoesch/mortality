import * as d3 from 'd3'
import {Drawable} from './Graph'
import {Logger} from "./Logger"

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


    getAnswers():string[] {
        let form = d3.select(`#${this.name}`)
        let answers = this.questions.map( q => q.getAnswerFrom(form) )
        return answers
    }


    format(answers:string[]):string {
        let out = ""
        out = out + this.logger.wrap( Date.now().toString()) + "," // Timestamp
        out = out + this.logger.wrap( this.logger.url ) + "," // URL
        out = out + this.logger.wrap( this.logger.user ) + "," // User ID from cookie
        out = out + this.logger.wrap( this.logger.session ) + "," // Session ID
        answers.forEach( a => { out = out + this.logger.wrap(a) + "," } )
        return out
    }


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
