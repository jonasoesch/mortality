import * as d3 from "d3";
import {Graph} from './Graph';
let l = console.log

class DecreaseGraph extends Graph {}

export function graph() {
    return d3.csv("data/mortality-rate.csv").then((csv: any) => {
        let data:MortalityData[] = csv.map((d:any) => {
            return {
                date: new Date(Date.parse(d["date"])),
                MortalityEveryone: parseFloat(d["MortalityEveryone"]),
                MortalityFemales: parseFloat(d["MortalityFemales"]),
                MortalityMales: parseFloat(d["MortalityMales"]),
            }
        } )

        let graph = new DecreaseGraph("decrease")
        graph.setDescription("Evolution of the mortality rate (per 100'000) since 1968")
        graph.setScales(d3.extent(data, d => d.date), [0, d3.max(data, d => d["MortalityMales"])])

        graph.addMark("MortalityEveryone")
            .setColor("rgb(135, 145, 155)")
            .setLabel("Everyone")
            .setLabelOffsets([0,0])

        graph.addMark("MortalityFemales")
            .setColor("rgb(204, 51, 153)")
            .setLabel("Women")
            .setLabelOffsets([0,15])


        graph.addMark("MortalityMales")
            .setColor("rgb(27, 122, 199)")
            .setLabel("Men")
            .setLabelOffsets([0,-15])

        graph.setData(data)
        graph.setData(data)

        return graph
    })
}
