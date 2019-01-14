import 'jest'
import * as d3 from 'd3';
import {StackedGraph} from './StackedGraph'

d3.select("body").append("div").attr("id", "Jonas")
let g = new StackedGraph("Jonas")
g.setDescription("The evolution of mortality") 
g.setScales(
    [new Date(Date.parse("2000-01-10")), new Date(Date.parse("2018-11-20"))],
    [0, 1]
)
g.setColors(["red", "blue"])
g.setClasses(["a", "b"])
g.setLabels(["A", "B"])
g.setLabelOffsets([[0,0], [0,0]])
g.setData([
    {"date": new Date(Date.parse("2001-10-05")), "a": 1, "b": 10}, 
    {"date": new Date(Date.parse("2010-11-06")), "a": 2, "b": 0}]
)


describe("initialization", () => {
    it("should have an array with dates", () => {
        expect((g as any).dates[0]).toBeInstanceOf(Date)
        expect((g as any).dates[1]).toBeInstanceOf(Date)
    })

    it("should have the right class names", () => {
        expect(g.classes[0].name).toEqual("a")
        expect(g.classes[1].name).toEqual("b")
    })


    it("should should have an array of array for stacking", () => {
        expect(g.stacks).toHaveLength(2)
        expect(g.stacks[0]).toHaveLength(2)
    })

    it("should not have NaN values in the stack", () => {
        g.stacks.forEach( (stack:number[][]) => {
            stack.forEach( (val:number[]) => {
                expect(val[0]).not.toBeNaN()
                expect(val[1]).not.toBeNaN()
            } )
        }) 
    })


    it("should have the right number of path generators", () => {
        expect(g.paths).toHaveLength(2) 
        g.paths.forEach( path => {
            expect(path).toBeInstanceOf(Function)
        })
    })

})


describe("Paths", ()=> {
    it("should draw the right paths", () => {
        g.draw()
        let path = g.chart.select(".paths path").attr("d")
        expect(path).toEqual("aaaa")
         
    })
})
