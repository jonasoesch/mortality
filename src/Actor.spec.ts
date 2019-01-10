import 'jest';
import * as d3 from 'd3';
import {Actor} from './Actor';
import {Graph} from './Graph'


// First Graph
let d1 = [
    {date: new Date(Date.parse("2000-01-01")), "a": 2}, 
    {date: new Date(Date.parse("2011-01-01")), "a": 1},
    {date: new Date(Date.parse("2012-01-01")), "a": 6}
]
let g1 = new Graph("A")
g1.setScales(
    [d1[0].date, d1[2].date],
    [d1[0].a, d1[2].a]
)
g1.setData(d1)
g1.setClasses(d1)


// Second Graph
let d2 = [
    {date: new Date(Date.parse("2010-01-01")), "b": 4}, 
    {date: new Date(Date.parse("2018-01-01")), "b": 8}
]
let g2 = new Graph("B")
g2.setScales(
    [d2[0].date, d2[1].date], 
    [d2[0].b, d2[1].b]
)
g2.setData(d2)
g2.setClasses(d2)

let a = new Actor("Jonas")
a.setOrigin(g1, "a")
a.setTarget(g2, "b")
a.setStage(d3.select(document).select("body").append("svg"))

describe("initialize", () => {
    it("is an Actor object", () => {
        expect(a).toBeInstanceOf(Actor)
    })

    it("sets the origin correctly", () => {
        expect(a.originGraph).toEqual(g1)
        expect(a.originProperty).toEqual("a")
    })

    it("sets the target correctly", () => {
        expect(a.targetGraph).toEqual(g2)
        expect(a.targetProperty).toEqual("b")
    })
})


describe( "path drawing", () => {
    it("draws a path", () => {
        a.draw(0.5)
        let doc = d3.select(document).select("body svg .Jonas path")
        expect(doc.size()).toEqual(1)
    })

    it("draws the correct path", () => {
        a.draw(0.5)
        let doc = d3.select(document).select("body svg .Jonas path")
        //expect(doc.attr("d")).toEqual("M80,640L1200,80L1200,80L80,640Z")
    })

    it("draws the correct starting path", () => {
        a.draw(0)
        let doc = d3.select(document).select("body svg .Jonas path")
        expect(doc.attr("d")).toEqual(g1.getPathFor("a"))
    })

    it("draws the correct final path", () => {
        a.draw(1)
        let doc = d3.select(document).select("body svg .Jonas path")
        expect(doc.attr("d")).toEqual(g2.getPathFor("b"))
    })
    
    it("the starting path and the final path should not be the same", () => {
        a.draw(0)
        let doc1 = d3.select(document).select("body svg .Jonas path")
        a.draw(1)
        let doc2 = d3.select(document).select("body svg .Jonas path")
        expect(doc1.attr("d")).not.toEqual(doc2.attr("d"))
    })
    
} )

describe("other interpolations", () => {
    g1.setColors(["white"])
    g2.setColors(["black"])

    it("interpolates between colors", () => {
        a.draw(0.5)     
        let path = d3.select(document).select("body svg .Jonas path")
        expect(path.attr("fill")).toEqual("rgb(128, 128, 128)")
    })
})
