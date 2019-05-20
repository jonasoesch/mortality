import {Drawable} from "./Drawable"
import {Logger} from "./Logger"

export interface FormDefinition {
        name:string,
        questions:QuestionDefinition[]
        currentPage:string
        logger:Logger
        top:number
}

export interface QuestionDefinition {
    name:string,
    kind:string,
    question:string,
    answers?: string[]
}

export interface MessageDefinition {
    user:string
    session:string
    name:string
    absolutePosition:number
    relativePosition?:number
    answer?:string
}
