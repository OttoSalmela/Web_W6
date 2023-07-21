import { Chart } from "/node_modules/frappe-charts/dist/frappe-charts.esm.js"

const submitButton = document.getElementById("submit-data")
const jsonQuery = {
    "query": [
        {
            "code": "Vuosi",
            "selection": {
                "filter": "item",
                "values": [
                    "2000",
                    "2001",
                    "2002",
                    "2003",
                    "2004",
                    "2005",
                    "2006",
                    "2007",
                    "2008",
                    "2009",
                    "2010",
                    "2011",
                    "2012",
                    "2013",
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019",
                    "2020",
                    "2021"
                ]
            }
        },
        {
            "code": "Alue",
            "selection": {
                "filter": "item",
                "values": [
                    "SSS"
                ]
            }
        },
        {
            "code": "Tiedot",
            "selection": {
                "filter": "item",
                "values": [
                    "vaesto"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
}


const getData = async () => {
    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

    const res = await fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonQuery)
    })
    if(!res.ok) {
        return;
    }
    const data = await res.json()

    return data
}

async function getMunicipalityData() {
    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"
    const dataPromise = await fetch(url)
    const dataJSON = await dataPromise.json()

    return dataJSON
}

const buildChart = async (municipality) => {
    
    const municipalityData = await getMunicipalityData()
    const municipalityName = municipality
   
    var municipalityID = municipalityData.variables[1].valueTexts.indexOf(municipalityName);
    var municiplaityNumber = municipalityData.variables[1].values[municipalityID]

    jsonQuery.query[1].selection.values[0] = municiplaityNumber
    console.log(jsonQuery)

    const data = await getData()

    


    const vuosi = Object.values(data.dimension.Vuosi.category.label);
    const alue = Object.values(data.dimension.Alue.category.label);
    const arvot = data.value

    const chartData = {
        labels: vuosi,
        datasets: [
            {
                values: arvot
            }
        ]
    }


    const chart = new Chart("#chart", {
        title: "Population data",
        data: chartData,
        type: "line",
        height: 450,
        colors: ['#eb5146'],
    })

}

submitButton.addEventListener("click", function() {
    var municipality = document.getElementById("input-area").value;
    console.log(municipality)
    buildChart(municipality)

})

getData()