import * as d3 from 'd3'
import {Drawable} from './Graph'

export class Form implements Drawable {
    name:string
    questions:string[]
    description:string
    nextPage:string

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


    draw() {

        // Don't draw the form element multiple times
        let container = d3.select(`#${this.name}`).style("opacity", 1)
        if(container.select('textarea').size() > 0) {return}
   
        let form = container.append("div").attr("class", "form")

        this.questions.forEach( (q) => {
            form.append("label")
                .text(q)
            form.append("textarea")
                .attr("type" ,"text")
                .attr("placeholder", "Your answer…")
                .attr("name", "answer") 
        } )

        form.append("button")
            .text("Send answers")
            .on('click', () => {
                this.submit() 
            })
    }


    submit() {
        window.location.href = this.nextPage
    }


    hide() {
        d3.select(`#${this.name}`).style("opacity", 0)
    }
}
