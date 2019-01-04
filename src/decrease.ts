import * as d3 from "d3";
import * as glob from "./globals.json"
let l = console.log

export function draw() {
d3.csv("/data/mortality-rate.csv").then((csv: any) => {
    let data = csv.map((d) => {
        return {
                date: new Date(Date.parse(d["date"])),
                MortalityEveryone: parseFloat(d["MortalityEveryone"]),
                MortalityFemales: parseFloat(d["MortalityFemales"]),
                MortalityMales: parseFloat(d["MortalityMales"]),
                popshare55_64: parseFloat(d["popshare55-64"]),
                popshare65_74: parseFloat(d["popshare65-74"]),
                popshare75_85: parseFloat(d["popshare75-85"]),
                Rate85up: parseFloat(d["Rate85up"]),
                Rate75_84: parseFloat(d["Rate75-84"]),
                Rate65_74: parseFloat(d["Rate65-74"]),
                Rate55_64: parseFloat(d["Rate55-64"]),
                Rate45_54: parseFloat(d["Rate45-54"]),
                Rate25_44: parseFloat(d["Rate25-44"]),
                Rate_25: parseFloat(d["Rate-25"]),
                Normalized85up: parseFloat(d["Normalized85up"]),
                Normalized75_84: parseFloat(d["Normalized75-84"]),
                Normalized65_74: parseFloat(d["Normalized65-74"]),
                Normalized55_64: parseFloat(d["Normalized55-64"]),
                Normalized45_54: parseFloat(d["Normalized45-54"]),
                Normalized25_44: parseFloat(d["Normalized25-44"]),
                Normalized_25: parseFloat(d["Normalized-25"]),
                Share_25: parseFloat(d["Share-25"]),
                Share25_44: parseFloat(d["Share25-44"]),
                Share45_54: parseFloat(d["Share45-54"]),
                Share55_64: parseFloat(d["Share55-64"]),
                Share65_74: parseFloat(d["Share65-74"]),
                Share75_84: parseFloat(d["Share75-84"]),
                Share85up: parseFloat(d["Share85up"]),
        }
    } )

    graph(data)
})
}



function graph(data:MortalityData[]) {
    let chart = d3.select("#decrease")
        .append("svg")
    
    const h:number = glob["height"]
    const w:number = glob["width"]
    const color = glob["fontColor"]
    const font = glob["fontFamily"]
    const lineWeight = 3
    const margin = 50

    const global = d3.line()
        .y(d => xScale(d["MortalityEveryone"]))
        .x(d => yScale(d["date"]))

    const women = d3.line()
        .y(d => xScale(d["MortalityFemales"]))
        .x(d => yScale(d["date"]))

    const men = d3.line()
        .y(d => xScale(d["MortalityMales"]))
        .x(d => yScale(d["date"]))

    const xScale = d3.scaleLinear()
        .domain([ 0, d3.max(data, d => d["MortalityEveryone"]) ])
        .range([h-margin, margin])
    
    const yScale = d3.scaleTime()
        .domain(d3.extent(data, d => d["date"]))
        .range([margin, w-margin])



    chart
        .attr("width", w)
        .attr("height", h)

    axes(chart, xScale, yScale, w, h, margin, color, font, lineWeight)
    paths(chart, data, lineWeight, global, women, men)

    chart.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${w/8*5}, ${h/4*3})`)
        .append("text")
        .text("Mortality rate per 100'000 people")
        .attr("fill", color)
        .style("font-family", font)
        .style("font-weight", "bold")
        .style("font-size", 18)
}


function paths(chart, data, lineWeight, global, women, men) {
    enum Color {Men = "Blue", Women="Red", Global="White"}

    let paths = chart.append("g").attr("class", "paths")

    paths.append('path')
        .datum(data)
        .attr("d", d => global(<any>d))
        .attr("stroke", Color.Global)

    paths.append('path')
        .datum(data)
        .attr("d", d => women(<any>d))
        .attr("stroke", Color.Women)

    paths.append('path')
        .datum(data)
        .attr("d", d => men(<any>d))
        .attr("stroke", Color.Men)

    paths.selectAll("path")
        .attr("stroke-width", lineWeight)
        .attr("fill", "none")
}


function axes(chart, xScale, yScale, w, h, margin, color, font, lineWeight) {
    let axes = []
    axes.push(
        chart.append("g")
        .attr("class", "axisLeft")
        .attr("transform", `translate(${margin}, 0)`)
        .call(axisLeft(xScale, w))
    )


    axes.push(
        chart.append("g")
        .attr("class", "axisBottom")
        .attr("transform", `translate(0, ${h-margin})`)
        .call(axisBottom(yScale, h))
    )

    axes.forEach( axis => {
        axis.selectAll("line")
            .attr("stroke", d3.color(color).darker(4).toString())
            .style("stroke-width",  lineWeight)

        axis.selectAll("text")
            .attr("fill", d3.color(color).darker(1).toString())
            .style("font-size", "16px")
            .style("font-family", font)
            .style("font-weight", "bold")

        axis.selectAll("path")
            .attr("stroke", "none")
    } )
}

function axisLeft(scale, w) {
    return d3.axisLeft(scale).tickSize(-w).tickPadding(10)
}

function axisBottom(scale, h) {
    return d3.axisBottom(scale).tickSize(-h).tickPadding(10)
}
