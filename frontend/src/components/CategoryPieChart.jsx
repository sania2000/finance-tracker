
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import API from "../utils/api";


//chart colors
const COLORS = [
  "#64B5F6",
  "#81C784",
  "#FFD54F",
  "#BA68C8",
  "#4DB6AC",
  "#FF8A65",
  "#AED581",
  "#4FC3F7",
];

export default function CategoryPieChart({ month }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!month) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await API.get("/reports/category-pie", { params: { month } });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching category‐pie data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month]);

  if (loading) return <p>Loading chart…</p>;
  if (!data.length) {
    return (
      <p style={{ textAlign: "center", color: "var(--color-text-light)" }}>
        No expense data for {month}.
      </p>
    );
  }

  const renderDynamicLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const fontSize = outerRadius * 0.25;
    const percentageText = `${(percent * 100).toFixed(0)}%`;

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="600"
      >
        {percentageText}
      </text>
    );
  };

  return (
    <div className="form-card">
      <div style={{ width: "100%", aspectRatio: "1 / 1" }}>
        <ResponsiveContainer width="100%" height="100%" aspect={1}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              innerRadius="40%"
              paddingAngle={2}
              labelLine={false}
              label={renderDynamicLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `€${value.toFixed(2)}`} wrapperStyle={{ pointerEvents: "none" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div
        className="custom-legend"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "var(--space-3)",
          marginTop: "var(--space-3)",
        }}
      >
        {data.map((entry, index) => (
          <div
            key={`legend-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: "50%",
              }}
            />
            <span style={{ fontSize: "var(--text-base)", color: "var(--color-text)" }}>
              {entry.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
