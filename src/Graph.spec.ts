import 'jest';
import * as d3 from 'd3';
import {Graph} from './Graph';



d3.select(document).select("body").append("div").attr("id", "Jonas")
let g = new Graph("Jonas")
g.setDescription("The evolution of mortality") 
g.setScales(
    [new Date(Date.parse("2000-01-10")), new Date(Date.parse("2018-11-20"))],
    [0, 1]
)
g.setColors(["red"])
g.setLabels(["A"])
g.setLabelOffsets([[0,0]])
g.setData([
    {"date": new Date(Date.parse("2001-10-05")), "a": 1}, 
    {"date": new Date(Date.parse("2010-11-06")), "a": 2}]
)
g.draw()

describe("setup process", () => { 

    test('name', () => {
        expect(g.name).toBe("Jonas")
    });


    test('scales', () => {
        expect(g.xScale(Date.parse("2005-03-20"))).toEqual(388.24793148497605)
        expect(g.yScale(0.5)).toEqual(360)
    });


    test('setData', () => {
        expect(g.data).toBeTruthy()
        expect(g.data[1]["a"]).toEqual(2)
    })

    test('scoping', () => {
        expect(g.data).toBeTruthy()
        expect(g.data[1]["a"]).toEqual(2)
    })
})


describe('document', () => {

    test('snapshot', () => {
        expect(document.getElementsByClassName("axisLeft")[0]).toMatchSnapshot();
    })

    test('description', () => {
        let el = d3.select(document).select("svg .description").text()
        expect(el).toEqual("The evolution of mortality")
    })

    test('label backgrounds', () => {
        let bgs = d3.select(document).select("svg .labels rect")
        expect(bgs.size()).toEqual(1)
    })

    test('label texts', () => {
        let labels = d3.select(document).select("svg .labels text")
        expect(labels.text()).toEqual("A")
    })

    test('paths', () => {
        let path = d3.select(document).select("svg .paths path").attr("d")
        let comp = "M183.07446654086226,80L722.6709246625055,-480L722.6709246625055,-480L183.07446654086226,80Z"
        expect(path).toEqual(comp)
    })

    test('getPathFor', () => {
        let path = g.getPathFor("a")
        let comp = "M183.07446654086226,80L722.6709246625055,-480L722.6709246625055,-480L183.07446654086226,80Z"
        expect(path).toEqual(comp)
    })


    test("different data creates a different path", () => {
        let path1 = g.getPathFor("a")
        g.setData([
            {"date": new Date(Date.parse("2001-10-05")), "a": 1}, 
            {"date": new Date(Date.parse("2010-11-06")), "a": 3}]
        )
        let path2 = g.getPathFor("a")
        expect(path1).not.toEqual(path2)

    })


})

