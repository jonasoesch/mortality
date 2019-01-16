import * as d3 from "d3";
import {StackedGraph} from './StackedGraph';
let l = console.log


class OlderGraph extends StackedGraph {
    formatLeftAxis(axis:d3.Axis<any>)  {
        return axis.tickFormat(d3.format(".0%")) 
    }
}


export function graph() {
    return d3.csv("data/mortality-rate.csv").then((csv: any) => {
        let data:MortalityData[] = csv.map((d:any) => {
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


        graph.addMark("popshare25")
            .setColor("rgb(117, 212, 156)")
            .setLabel("Under 25")


        graph.addMark("popshare25_44")
            .setColor("rgb(60, 190, 203)")
            .setLabel("25–44")


        graph.addMark("popshare45_54")
            .setColor("rgb(26, 130, 140)")
            .setLabel("45–54")

        graph.addMark("popshare55_64")
            .setColor("rgb(38, 148, 222)")
            .setLabel("55–64")


        graph.addMark("popshare65_74")
            .setColor("rgb(47, 105, 160)")
            .setLabel("65–74")


        graph.addMark("popshare75")
            .setColor("rgb(154, 129, 232)")
            .setLabel("Over 75")

        graph.setData(data)
        return graph
    })
}
