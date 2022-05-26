import React, { useSate } from "react"
import { Chart } from "react-google-charts"

const SummaryChart = (props) => {
  const { total, macros } = props.log
  const pieData = [
    ["Macronutrient", "Percent of Total Calories"],
    ["Fat", macros.fat],
    ["Protein", macros.protein],
    ["Carbs", macros.carbs]
  ]
  const pieOptions = {
    chartArea: {width: 300, height: 300},
    colors: ["#d9584a", "#4cb17f", "#37412a"],
    pieHole: 0.4,
    is3D: false
  }
  const barData = [
    [
      "Nutrient",
      "Total",
      { role: "style" },
      {
        sourceColumn: 0,
        role: "annotation",
        type: "string",
        calc: "stringify"
      }
    ],
    ["Fat", total.fat, "#d9584a", null],
    ["Protein", total.protein, "#4cb17f", null],
    ["Carbs", total.carbs, "#37412a", null]
  ]
  const barOptions = {
    width: 480,
    height: 200,
    bar: { groupWidth: "95%"},
    legend: { position: "none" }
  }

  return (
    <div className="grid-x grid-margin-x">
      <div className="form">
        <h5>Nutrient Totals</h5>
        <Chart 
          chartType="BarChart"
          width="100%"
          data={barData}
          options={barOptions}
        />
      </div>
      <div className="form">
        <h5>Macros</h5>
        <Chart 
          chartType="PieChart"
          width="100%"
          height="200px"
          data={pieData}
          options={pieOptions}
        />
      </div>
    </div>
  )
}

export default SummaryChart