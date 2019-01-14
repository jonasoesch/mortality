import * as d3 from "d3";
import {Graph} from "./Graph"
let l = console.log


class UptickGraph extends Graph {
}

export function graph() {
    return d3.csv("data/mortality-rate.csv").then((csv: any) => {
        let data:MortalityData[] = csv.map((d:any) => {
            return {
                date: new Date(Date.parse(d["date"])),
                Rate85up: parseFloat(d["Normalized85up"]),
                Rate75_84: parseFloat(d["Normalized75-84"]),
                Rate65_74: parseFloat(d["Normalized65-74"]),
                Rate55_64: parseFloat(d["Normalized55-64"]),
                Rate45_54: parseFloat(d["Normalized45-54"]),
                Rate25_44: parseFloat(d["Normalized25-44"]),
                Rate_25: parseFloat(d["Normalized-25"]),
            }
        } )

        let graph = new UptickGraph("uptick")
        graph.setDescription("The evolution of the mortality rate since 1968 by age group")
        graph.setScales(d3.extent(data, d => d.date), [0, 100])
        graph.setColors([
            "rgb(117, 212, 156)",
            "rgb(60, 190, 203)",
            "rgb(26, 130, 140)",
            "rgb(38, 148, 222)",
            "rgb(47, 105, 160)",
            "rgb(154, 129, 232)",
            "rgb(125, 75, 186)",
        ])
        graph.setLabels([
            "Over 85",
            "75–84",
            "65–74",
            "55–64",
            "45–54",
            "25–44",
            "Under 25",
        ])
        graph.setLabelOffsets([
            [0, 0],
            [0, -17],
            [0, 8],
            [0, 28],
            [0, 7],
            [0, 3],
            [0, 5],
        ])
        graph.setData(data)
        return graph
    })
}
