import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { saveAs } from "file-saver";
import {
  Card,
  CardContent,
  Grid,
  Switch,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StreamingTask() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [mockData, setMockData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Real-Time Data",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  const [filterText, setFilterText] = useState("");

  const generateMockData = () => {
    return {
      id: Date.now(),
      value: (Math.random() * 100).toFixed(2),
      timestamp: new Date().toISOString(),
    };
  };

  const toggleStreaming = () => {
    setIsStreaming((prev) => !prev);
  };
  const canvasRef = useRef(null);
  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        const newData = generateMockData();
        setMockData((prev) => [newData, ...prev].slice(0, 20));
        setChartData((prev) => ({
          ...prev,
          labels: [...prev.labels, newData.timestamp].slice(-20),
          datasets: [
            {
              ...prev.datasets[0],
              data: [...prev.datasets[0].data, newData.value].slice(-20),
            },
          ],
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  useEffect(() => {
    if (canvasRef.current) {
      const chartInstance = new ChartJS(canvasRef.current, {
        type: "line",
        data: chartData,
        options: {
          maintainAspectRatio: false,
        },
      });

      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }
  }, [chartData]);
  
  const exportToCSV = () => {
    const csvData = mockData
      .map((item) => `${item.timestamp},${item.value}`)
      .join("\n");
    const blob = new Blob([`Timestamp,Value\n${csvData}`], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "mock_data.csv");
  };

  return (
    <>
      {/* Controls */}
      <Card sx={{ mb: 4  ,  mt: 10}}>
        <CardContent >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Switch
                checked={isStreaming}
                onChange={toggleStreaming}
                color="primary"
              />
            </Grid>
            <Grid item>
              <Typography variant="body1">
                {isStreaming ? "Streaming On" : "Streaming Off"}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={exportToCSV}
              >
                Export to CSV
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filter Input */}
      <TextField
        label="Filter data"
        variant="outlined"
        fullWidth
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* Real-Time Chart */}
      <Box sx={{ mb: 4, height: 400 }}>
        <Line data={chartData} options={{ maintainAspectRatio: false }} />
      </Box>

      {/* Real-Time Data List */}
      <Card>
        <CardContent>
        <TextField
        label="Filter data"
        variant="outlined"
        fullWidth
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ mb: 4 }}
      />
          <List>
            {mockData
              .filter((item) => item.value.includes(filterText))
              .map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={`Value: ${item.value}`}
                    secondary={`Timestamp: ${item.timestamp}`}
                  />
                </ListItem>
              ))}
          </List>
        </CardContent>
      </Card>
    </>
  );
}

export default StreamingTask;
