import * as d3 from "d3";
import * as glob from "./globals.json"
let l = console.log



export function draw() {
    d3.csv("/data/mortality-rate.csv").then((csv: any) => {
        let data = csv.map((d) => {
            return {
                date: new Date(Date.parse(d["date"])),
                popshare_54: parseFloat(d["popshare-54"]),
                popshare55_64: parseFloat(d["popshare55-64"]),
                popshare65_74: parseFloat(d["popshare65-74"]),
                popshare75: parseFloat(d["popshare75+"]),
            }
        } )

        graph(data)
    })
}



function graph(data:MortalityData[]) {
    let chart = d3.select("#older")
        .append("svg")



    const h:number = glob["height"]
    const w:number = glob["width"]
    const color = glob["fontColor"]
    const font = glob["fontFamily"]
    const lineWeight = 3
    const margin = 80

    const colors = [
        "rgb(130, 130, 130)",
        "rgb(38, 148, 222)",
        "rgb(47, 105, 160)",
        "rgb(154, 129, 232)",
    ]


    let pathGenerators = []
    let properties = []


    let stack = (d3.stack()
        .keys(["popshare_54", "popshare55_64", "popshare65_74", "popshare75_85"]))(<any>data)

    for (let prop in data[0]) {
        if( data[0].hasOwnProperty( prop ) && prop !== "date" ) {
            pathGenerators.push(
                d3.area()
                .x((stack, i) => { return xScale(data[i]["date"])})
                .y1((d) => yScale(d[1] || 1))
                .y0( (d => yScale(d[0]))
                ))

            properties.push(prop)
        } 
    }

    // Scales
    const yScale = d3.scaleLinear()
        .domain([ 0, 1])
        .range([h-margin, margin])

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d["date"]))
        .range([margin, w-margin])

    chart
        .attr("width", w)
        .attr("height", h)

    axes(chart, xScale, yScale, w, h, margin, color, font, lineWeight)
    paths(chart, data, stack, lineWeight, pathGenerators, colors, yScale, properties, w, margin, font)

}


function paths(chart, data, stack, lineWeight,pathGenerators, colors, yScale, properties, w, margin, font) {

    let paths = chart.append("g").attr("class", "paths")
    const labels = [
        "Under 55",
        "55–64",
        "65–74",
        "75–84",
    ]

    pathGenerators.forEach( (generator, i) => {
        window["gen"] = generator
        paths.append('path')
            .datum(stack[i])
            .attr("d", d =>  { l(d); return generator(d)} )
            .attr("fill", colors[i])

  paths.append("rect")
            .datum(data)
            .attr("y", d => yScale(stack[i][stack[i].length-1][1] || 1)+10)
            .attr("x", w-margin)
            .attr("width", 80)
            .attr("height", 20)
            .attr("fill", colors[i])
            .style("font-family", font)


        paths.append("text")
            .datum(stack[i])
            .text(labels[i])
            .attr("y", d => yScale(stack[i][stack[i].length-1][1] || 1)+25)
            .attr("x", w-margin+5)
            .attr("fill", "white")
            .style("font-family", font)
            .style("font-weight", "bold")


    }
    )

    paths.selectAll("path")
        .attr("stroke-width", lineWeight)
}


function axes(chart, xScale, yScale, w, h, margin, color, font, lineWeight) {
    let axes = []
    axes.push(
        chart.append("g")
        .attr("class", "axisLeft")
        .attr("transform", `translate(${margin}, 0)`)
        .call(axisLeft(yScale, w))
    )


    axes.push(
        chart.append("g")
        .attr("class", "axisBottom")
        .attr("transform", `translate(0, ${h-margin})`)
        .call(axisBottom(xScale, h))
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
    return d3.axisLeft(scale).tickSize(-w).tickPadding(10).tickFormat(d3.format(".0%"));
}

function axisBottom(scale, h) {
    return d3.axisBottom(scale).tickSize(-h).tickPadding(10)
}
