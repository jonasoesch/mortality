import * as d3 from "d3";
import {Graph} from './Graph';

export function graph() {
    return d3.csv("data/mortality-rate.csv").then((csv: any) => {
        let data:MortalityData[] = csv.map((d:any) => {
            return {
                date: new Date(Date.parse(d["date"])),
                MortalityEveryone: 1000,
                MortalityMales: parseFloat(d["MortalityMales"]),
            }
        } )

        let graph = new Graph("decrease-everyone")
        graph.setDescription("Evolution of the mortality rate (per 100'000) since 1968")
        graph.setScales(d3.extent(data, d => d.date), [0, d3.max(data, d => d["MortalityMales"])])

        graph.addMark("MortalityEveryone")
            .setColor("rgb(135, 145, 155)")
            .setLabel("Everyone")
            .setLabelOffsets([0,0])

        graph.setData(data)
        graph.setData(data)

        return graph
    })
}

