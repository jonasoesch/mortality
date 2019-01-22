import * as d3 from "d3";
import {StackedGraph} from './StackedGraph';
let l = console.log


class AidsGraph extends StackedGraph {
}


export function graph() {
    return d3.csv("data/causes.csv").then((csv: any) => {
        let data:CausesData[] = csv.map((d:any) => {
            return {
                date: new Date(Date.parse(d["date"])),
                Other: parseFloat(d["Other"]) || 0,
                Cancer: parseFloat(d["Cancer"]) || 0,
                Heart: parseFloat(d["Heart"]) || 0,
                LiverKidneyPancreas: parseFloat(d["LiverKidneyPancreas"]) || 0,
                Suicide: parseFloat(d["Suicide"]) || 0,
                Vehicle: parseFloat(d["Vehicle"]) || 0,
                Homicide: parseFloat(d["Homicide"]) || 0,
                Respiratory: parseFloat(d["Respiratory"]) || 0,
                Drug_induced: parseFloat(d["Drug-induced"]) || 0,
                AIDS: parseFloat(d["AIDS"]) || 0,
            }
        } )
        let graph = new AidsGraph("aids")
        graph.setDescription("The causes of death for americans between 25 and 44 years old")
        graph.setScales(d3.extent(data, d => d.date), [0, 160000])
        graph.addMark("Other")
            .setColor("rgb(135, 145, 155)")
            .setLabel("All other causes of death")
            .setLabelOffsets([-130, 20])

        graph.addMark("Cancer")
            .setColor("rgb(103, 191, 60)")
            .setLabel("Cancer")
            .setLabelOffsets([0, 15])


        graph.addMark("Heart")
            .setColor("rgb(207, 92, 43)")
            .setLabel("Heart diseases")
            .setLabelOffsets([-60, 15])

        graph.addMark("LiverKidneyPancreas")
            .setColor("rgb(27, 122, 199)")
            .setLabel("Diseases of the liver, kidney, and pancreas")
            .setLabelOffsets([-255, -5])

        graph.addMark("Suicide")
            .setColor("rgb(204, 51, 153)")
            .setLabel("Suicide")
            .setLabelOffsets([-3, 5])

        graph.addMark("Vehicle")
            .setColor("rgb(255, 153, 0)")
            .setLabel("Motor vehicle accidents")
            .setLabelOffsets([-120, 0])

        graph.addMark("Homicide")
            .setColor("rgb(200, 200, 0)")
            .setLabel("Homicide")
            .setLabelOffsets([-12, -5])

        graph.addMark("Respiratory")
            .setColor("rgb(130, 20, 182)")
            .setLabel("Respiratory diseases")
            .setLabelOffsets([-100, -15])

        graph.addMark("Drug_induced")
            .setColor("rgb(170, 122, 220)")
            .setLabel("Drug-induced")
            .setLabelOffsets([-50, 10])

        graph.addMark("AIDS")
            .setColor("rgb(241, 49, 71)")
            .setLabel("AIDS")
            .setLabelOffsets([0, -10])

        graph.setData(data)
        return graph

    })
}
