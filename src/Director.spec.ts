import 'jest'
import {Director} from './Director'
import {Graph} from './Graph'
import {MorphingGraph} from './MorphingGraph'
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
g1.setMarkNames(d1)


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
g2.setMarkNames(d2)

let a:MorphingGraph = new MorphingGraph("a-b")
a.setOrigin(g1)
a.setTarget(g2)
a.addTransition("a", "b")


let d = new Director()

describe("initialize director", () => {
    it("first", () => {
        expect(true).toEqual(true)
    })
})


describe("scrolling behavior", () => {
})
