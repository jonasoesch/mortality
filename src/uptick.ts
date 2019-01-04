import * as d3 from "d3";
import * as glob from "./globals.json"
let l = console.log

export function draw() {
d3.csv("/data/mortality-rate.csv").then((csv: any) => {
    let data = csv.map((d) => {
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

    graph(data)
})
}

function graph(data:MortalityData[]) {
    let chart = d3.select("#uptick")
        .append("svg")
    
    const h:number = glob["height"]
    const w:number = glob["width"]
    const color = glob["fontColor"]
    const font = glob["fontFamily"]
    const lineWeight = 3
    const margin = 80

    const colors = [
        "rgb(117, 212, 156)",
        "rgb(60, 190, 203)",
        "rgb(26, 130, 140)",
        "rgb(38, 148, 222)",
        "rgb(47, 105, 160)",
        "rgb(154, 129, 232)",
        "rgb(125, 75, 186)",
    ]

   
    let pathGenerators = []
    let properties = []

    for (let prop in data[0]) {
        if( data[0].hasOwnProperty( prop ) && prop !== "date" ) {
            pathGenerators.push(
                d3.line()
                .y(d => xScale(d[prop]))
                .x(d => yScale(d["date"]))
            )

            properties.push(prop)
        } 
    }

    // Scales
    const xScale = d3.scaleLinear()
        .domain([ 0, 100])
        .range([h-margin, margin])
    
    const yScale = d3.scaleTime()
        .domain(d3.extent(data, d => d["date"]))
        .range([margin, w-margin])

    chart
        .attr("width", w)
        .attr("height", h)

    axes(chart, xScale, yScale, w, h, margin, color, font, lineWeight)
    paths(chart, data, lineWeight, pathGenerators, colors, xScale, properties, w, margin, font)

}


function paths(chart, data, lineWeight,pathGenerators, colors, xScale, properties, w, margin, font) {

    let paths = chart.append("g").attr("class", "paths")
    const labels = [
        "Over 85",
        "75–84",
        "65–74",
        "55–64",
        "45–54",
        "25–44",
        "Under 25",
    ]

    pathGenerators.forEach( (generator, i) => {
        paths.append('path')
            .datum(data)
            .attr("d", d => generator(<any>d))
            .attr("stroke", colors[i])


         paths.append("rect")
            .datum(data)
            .attr("y", d => xScale(d[d.length-1][properties[i]])-15)
            .attr("x", w-margin)
            .attr("width", 80)
            .attr("height", 20)
            .attr("fill", colors[i])
            .style("font-family", font)

        paths.append("text")
            .datum(data)
            .text(labels[i])
            .attr("y", d => xScale(d[d.length-1][properties[i]]))
            .attr("x", w-margin+5)
            .attr("fill", "white")
            .style("font-family", font)
            .style("font-weight", "bold")

    }
    )

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
