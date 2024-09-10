// Get the value of the 'role' cookie
var roleCookie = document.cookie
  .split("; ")
  .find((row) => row.startsWith("role="));

if (roleCookie) {
  const roleValue = roleCookie.split("=")[1];

  // Check if the role is 'basic'
  if (roleValue === "Basic") {
    // If the role is 'basic', add the 'd-none' class to the 'page-container' element
    const pageContainer = document.querySelector(".page-container");

    pageContainer.remove();

    window.location.href = "/create-invoice";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];
    // Make an API call to get-category (replace with your actual API endpoint)
    const response = await fetch("/api/v1/invoice/get-total-sales", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Handle successful login
      const data = await response.json();

      document.getElementById("new_customer").innerHTML =
        data.data.totalNewCustomers;

      document.getElementById("non_returning_Customer").innerHTML =
        data.data.totalReturningCustomers;

      document.getElementById("returning_Customer").innerHTML =
        data.data.totalNonReturningCustomers;

      const ctx = document.getElementById("myChart");
      ctx.height = 292;

      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["New", "Returning", "NR Customers"],
          datasets: [
            {
              labels: ["New", "Returning", "NR Customers"],
              data: [
                data.data.totalNewCustomers,
                data.data.totalReturningCustomers,
                data.data.totalNonReturningCustomers,
              ],
              backgroundColor: ["#2AAA8A", "#886CFF", "#FFCE56"], // Colors for segments
              hoverOffset: 8, // Distance from the chart when hovered
            },
          ],
        },

        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            display: false,
            position: "bottom",
            labels: {
              fontColor: "#71748d",
              fontFamily: "Circular Std Book",
              fontSize: 14,
            },
          },
          tooltips: {
            enabled: true,
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });

      const mybarChart = document.getElementById("mybarChart");
      mybarChart.height = 300;
      new Chart(mybarChart, {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "",
              data: data.data.this_month_each_week_day_sales_qty,
              borderWidth: 0, // Remove bar borders
              backgroundColor: "#3F87F5",
              barPercentage: 0.3,
              categoryPercentage: 0.7,
              borderRadius: 15, // Set the bar border radius to round the bars
            },
          ],
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false,
              },
              ticks: {
                padding: 10,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
              ticks: {
                padding: 15,
              },
            },
          },
        },
      });
    } else {
      alert("erro");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];
    // Make an API call to get-category (replace with your actual API endpoint)

    let page = 1;
    let limit = 5;

    let loadingDiv = showLoading();
    const response = await fetch(
      `/api/v1/invoice/get-invoice?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    hideLoading(loadingDiv);

    if (response.ok) {
      // Handle successful login
      const data = await response.json();

      console.log(data);

      if (data.data.length === 0) {
        return (document.getElementById(
          "display-invoice-list"
        ).innerHTML = `<tr>
                          <td>
                              No data available.
                          </td>

                      </tr>`);
      }

      let res = data.data
        .map((item, index) => {
          return `

              <tr>
                      <td>#${index + 1}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="d-flex align-items-center">
                            <h6 class="m-l-10 m-b-0">${item.customer}</h6>
                          </div>
                        </div>
                      </td>
                      <td>${item.invDate}</td>
                      <td>₹ ${item.netAmount} </td>
                    </tr>

                          `;
        })
        .join("");

      document.getElementById("display-invoice-list").innerHTML = res;
    } else {
      alert("erro");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

let onLoadGrap = async () => {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];
    // Make an API call to get-category (replace with your actual API endpoint)

    function getCurrentYear() {
      var d = new Date();
      var n = d.getFullYear();
      return n;
    }
    let currentYear = getCurrentYear();

    const response = await fetch(
      `/api/v1/invoice/graph-monthly-yearly-data?year=${currentYear}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      // Handle successful login
      const data = await response.json();

      console.log(data);

      const DATA_COUNT = 12;
      const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

      // Custom utility functions for generating data and labels
      const Utils = {
        months: ({ count }) => {
          const labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          return labels;
        },
        numbers: (config) => {
          const { count, min, max } = config;
          const data = [];
          for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
          }
          return data;
        },
        CHART_COLORS: {},
      };

      const labels = Utils.months({ count: DATA_COUNT });
      const barChart = document.getElementById("myBarChart");
      const barCtx = barChart.getContext("2d");
      barChart.height = 120;

      new Chart(barCtx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Income",
              data: data.data.income,
              borderColor: Utils.CHART_COLORS.blue,
              backgroundColor: Utils.CHART_COLORS.blue,
              fill: true,
            },
            {
              label: "Expense",
              data: data.data.expense,
              borderColor: Utils.CHART_COLORS.red,
              backgroundColor: Utils.CHART_COLORS.red,

              fill: true,
            },
            {
              label: "Profit",
              data: data.data.totalIncome,
              borderColor: Utils.CHART_COLORS.green,
              backgroundColor: Utils.CHART_COLORS.green,
              fill: true,
            },
            {
              label: "Customers",
              data: data.data.customerCount,
              borderColor: Utils.CHART_COLORS.yellow,
              backgroundColor: Utils.CHART_COLORS.yellow,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: (ctx) => "Business Statistics",
            },
            tooltip: {
              mode: "index",
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
          scales: {
            // x: {
            //   title: {
            //     display: true,
            //     text: ''
            //   }
            // },
            // y: {
            //   stacked: true,
            //   title: {
            //     display: true,
            //     text: ''
            //   }
            // }
          },
        },
      });
    } else {
      alert("erro");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

window.onload = onLoadGrap();

// Reference the select element
const selectYear = document.getElementById("year_select");

function updateResults() {
  // Get the selected values
  const selectedYear = selectYear.value;
  // Construct the API URL with both parameters
  const apiUrl = `/api/v1/invoice/graph-monthly-yearly-data?year=${selectedYear}`;
  // Call the API
  fetchData(apiUrl); // Make sure fetchData function is defined somewhere in your code
}
// Add a 'change' event listener to the select elements
selectYear.addEventListener("change", updateResults);
// Function to fetch data from the API
// ...
// Function to fetch data from the API
function fetchData(apiUrl) {
  // Get the canvas element
  const barChart = document.getElementById("myBarChart");

  // Destroy the existing chart if it exists
  if (barChart.chart) {
    barChart.chart.destroy();
  }

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // ... Your chart creation code here ...

      const DATA_COUNT = 12;
      const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

      // Custom utility functions for generating data and labels
      const Utils = {
        months: ({ count }) => {
          const labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          return labels;
        },
        numbers: (config) => {
          const { count, min, max } = config;
          const data = [];
          for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
          }
          return data;
        },
        CHART_COLORS: {},
      };

      const labels = Utils.months({ count: DATA_COUNT });
      const barChart = document.getElementById("myBarChart");
      const barCtx = barChart.getContext("2d");
      barChart.height = 120;
      barChart.chart = new Chart(barCtx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Income",
              data: data.data.income,
              borderColor: Utils.CHART_COLORS.blue,
              backgroundColor: Utils.CHART_COLORS.blue,
              fill: true,
            },
            {
              label: "Expense",
              data: data.data.expense,
              borderColor: Utils.CHART_COLORS.red,
              backgroundColor: Utils.CHART_COLORS.red,

              fill: true,
            },
            {
              label: "Profit",
              data: data.data.totalIncome,
              borderColor: Utils.CHART_COLORS.green,
              backgroundColor: Utils.CHART_COLORS.green,
              fill: true,
            },
            {
              label: "Customers",
              data: data.data.customerCount,
              borderColor: Utils.CHART_COLORS.yellow,
              backgroundColor: Utils.CHART_COLORS.yellow,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: (ctx) => "Business Statistics",
            },
            tooltip: {
              mode: "index",
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
          scales: {
            // x: {
            //   title: {
            //     display: true,
            //     text: ''
            //   }
            // },
            // y: {
            //   stacked: true,
            //   title: {
            //     display: true,
            //     text: ''
            //   }
            // }
          },
        },
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
