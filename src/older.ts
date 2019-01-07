import * as d3 from "d3";
import {Graph, StackedGraph} from './Graph';
let l = console.log


class OlderGraph extends StackedGraph {
   formatLeftAxis(axis:d3.Axis<any>)  {
        return axis.tickFormat(d3.format(".0%")) 
   }
}


export function draw() {
    d3.csv("data/mortality-rate.csv").then((csv: any) => {
        let data:MortalityData[] = csv.map((d) => {
            return {
                date: new Date(Date.parse(d["date"])),
                popshare25: parseFloat(d["popshare-25"]),
                popshare25_44: parseFloat(d["popshare25-44"]),
                popshare45_54: parseFloat(d["popshare45-54"]),
                popshare55_64: parseFloat(d["popshare55-64"]),
                popshare65_74: parseFloat(d["popshare65-74"]),
                popshare75: parseFloat(d["popshare75+"]),
            }
        } )
 let graph = new OlderGraph("older")
    graph.setScales(d3.extent(data, d => d.date), [0, 1])
    graph.setDescription("Composition of the population by age groups")
    graph.setClasses([
                "popshare25",
                "popshare25_44",
                "popshare45_54",
                "popshare55_64",
                "popshare65_74",
                "popshare75",
    ])
    graph.setColors([
        "rgb(117, 212, 156)",
        "rgb(60, 190, 203)",
        "rgb(26, 130, 140)",
        "rgb(38, 148, 222)",
        "rgb(47, 105, 160)",
        "rgb(154, 129, 232)",
    ])
    graph.setLabels([
        "Under 25",
        "25–44",
        "45–54",
        "55–64",
        "65–74",
        "Over 75",
    ])
    graph.setData(data)
    graph.draw(data)

    })
}
