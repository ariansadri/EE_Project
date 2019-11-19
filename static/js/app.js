// I am getting the references

var datainfo = data;
tbody = d3.select("tbody")

function displayData(data) {
    tbody.text("");
    data.forEach(function(ufosighting) {
        rows_table = tbody.append("tr")

        Object.entries(ufosighting).forEach(function([key, value]) {

            tabled = rows_table.append("td").text(value)
        });

    })
};
displayData(datainfo)
var button = d3.select("#filter-btn")
var dateEntry = d3.select("#datetime");

//I use the following function to filter the data based on the data that the users entered
function clickSelect() {
    d3.event.preventDefault();

    //To print the date entry values
    console.log(dateEntry.property("value"));
    //I use the fitereddata based on the input date and show it in defferent Table
    var filteredData = datainfo.filter(ufosighting => ufosighting.datetime === dateEntry.property("value"))

    //Print the new table
    displayData(filteredData);
}
//Event listener
dateEntry.on("change", clickSelect);