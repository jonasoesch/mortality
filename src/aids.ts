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
        graph.setMarkNames([
            "Other",
            "Cancer",
            "Heart",
            "LiverKidneyPancreas",
            "Suicide",
            "Vehicle",
            "Homicide",
            "Respiratory",
            "Drug_induced",
            "AIDS",
        ])
        graph.setColors([
            "rgb(135, 145, 155)",
            "rgb(103, 191, 60)",
            "rgb(207, 92, 43)",
            "rgb(27, 122, 199)",
            "rgb(204, 51, 153)",
            "rgb(255, 153, 0)",
            "rgb(200, 200, 0)",
            "rgb(130, 20, 182)",
            "rgb(170, 122, 220)",
            "rgb(241, 49, 71)",
        ])
        graph.setLabels([
            "All other causes of death",
            "Cancer",
            "Heart diseases",
            "Diseases of the liver, kidney, and pancreas",
            "Suicide",
            "Motor vehicle accidents",
            "Homicide",
            "Respiratory diseases",
            "Drug-induced",
            "AIDS",
        ])
        graph.setLabelOffsets([
            [-130, 20],
            [0, 15],
            [-60, 15],
            [-260, -5],
            [-3, 5],
            [-150, 0],
            [-12, -5],
            [-100, -15],
            [-50, 10],
            [0, -10],
        ])
        graph.setData(data)
        return graph

    })
}
