import 'jest'
import {Director} from './Director'
import {Graph} from './Graph'
import {Actor} from './Actor'
import * as d3 from 'd3'


d3.select(document).select("body").append("div").attr("id", "A")
d3.select(document).select("body").append("div").attr("id", "B")

// First Graph
let d1 = [
    {date: new Date(Date.parse("2000-01-01")), "a": 2}, 
    {date: new Date(Date.parse("2011-01-01")), "a": 1},
    {date: new Date(Date.parse("2012-01-01")), "a": 6}
]
let g1:Graph = new Graph("A")
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
let g2:Graph = new Graph("B")
g2.setScales(
    [d2[0].date, d2[1].date], 
    [d2[0].b, d2[1].b]
)
g2.setData(d2)
g2.setClasses(d2)

let a:Actor = new Actor("a-b")
a.setOrigin(g1, "a")
a.setTarget(g2, "b")
a.setStage(g1.chart)



let d = new Director("Ferdinand")
d.setFromTo(g1, g2)
d.setAnimatedProperties([["a", "b"], ["a", "b"]])

describe("initialize director", () => {

    it("should should have a name", () => {
        expect(d.name).toBe("Ferdinand")
    })
    
    it("should an initial and a final graph state", () => {
        expect(d.initial).toEqual(g1) 
        expect(d.final).toEqual(g2) 
    })

    it("should have a stage", () => {
        expect(d.stage).toMatchObject(g1.chart)
    })


    it("should have a width and height", () => {
        expect(d.start).toBeTruthy
        expect(d.end).toBeTruthy
    })


    it("should have actors", () => {
        expect(d.actors.length).toEqual(2) 
    })


    it("should create an actor for each animateable property", () => {
        expect(d.actors[0]).toMatchObject(a)
    })
})


describe("scrolling behavior", () => {
    it("should create an actor when scrolling far enough", () => {
        g1.draw()
        d.scrolling({pageY: 300})
        expect(d.stage.select(".a-b").node()).toBeTruthy()
    })

    it("should redraw the actors on scroll", () => {
        g1.draw()
        d.scrolling({pageY: 300})
        let before = d.stage.select(".a-b").node()
        d.scrolling({pageY: 350})
        expect(d.stage.select(".a-b").node()).not.toEqual(before)
    })
})

