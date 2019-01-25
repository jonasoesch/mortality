import * as d3 from "d3";
import {Graph} from './Graph';
import {StackedGraph} from './StackedGraph';
let l = console.log

export function genderGraph() {
    return d3.csv("data/mortality-rate.csv").then((csv: any) => {
        let data:MortalityData[] = csv.map((d:any) => {
            return {
                date: new Date(Date.parse(d["date"])),
                MortalityEveryone: parseFloat(d["MortalityEveryone"]),
                MortalityFemales: parseFloat(d["MortalityFemales"]),
                MortalityMales: parseFloat(d["MortalityMales"]),
            }
        } )

        let graph = new Graph("decrease")
        graph.setDescription("Evolution of the mortality rate since 1968")
        graph.setAxisLabels("Deaths per 100'000 persons")
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


class OlderGraph extends StackedGraph {
    formatLeftAxis(axis:d3.Axis<any>)  {
        return axis.tickFormat(d3.format(".0%")) 
    }
}

export function demographicsGraph() {
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
        graph.setDescription("The population is getting older")
        graph.setAxisLabels("Share of the (living) U. S. population")


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


export function ageDifferencesGraph() {
    return d3.csv("data/mortality-rate.csv").then((csv: any) => {
        console.log(csv)
        let data:MortalityData[] = csv.map((d:any) => {
            return {
                date: new Date(Date.parse(d["date"])),
                Rate85up     : parseFloat(d["Rate85up" ]),
                Rate75_84    : parseFloat(d["Rate75-84"]),
                Rate65_74    : parseFloat(d["Rate65-74"]),
                Rate55_64    : parseFloat(d["Rate55-64"]),
                Rate45_54    : parseFloat(d["Rate45-54"]),
                Rate25_44    : parseFloat(d["Rate25-44"]),
                Rate_25      : parseFloat(d["Rate-25"  ])
            }
        } )

        let graph = new Graph("differences")
        graph.setDescription("Older people have a higher mortality")
        graph.setAxisLabels("Deaths per 100'000 persons")
        graph.setScales(d3.extent(data, d => d.date), [0, 20000])


            graph.addMark("Rate85up")
                .setColor("rgb(125, 75, 186)")
                .setLabel("Over 84")
                .setLabelOffsets([0, 3])

            graph.addMark("Rate75_84")
                .setColor("rgb(154, 129, 232)")
                .setLabel("75–84")
                .setLabelOffsets([0, 3])

            graph.addMark("Rate65_74")
                .setColor("rgb(47, 105, 160)")
                .setLabel("65–74")
                .setLabelOffsets([0, 0])

            graph.addMark("Rate55_64")
                .setColor("rgb(38, 148, 222)")
                .setLabel("55–64")
                .setLabelOffsets([0, -5])

            graph.addMark("Rate45_54")
                .setColor("rgb(26, 130, 140)")
                .setLabel("45–54")
                .setLabelOffsets([0, 0])

            graph.addMark("Rate25_44")
                .setColor("rgb(60, 190, 203)")
                .setLabel("25–44")
                .setLabelOffsets([0, 8])

            graph.addMark("Rate_25")
                .setColor("rgb(117, 212, 156)")
                .setLabel("Under 25")
                .setLabelOffsets([0, 25])

        graph.setData(data)

        return graph
    })
}



export function uptickGraph() {
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

        let graph = new Graph("uptick")
        graph.setDescription("Mortality is falling in all age groups")
        graph.setAxisLabels("Mortality rate relative to 1968")
        graph.setScales(d3.extent(data, d => d.date), [0, 100])


            graph.addMark("Rate85up")
                .setColor("rgb(125, 75, 186)")
                .setLabel("Over 84")
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

        graph.setData(data)

        return graph
    })
}


export function aidsGraph() {
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
        let graph = new StackedGraph("aids")
        graph.setAxisLabels("Total deaths and their cause of 25–44 year olds")
        graph.setDescription("Aids slowed the fall in the 90's for 25–44 year olds")
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
