import * as d3 from 'd3'
import {Drawable} from './Graph'
import {Logger} from "./Logger"

export class Form implements Drawable {
    name:string
    questions:string[]
    description:string
    nextPage:string
    logger:Logger

    constructor(name:string) {
        this.name = name
        this.questions = []
    }

    addQuestion(question:string) {
        this.questions.push(question)
    }

    setNextPage(page:string) {
        this.nextPage = page 
    }

    setLogger(logger:Logger) {
        this.logger = logger 
    }


    draw() {

        // Don't draw the form element multiple times
        let container = d3.select(`#${this.name}`).style("opacity", 1)
        if(container.select('textarea').size() > 0) {return}

        let form = container.append("div").attr("class", "form")

        this.questions.forEach( (q, i) => {
            form.append("label")
                .text(q)
            form.append("textarea")
                .attr("type" ,"text")
                .attr("placeholder", "Your answer…")
                .attr("name", "answer"+i.toString()) 
        } )

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
        let answers = []
        d3.selectAll(`#${this.name} textarea`).each(function(textarea) {
            answers.push((<HTMLTextAreaElement>this).value) 
        })
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
