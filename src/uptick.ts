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


            graph.addMark("Rate85up")
                .setColor("rgb(125, 75, 186)")
                .setLabel("Over 85")
                .setLabelOffsets([0, 0])

            graph.addMark("Rate75_84")
                .setColor("rgb(154, 129, 232)")
                .setLabel("75–84")
                .setLabelOffsets([0, -17])

            graph.addMark("Rate65_74")
                .setColor("rgb(47, 105, 160)")
                .setLabel("65–74")
                .setLabelOffsets([0, 8])

            graph.addMark("Rate55_64")
                .setColor("rgb(38, 148, 222)")
                .setLabel("55–64")
                .setLabelOffsets([0, 28])

            graph.addMark("Rate45_54")
                .setColor("rgb(26, 130, 140)")
                .setLabel("45–54")
                .setLabelOffsets([0, 7])

            graph.addMark("Rate25_44")
                .setColor("rgb(60, 190, 203)")
                .setLabel("25–44")
                .setLabelOffsets([0, 3])

            graph.addMark("Rate_25")
                .setColor("rgb(117, 212, 156)")
                .setLabel("Under 25")
                .setLabelOffsets([0, 5])

        return graph
    })
}
