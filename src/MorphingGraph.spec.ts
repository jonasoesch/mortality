import 'jest';
import * as d3 from 'd3';
import {MorphingGraph} from './MorphingGraph';
import {Graph} from './Graph'
import {Mark} from './Mark'


let pathSelector = `body #A-B .paths path`
d3.select(document).select("body").append("div").attr("id", "A").style("width", 1280).style("height", 720)
d3.select(document).select("body").append("div").attr("id", "B").style("width", 1280).style("height", 720)
d3.select(document).select("body").append("div").attr("id", "A-B").style("width", 1280).style("height", 720)

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
g1.addMark("a")
g1.setData(d1)


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
g2.addMark("b")
g2.setData(d2)

let a = new MorphingGraph("A-B")
a.setOrigin(g1)
a.setTarget(g2)
a.addTransition("a", "b")

describe("initialize", () => {
    it("is a MorphingGraph object", () => {
        expect(a).toBeInstanceOf(MorphingGraph)
    })

    it("has the right origin graph", () => {
        expect(a.originGraph).toEqual(g1)
    })
    
    it("has the right target graph", () => {
        expect(a.targetGraph).toEqual(g2)
    })


    it("should have one property", () => {
        expect(a.marks.length).toEqual(1)
    })

    it("It has a property with the right settings", () => {
        let prop = new Mark("a---b")
        expect(a.marks[0]).toMatchObject(prop) 
    })

})


describe( "path drawing", () => {

    a.atPoint(0.5).draw()

    it("draws a path", () => {
        a.atPoint(0.5).draw()
        let doc = d3.select(document).select(pathSelector)
        expect(doc.size()).toEqual(1)
    })

    it("draws the correct path", () => {
        a.atPoint(0.5).draw()
        let doc = d3.select(document).select(pathSelector)
        //expect(doc.attr("d")).toEqual("M80,640L1200,80L1200,80L80,640Z")
    })

    it("draws the correct starting path", () => {
        a.atPoint(0).draw()
        let doc = d3.select(document).select(pathSelector)
        expect(doc.attr("d")).toEqual("M80,640L1106.7305498516998,780L1200,80L1200,80Z")
    })

    it("draws the correct final path", () => {
        a.atPoint(1).draw()
        let doc = d3.select(document).select(pathSelector)
        expect(doc.attr("d")).toEqual(g2.getPathFor("b"))
    })
    
    it("the starting path and the final path should not be the same", () => {
        a.atPoint(0).draw()
        let doc1 = d3.select(document).select(pathSelector)
        a.atPoint(1).draw()
        let doc2 = d3.select(document).select(pathSelector)
        expect(doc1.attr("d")).not.toEqual(doc2.attr("d"))
    })
    
} )

describe("other interpolations", () => {
    g1.marks.forEach( mark => mark.setColor("white"))
    g2.marks.forEach( mark => mark.setColor("black"))

    it("interpolates between colors", () => {
        a.atPoint(0.5).draw()     
        let path = d3.select(document).select(pathSelector)
        expect(path.attr("fill")).toEqual("rgb(119, 119, 119)") // not in the center because of easing
    })
})
